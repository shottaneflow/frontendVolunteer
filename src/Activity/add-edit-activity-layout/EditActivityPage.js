import React, { useEffect, useState } from "react";
import apiClient from "../../apiClient";
import {useParams, useNavigate, Link} from "react-router-dom";
import {handleError} from "../../errorHandler";
import './AddEditActivityPage.css';

const EditActivityPage = () => {
    const { activityId } = useParams();
    const { eventId } = useParams();
    const [activity, setActivity] = useState(null);
    const [activities, setActivities] = useState(null);
    const [languages, setLanguages] = useState([]); // Все языки из БД
    const [selectedLanguages, setSelectedLanguages] = useState([]); // Выбранные языки
    const [locations, setLocations] = useState([]);
    const [newLocation, setNewLocation] = useState("");
    const [maxreq,setMaxReq] = useState(1);
    const [required,setRequired] = useState(0);
    const navigate = useNavigate();
    const [bol,setBol] = useState(false);
    const [is_location,setIsLocation] = useState(false);

    const countRequiredVol=()=>{
        let req = required;
        let v = 0;
        if(activities!=null){
            activities.map((activity) =>{
                v += activity.requiredVolunteers
            })
            v = req - v;
        }
        setMaxReq(v);
    }

    useEffect(() => {
        // Загрузка мероприятия
        const fetchActivity = async () => {
            try {
                const response = await apiClient.get(`http://localhost:8081/admin/events-api/${eventId}/activity/${activityId}`);
                setActivity(response.data);
                setSelectedLanguages(response.data.languages || []);
                setLocations(response.data.locations || []);
            } catch (error) {
                handleError(error, navigate);
            }
        };
        const fetchActivities = async () => {
            try {
                const response = await apiClient.get(`http://localhost:8081/events-api/${eventId}/activities`);
                setActivities(response.data.filter((activity)=>{
                    return activity.id != activityId
                }
                ));
                setBol(true);
            } catch (error) {
                handleError(error, navigate);
            }
        };
        // Загрузка всех языков
        const fetchLanguages = async () => {
            try {
                const response = await apiClient.get("http://localhost:8081/language-api/all-languages");
                setLanguages(response.data);
            } catch (error) {
                handleError(error, navigate);
            }
        };
        const fetchEvent = async () => {
            try {
                const response = await apiClient.get(`http://localhost:8081/admin/events-api/events/${eventId}`);
                setRequired(response.data.requiredVolunteers);
            } catch (error) {
                handleError(error, navigate);
            }
        };
        fetchEvent();
        fetchActivity();
        fetchActivities();
        fetchLanguages();
        countRequiredVol();
    }, [activityId,bol]);
    


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setActivity((prev) => ({ ...prev, [name]: value }));
    };

    const handleLanguageToggle = (language) => {
        setSelectedLanguages((prev) => {
            if (prev.some((lang) => lang.id === language.id)) {
                return prev.filter((lang) => lang.id !== language.id);
            } else {
                return [...prev, language];
            }
        });
    };

    const handleAddLocation = () => {
        if (newLocation.trim()) {
            if(!locations.some((location)=>{
                return location.name === newLocation
            })){
            const tempId = Date.now(); // Временный уникальный ID
            setLocations((prev) => [...prev, { id: null, tempId, name: newLocation.trim() }]);
            setNewLocation("");
            }
            else setIsLocation(true);
        }
    };

    const getMinDateTime = () => {
        const now = new Date();
        return now.toISOString().slice(0, 16); // Формат для <input type="datetime-local">
    };

    const handleDeleteLocation = (idOrTempId) => {
        setLocations((prev) =>
            prev.filter((location) => location.id !== idOrTempId && location.tempId !== idOrTempId)
        );
    };


    const handleSave = async (e) => {
        e.preventDefault();
        if(locations.length > 0){
            if(!activities.some((activities)=>{
                return activities.name === activity.name
            })){
                try {
                    const updatedLocations = locations.map(({ tempId, ...rest }) => rest); // Удаляем tempId
                    const updatedActivity = { ...activity, languages: selectedLanguages, locations: updatedLocations };
                    await apiClient.post(`http://localhost:8081/admin/events-api/${eventId}/edit-activity/${activityId}`, updatedActivity);
                    navigate(`/events/${eventId}/activities`);
                } catch (error) {
                    handleError(error, navigate);
                }
            }
            else alert(`Локация с именем "${activity.name}" уже существует`);
        }
        else alert("Введите локации для мероприятия");
    };

    if (!activity) return <div>Загрузка...</div>;

    return (
        <div className="act-add-change-form">
            <div style={{display:"flex", flexDirection:"column"}}>
                <Link to="/events" className="act-link">
                    на главную
                </Link>
                <Link to="/requests" className="act-link">
                    просмотр заявок
                </Link>
            </div>
            <form onSubmit={handleSave}>
                <div className="act-add-form">
                    <label style={{fontSize:"18px"}}>Мероприятие:</label>
                    <input
                            className="act-second-column"
                            type="text"
                            autoComplete="off"
                            name="name"
                            value={activity.name}
                            onChange={handleInputChange}
                            maxLength="150"
                            required
                    />
                    <label style={{fontSize:"18px"}}>Время начала:</label>
                    <input
                            className="act-second-column"
                            type="datetime-local"
                            name="startDate"
                            value={activity.startDate ? activity.startDate : ""}
                            onChange={handleInputChange}
                            min={getMinDateTime()}
                            required
                    />
                    <label style={{fontSize:"18px"}}>Языки:</label>
                    <div style={{display:"flex",flexDirection:"row"}}>
                    {languages.map((language) => (
                        <div key={language.id}>
                            <input
                                className="check-box"
                                type="checkbox"
                                checked={selectedLanguages.some((lang) => lang.id === language.id)}
                                onChange={() => handleLanguageToggle(language)}
                            />
                            <label style={{fontSize:"14px"}}>
                                {language.name}
                            </label>
                        </div>
                    ))}
                    </div>
                </div>
                    <div style={{display:"flex",gap:"10px"}}>
                        <label style={{margin:"1px 0px",fontSize:"18px"}}>Количество волонтеров:</label>
                        <div style={{flex:1}}>
                            <input
                                className="act-req-vol"
                                type="number"
                                name="requiredVolunteers"
                                autoComplete="off"
                                value={activity.requiredVolunteers}
                                onChange={handleInputChange}
                                required
                                min="1"
                                max={maxreq}          
                            />
                        </div>
                    </div>
                <div className="location-form">              
                    <h4 style={{margin:"0px"}}>Локации:</h4>
                    {locations.length > 0 && (
                        <>
                            {locations.map((location) => (
                                <div key={location.id || location.tempId} style={{display:"flex",flexDirection:"row"}}>
                                    <input
                                        type="text"
                                        maxLength="150"
                                        minLength="0"
                                        className="act-req-vol"
                                        style={{width:"47%"}}
                                        value={location.name}
                                        disabled
                                    />
                                    <div className="act-delete-location"><label className="act-delete-location-label" onClick={() => handleDeleteLocation(location.id || location.tempId)}>—</label></div>
                                </div>
                            ))}
                        </>
                    )}
                    <div style={{display:"flex",flexDirection:"row",position:"relative"}}>
                        <input 
                            className="act-req-vol"
                            style={{width:"49%"}}
                            type="text"
                            maxLength="150"
                            minLength="0"
                            value={newLocation}
                            onChange={(e) => {
                                setIsLocation(false);
                                setNewLocation(e.target.value)}}
                        />
                        <button type="button" className="act-add-location" onClick={handleAddLocation}>добавить локацию</button>
                        {is_location && (
                            <div className="act-location">
                                <label>Локация уже существует</label>
                            </div>
                        )}
                    </div>
                </div>
                <button type="submit" className="act-submit">
                    Редактировать мероприятие
                </button>
            </form>
        </div>
    );
};

export default EditActivityPage;
