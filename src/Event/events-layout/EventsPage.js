import React, { cloneElement, useEffect, useState,useRef, use } from "react";
import apiClient from "../../apiClient";
import { useNavigate } from "react-router-dom";
import { handleError } from "../../errorHandler";
import FiltrDropDown from "./event-components/FiltrDropDown"
import './EventsPage.css'
import { useSelector} from "react-redux";

const EventsPage = () => {
    const filtr_list_status = useSelector(state => state.filtr_list_status);
    const filtr_list_type = useSelector(state=>state.filtr_list_type);
    const [events, setEvents] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]); // Фильтрация по типу
    const [selectedStatuses, setSelectedStatuses] = useState([]); // Фильтрация по статусу
    const roles = JSON.parse(localStorage.getItem("userRoles"));
    const [sort,setSort] = useState("убывание");
    const [isOpenStatus,setOpenStatus] = useState(false);
    const [isOpenType,setOpenType] = useState(false);

    const handleSortOrder = () =>{
        if(sort == "возрастание"){
            setSort("убывание");   }
        if(sort == "убывание"){
            setSort("возрастание");
        }
    }

    // Проверяем, есть ли среди ролей "ROLE_ADMIN"
    const isAdmin = roles.some(role => role.authority === "ROLE_ADMIN");
    const isUser = roles.some(role => role.authority === "ROLE_USER");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                let url = isAdmin
                    ? "http://localhost:8081/admin/events-api/all-events"
                    : "http://localhost:8081/events-api/all-events";

                // Добавляем фильтрацию по типу
                if (selectedTypes.length > 0) {
                    const typesUrl = `http://localhost:8081/events-api/events/filter/type?types=${selectedTypes.join('&types=')}`;
                    const typeResponse = await apiClient.get(typesUrl);
                    setEvents(typeResponse.data);
                }

                // Добавляем фильтрацию по статусу
                if (selectedStatuses.length > 0) {
                    const statusUrl = `http://localhost:8081/events-api/events/filter/status?status=${selectedStatuses.join('&status=')}`;
                    const statusResponse = await apiClient.get(statusUrl);
                    setEvents((prevEvents) => {
                        // Фильтруем события по типу и статусу
                        const filteredByStatus = statusResponse.data.filter(event =>
                            selectedTypes.length === 0 || selectedTypes.includes(event.type)
                        );
                        return filteredByStatus;
                    });
                }

                if (selectedTypes.length === 0 && selectedStatuses.length === 0) {
                    const response = await apiClient.get(url);
                    setEvents(response.data);
                }
            } catch (error) {
                handleError(error, navigate);
            }
        };

        fetchEvents();
    }, [isAdmin, selectedTypes, selectedStatuses]); // Завершаем зависимость от фильтров

    const getSortedEvents = () => {
        return [...events].sort((event1, event2) => {
            const date1 = new Date(event1.dateTime);
            const date2 = new Date(event2.dateTime);
    
            return sort === "возрастание" ? date1 - date2 : date2 - date1;
        });
    };
    const handleEditEvent = (eventId) => {
        navigate(`/events/${eventId}/edit`);
    };

    const handleAddEvent = () => {
        navigate("/add-event");
    };

    const handleOpenActivities = (eventId,name) => {
        navigate(`/events/${eventId}/activities`);
        sessionStorage.setItem("name", name);
    };

    const handleDeleteEvent = async (id) => {
        try {
            await apiClient.delete(`http://localhost:8081/admin/events-api/events/${id}`);
            setEvents(events.filter((event) => event.id !== id)); // Обновляем локальный список
        } catch (error) {
            handleError(error, navigate);
        }
    };

    // Функции для изменения фильтров
    const handleTypeFilterChange = (value) => {
        setSelectedTypes(prev =>
            prev.includes(value) ? prev.filter(type => type !== value) : [...prev, value]
        );
    };

    const handleStatusFilterChange = (value) => {
        setSelectedStatuses(prev =>
            prev.includes(value) ? prev.filter(status => status !== value) : [...prev, value]
        );
    };

    return (
        <div className="mainstyle">
            

            <div className="header">
                <div style={{position:"relative",maxWidth:"220px"}}>
                    <div className="about label_f">
                        <a className="event-list-link" href="/about-system" target="_blank" rel="noopener noreferrer"> Сведения о системе</a>
                        <a className="event-list-link" href="/about-developers">Сведения о разработчиках</a>
                        <div>
                            {isUser && (
                                <a className="event-list-link" href="/profile">
                                    Перейти в профиль
                                </a>
                            )}
                            {isAdmin && (
                                <a className="event-list-link" href="/requests">
                                    Нерасмотренные заявки
                                </a>
                            )}
                        </div>
                    </div>
                </div>
                <div className="setting_list">
                        <div className="filtr_header">
                            <div className="change_f">
                                <label className="label_f event-list-link" onClick={()=>{setOpenStatus(!isOpenStatus)}}>фильтровать по статусу</label>
                                <FiltrDropDown filtr_list = {filtr_list_status} isOpen={isOpenStatus} change={handleStatusFilterChange} setIsOpen={setOpenStatus} />
                            </div>
                            <div className="change_f">
                                <label className="label_f event-list-link" onClick={()=>{setOpenType(!isOpenType)}}>фильтровать по типу</label>
                                <FiltrDropDown filtr_list = {filtr_list_type} isOpen={isOpenType} change={handleTypeFilterChange} setIsOpen={setOpenType} />
                            </div>
                        </div>
                        <select value={sort} onChange={handleSortOrder} className="change_s">
                            <option value={`${sort}`} disabled hidden>cортировка по времени: {sort}</option>
                            <option>cортировка по времени: {sort!="убывание" ? "убывание" : "возрастание"}</option>
                        </select>
                </div>
            </div>
            <h2 style={{height:"30px",marginTop:"15px", marginBottom:"0px",marginLeft:"1px"}}>События:</h2>
                {(events.length < 1 && selectedTypes ==0 && selectedStatuses ==0 ) && (
                    <div style={{borderTop:"1px solid black",display:"flex", borderBottom:"1px solid black",height:"200px",alignItems:"center",justifyContent:"center"}}>
                            <a>Событий нет</a>
                    </div>
                )}
                {(events.length < 1 && (selectedTypes !=0 || selectedStatuses !=0)) && (
                    <div style={{borderTop:"1px solid black",display:"flex", borderBottom:"1px solid black",height:"200px",alignItems:"center",justifyContent:"center"}}>
                            <a>Событий c такими фильтрами нет</a>
                    </div>
                )}
            <table className="event-table">
                <tbody>
                {getSortedEvents().map((event,index) => {                                
                        return(
                            <tr key={event.id}>
                                <th style={{verticalAlign:"top"}} className="event-name-column">
                                    <a style={{fontSize:"19px"}} onClick={()=>handleOpenActivities(event.id,event.name)} >
                                        Событие №{index+1}
                                    </a>
                                    <div className="event-table-second-line event-name">
                                        <a onClick={()=>handleOpenActivities(event.id)}>
                                        {event.name}
                                        </a>
                                    </div>
                                </th>
                                <th style={{verticalAlign:"top"}}>
                                    <div className="event-table-second-line" style={{marginTop:"22px"}}>
                                        <a>
                                            {event.registeredVolunteers === null ? "0": event.registeredVolunteers}/{event.requiredVolunteers}
                                        </a>
                                    </div>
                                </th>
                                <th style={{verticalAlign:"top",width:"100px"}}>
                                    <a style={{fontSize:"18px"}}>
                                        Дата
                                    </a>
                                    <div className="event-table-second-line">
                                        {new Date(event.dateTime).toLocaleString('default', {day:'numeric', month:"2-digit",year:'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </th>
                                <th style={{verticalAlign:"top"}}>
                                    <a style={{fontSize:"18px"}}>
                                        Тип
                                    </a>
                                    <div className="event-table-second-line">
                                        {event.type}
                                    </div>
                                </th>
                                <th style={{verticalAlign:"top"}}>
                                    <div className="event-table-field">
                                        <a style={{fontSize:"18px"}}>
                                            Статус
                                        </a>
                                        <div className="event-table-second-line">
                                            {event.status}
                                        </div>
                                    </div>
                                </th>
                                {isAdmin && (<th className="event-button">
                                    <div>
                                    {isAdmin && (<button className="toActivity"onClick={() => handleEditEvent(event.id)}>Редактировать</button>)}
                                    {isAdmin && (<button className="delete" onClick={() => handleDeleteEvent(event.id)}>Удалить</button>)}
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
                    <button onClick={handleAddEvent} className="add">Добавить событие</button>
                </div>
            )}

        </div>
    );
};

export default EventsPage;
