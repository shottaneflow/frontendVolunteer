import React, { useEffect, useState } from "react";
import apiClient from "../../apiClient";
import {useParams, useNavigate, Link} from "react-router-dom";
import {handleError} from "../../errorHandler";
import './AddEditActivityPage.css';
const EditActivityPage = () => {
    const { activityId } = useParams();
    const { eventId } = useParams();
    const [activity, setActivity] = useState(null);
    const [languages, setLanguages] = useState([]); // Все языки из БД
    const [selectedLanguages, setSelectedLanguages] = useState([]); // Выбранные языки
    const [locations, setLocations] = useState([]);
    const [newLocation, setNewLocation] = useState("");
    const navigate = useNavigate();

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

        // Загрузка всех языков
        const fetchLanguages = async () => {
            try {
                const response = await apiClient.get("http://localhost:8081/language-api/all-languages");
                setLanguages(response.data);
            } catch (error) {
                handleError(error, navigate);
            }
        };

        fetchActivity();
        fetchLanguages();
    }, [activityId]);

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
            const tempId = Date.now(); // Временный уникальный ID
            setLocations((prev) => [...prev, { id: null, tempId, name: newLocation.trim() }]);
            setNewLocation("");
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
        try {
            const updatedLocations = locations.map(({ tempId, ...rest }) => rest); // Удаляем tempId
            const updatedActivity = { ...activity, languages: selectedLanguages, locations: updatedLocations };
            await apiClient.post(`http://localhost:8081/admin/events-api/${eventId}/edit-activity/${activityId}`, updatedActivity);
            navigate(`/events/${eventId}/activities`);
        } catch (error) {
            handleError(error, navigate);
        }
    };

    if (!activity) return <div>Загрузка...</div>;

    return (
        <div style={{ maxWidth: "500px", margin: "130px auto" }}>
            <div style={{display:"flex", flexDirection:"column"}}>
                <Link to="/events" className="act-link">
                    на главную
                </Link>
                <Link to="/events" className="act-link">
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
                        <div>
                            <input
                                className="check-box"
                                type="checkbox"
                                checked={selectedLanguages.some((lang) => lang.id === language.id)}
                                onChange={() => handleLanguageToggle(language)}
                            />
                            <label style={{fontSize:"14px"}} key={language.id}>
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
                                max="250"          
                            />
                        </div>
                    </div>
                <div className="location-form">              
                    <h4 style={{margin:"0px"}}>Локации:</h4>
                    {locations.length > 0 && (
                        <>
                            {locations.map((location) => (
                                <div key={location.id || location.tempId}>
                                    <input
                                        type="text"
                                        maxLength="150"
                                        minLength="0"
                                        className="act-req-vol"
                                        style={{width:"47%"}}
                                        value={location.name}
                                        disabled
                                    />
                                    <button style={{width:"48%",border:"none",textAlign:"left", backgroundColor:"white",fontSize:"20px",marginLeft:"15px", padding:"0px"}} onClick={() => handleDeleteLocation(location.id || location.tempId)}>—</button>
                                </div>
                            ))}
                        </>
                    )}
                    <div style={{display:"flex",flexDirection:"row"}}>
                        <input 
                            className="act-req-vol"
                            style={{width:"49%"}}
                            type="text"
                            maxLength="150"
                            minLength="0"
                            value={newLocation}
                            onChange={(e) => setNewLocation(e.target.value)}
                        />
                        <button type="button" className="act-add-location" onClick={handleAddLocation}>добавить локацию</button>
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
