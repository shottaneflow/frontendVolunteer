import React, { useEffect, useState,useRef } from "react";
import apiClient from "../../apiClient";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { handleError } from "../../errorHandler";
import "./ActivitiesPage.css";
import { useClickOutside } from "../../useClickOutside";

const ActivitiesPage = () => {
    const { id: eventId } = useParams();
    const [activities, setActivities] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isUser, setIsUser] = useState(false);
    const [userRequests, setUserRequests] = useState([]);
    const [languages, setLanguages] = useState([]); // Все доступные языки
    const [selectedLanguages, setSelectedLanguages] = useState([]); // Выбранные языки для фильтрации
    const navigate = useNavigate();
    const [isOpenFiltr,setOpenFiltr] = useState(false);
    const [sort,setSort] = useState("убывание");
    const menuRef = useRef(null);
    
    useClickOutside(menuRef,()=>{
        if(isOpenFiltr)setTimeout(()=>setOpenFiltr(false),80);
    });

    useEffect(() => {
        const roles = JSON.parse(localStorage.getItem("userRoles"));
        const adminRole = roles && roles.some(role => role.authority === "ROLE_ADMIN");
        const userRole = roles && roles.some(role => role.authority === "ROLE_USER");

        setIsAdmin(adminRole);
        setIsUser(userRole);

        const fetchActivities = async () => {
            try {
                const response = await apiClient.get(
                    adminRole
                        ? `http://localhost:8081/admin/events-api/${eventId}/activities`
                        : `http://localhost:8081/events-api/${eventId}/activities`
                );
                setActivities(response.data);
            } catch (error) {
                handleError(error, navigate);
            }
        };

        const fetchUserRequests = async () => {
            try {
                const response = await apiClient.get("http://localhost:8081/request-api/my-requests");
                setUserRequests(response.data);
            } catch (error) {
                handleError(error, navigate);
            }
        };

        const fetchLanguages = async () => {
            try {
                const response = await apiClient.get("http://localhost:8081/language-api/all-languages");
                setLanguages(response.data);
            } catch (error) {
                handleError(error, navigate);
            }
        };

        fetchActivities();
        fetchUserRequests();
        fetchLanguages();
    }, [eventId]);

    const getFilteredActivities = () => {
        const sortedActivities = getSortedActivities();
        if (selectedLanguages.length === 0) {
            return sortedActivities;
        }
        return sortedActivities.filter(activity =>
            activity.languages.some(language =>
                selectedLanguages.includes(language.id)
            )
        );
    };

    const getSortedActivities = () => {
        if (sort === null) {
            return activities;
        }
        return [...activities].sort((a1, a2) => {
            const date1 = new Date(a1.startDate);
            const date2 = new Date(a2.startDate);
            return sort === "возрастание" ? date1 - date2 : date2 - date1;
        });
    };

    const handleSortOrder = () =>{
        if(sort == "возрастание"){
            setSort("убывание");   }
        if(sort == "убывание"){
            setSort("возрастание");
        }
    }

    const toggleLanguage = (languageId) => {
        setSelectedLanguages((prevSelected) =>
            prevSelected.includes(languageId)
                ? prevSelected.filter((id) => id !== languageId)
                : [...prevSelected, languageId]
        );
    };
    const handleSubmitRequest = async (activityId) => {
        try {
            await apiClient.post(`http://localhost:8081/request-api/add-request/${activityId}`);
            alert("Заявка успешно подана!");
// После подачи заявки, обновляем список заявок
            const response = await apiClient.get("http://localhost:8081/request-api/my-requests");
            setUserRequests(response.data);
        } catch (error) {
            handleError(error, navigate);
        }
    };
    // Функции для удаления, добавления и редактирования мероприятия
    const handleDeleteActivity = async (activityId) => {
        try {
            await apiClient.delete(`http://localhost:8081/admin/events-api/${eventId}/delete-activity/${activityId}`);
            setActivities(activities.filter((activity) => activity.id !== activityId));
        } catch (error) {
            handleError(error, navigate);
        }
    };
    const hasUserSubmittedRequest = (activityId) => {
        return userRequests.some(request => request.activity.id === activityId);
    };
    const handleAddActivity = () => {
        navigate(`/events/${eventId}/activities/create`);
    };

    const handleEditActivity = (activityId) => {
        navigate(`/events/${eventId}/activity/${activityId}/edit`);
    };


    return (
        <div className="act-main-style">
            <div className="header">
            <div className="about label_f">
                <Link to="/events" className="act-list-link">
                    На главную
                </Link>
                {isUser && (
                    <a href="/profile" className="act-list-link">
                        Перейти в профиль
                    </a>
                )}
                {isAdmin && (
                    <a href="/requests" className="act-list-link">
                        Нерасмотренные заявки
                    </a>
                )}
            </div>
            <div className="setting_list">
                <div className="filtr_header">
                    <div className="act-dropdown">
                        <label className="label_f" onClick={()=>{setOpenFiltr(!isOpenFiltr);}}>фильтровать по языкам</label>
                            <nav className={`filtr_menu ${isOpenFiltr ? "active" : ""}`} ref={menuRef}>
                            <div className="filtr_list">
                                {
                                    languages.map((language)=>{
                                        return(
                                            <div key={language.id} className="filtr_item"><input style={{margin: "0px 5px 0px 0px"}} type="checkBox" key={language.id} onChange={()=>toggleLanguage(language.id)}/><label>{language.name}</label></div>
                                        )
                                    })
                                }
                            </div>
                            </nav>
                        </div>
                </div>
                <select value={sort} onChange={handleSortOrder} className="change_s">
                    <option value={`${sort}`} disabled hidden>cортировка по времени: {sort}</option>
                    <option>cортировка по времени: {sort!="убывание" ? "убывание" : "возрастание"}</option>
                </select>
            </div>
        </div>
        <h2 style={{height:"30px",marginTop:"15px", marginBottom:"0px",marginLeft:"1px"}}>Мероприятия для события: {eventId}</h2>
                {(getFilteredActivities().length < 1 && selectedLanguages.length == 0) && (
                    <div style={{borderTop:"1px solid black",display:"flex", borderBottom:"1px solid black",height:"200px",alignItems:"center",justifyContent:"center"}}>
                        <a>Мероприятий нет</a>
                    </div>
                )}                
                {(getFilteredActivities().length < 1 && selectedLanguages.length != 0) && (
                    <div style={{borderTop:"1px solid black",display:"flex", borderBottom:"1px solid black",height:"200px",alignItems:"center",justifyContent:"center"}}>
                        <a>Мероприятий с выбранными фильтрами нет</a>
                    </div>
                )}
            <table className="event-table">
                <tbody>
                {getFilteredActivities().map((activity,index) => {
                        return(
                            <tr style={{borderTop:"2px solid black"}} key={activity.id}>
                                <th style={{verticalAlign:"top"}} className="event-name-column">
                                    <a style={{fontSize:"19px"}}>
                                        Мероприятие №{index+1}
                                    </a>    
                                    <div className="event-table-second-line event-name">
                                        <a>
                                            {activity.name}
                                        </a>
                                    </div>
                                </th>
                                <th style={{verticalAlign:"top"}}>
                                    <div className="event-table-second-line" style={{marginTop:"23px"}}>
                                        <a>
                                            {activity.registeredVolunteers === null ? "0": activity.registeredVolunteers}/{activity.requiredVolunteers}
                                        </a>
                                    </div>
                                </th>
                                <th style={{verticalAlign:"top",width:"100px"}}>
                                    <a style={{fontSize:"18px"}}>
                                        Дата
                                    </a>
                                    <div className="event-table-second-line">
                                        {new Date(activity.startDate).toLocaleString('default', {day:'numeric', month:"2-digit",year:'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </th>
                                <th style={{verticalAlign:"top"}}>
                                    <a style={{fontSize:"18px"}}>
                                        Языки
                                    </a>
                                    <div className="event-table-second-line">
                                        <a>
                                            {activity.languages && activity.languages.length > 0 ? (
                                                <ul className="act-ul">
                                                    {activity.languages.map((language) => (
                                                        <li key={language.id}>{language.name}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p style={{margin:"0px"}}>Языки не указаны</p>
                                            )}
                                        </a>
                                    </div>
                                </th>
                                <th style={{verticalAlign:"top"}}>
                                    <div className="event-table-field">
                                        <a style={{fontSize:"18px"}}>
                                            Локации
                                        </a>
                                        <div className="event-table-second-line">
                                            <a>
                                                {activity.locations && activity.locations.length > 0 ? (
                                                    <ul className="act-ul">
                                                        {activity.locations.map((location) => (
                                                            <li key={location.id}>{location.name}</li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p style={{margin:"0px"}}>Локации не указаны</p>
                                                )}
                                            </a>
                                        </div>
                                    </div>
                                </th>
                                {(isAdmin || (isUser && !hasUserSubmittedRequest(activity.id))) && (
                                    <th className="act-button" style={{verticalAlign:"top"}}>
                                        <div>
                                        {isUser && activity.registeredVolunteers < activity.requiredVolunteers && !hasUserSubmittedRequest(activity.id) && (
                                            <button className="delete" onClick={() => handleSubmitRequest(activity.id)}>Подать заявку</button>
                                        )}
                                        {isAdmin && (<button className="toActivity"onClick={() => handleEditActivity(activity.id)}>Редактировать</button>)}
                                        {isAdmin && (<button className="delete" onClick={() => handleDeleteActivity(activity.id)}>Удалить</button>)}
                                        </div>
                                    </th>
                                )}
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
            {isAdmin && (
                <div className="header">
                    <button onClick={handleAddActivity} className="add">Добавить мероприятие</button>
                </div>
            )}
        </div>
    );
};

export default ActivitiesPage;
