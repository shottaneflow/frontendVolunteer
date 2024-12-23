import React, { useEffect, useState } from "react";
import apiClient from "../../apiClient";
import {useParams, useNavigate, Link} from "react-router-dom";
import {handleError} from "../../errorHandler";
import "./AddEditActivityPage.css";


const AddActivityPage = () => {
    const { id: eventId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        startDate: "",
        requiredVolunteers: "",
        registeredVolunteers: 0,
        languages: [], // выбранные языки
        locations: [] // указанные локации
    });
    const [maxreq,setMaxReq] = useState(0);
    const [required,setRequired] = useState(0);
    const [languages, setLanguages] = useState([]);
    const [newLocation, setNewLocation] = useState("");
    const [activities,setActivities] = useState(null);
    const [bol,setBol] = useState(false);


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
        const fetchLanguages = async () => {
            try {
                const response = await apiClient.get("http://localhost:8081/language-api/all-languages");
                setLanguages(response.data);
            } catch (error) {
                handleError(error, navigate);
            }
        };
        const fetchActivities = async () => {
            try {
                const response = await apiClient.get(`http://localhost:8081/events-api/${eventId}/activities`);
                setActivities(response.data);
                setBol(true);
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
        fetchActivities();
        fetchEvent();
        countRequiredVol();
        fetchLanguages();
    }, [required,bol]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleLanguageToggle = (language) => {
        setFormData((prev) => {
            const exists = prev.languages.some((lang) => lang.id === language.id);
            return {
                ...prev,
                languages: exists
                    ? prev.languages.filter((lang) => lang.id !== language.id)
                    : [...prev.languages, language]
            };
        });
    };

    const handleAddLocation = () => {
        if (newLocation.trim()) {
            setFormData((prev) => ({
                ...prev,
                locations: [...prev.locations, { id: null, name: newLocation.trim() }]
            }));
            setNewLocation("");
        }
    };

    const getMinDateTime = () => {
        const now = new Date();
        return now.toISOString().slice(0, 16);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post(
                `http://localhost:8081/admin/events-api/${eventId}/create-activity`,
                formData
            );
            alert("Мероприятие успешно создано!");
            navigate(`/events/${eventId}/activities`);
        } catch (error) {
            handleError(error, navigate);
        }
    };

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
            <form onSubmit={handleSubmit}>
                <div className ="act-add-form">
                    <label style={{fontSize:"18px"}}>Мероприятие:</label><input
                        className="act-second-column"
                        type="text"
                        autoComplete="off"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        maxLength="150"
                        required
                    />
                    <label style={{fontSize:"18px"}}>Время начала:</label>
                    <input
                        className="act-second-column"
                        type="datetime-local"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
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
                            value={formData.requiredVolunteers}
                            onChange={handleChange}
                            min="1"
                            max={maxreq}
                            required
                        />
                    </div>
                </div>
                <div className="location-form">  
                    <h4 style={{margin:"0px"}}>Локации:</h4>
                    {formData.locations.length >0 && (
                        <ul style={{paddingLeft: "20px", margin: "5px 0px"}}>
                            {formData.locations.map((location, index) => (
                                <li key={index}>
                                    <label style={{width:"50%",textAlign:"left",fontSize:"14px",overflowWrap:"break-word"}}>{location.name}</label>
                                </li>
                            ))}
                        </ul>
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
                        <button type="button" className="act-add-location" onClick={handleAddLocation}>
                            добавить локацию
                        </button>
                    </div>
                </div>
                <button type="submit" className="act-submit">
                    Cоздать мероприятие
                </button>
            </form>
        </div>
    );
};

export default AddActivityPage;
