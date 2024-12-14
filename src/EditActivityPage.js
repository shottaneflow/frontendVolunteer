import React, { useEffect, useState } from "react";
import apiClient from "./apiClient";
import {useParams, useNavigate, Link} from "react-router-dom";

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
                if (error.response) {
                    if (error.response.status === 404) {
                        navigate("/404"); // Перенаправляем на страницу 404
                    } else if (error.response.status === 401) {
                        navigate("/401"); // Перенаправляем на страницу 401
                    } else {
                        console.error("Ошибка при загрузке событий:", error);
                    }
                } else {
                    console.error("Ошибка сети или сервер недоступен:", error);
                }
            }
        };

        // Загрузка всех языков
        const fetchLanguages = async () => {
            try {
                const response = await apiClient.get("http://localhost:8081/language-api/all-languages");
                setLanguages(response.data);
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 404) {
                        navigate("/404"); // Перенаправляем на страницу 404
                    } else if (error.response.status === 401) {
                        navigate("/401"); // Перенаправляем на страницу 401
                    } else {
                        console.error("Ошибка при загрузке событий:", error);
                    }
                } else {
                    console.error("Ошибка сети или сервер недоступен:", error);
                }
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
            setLocations((prev) => [...prev, { id: null, name: newLocation.trim() }]);
            setNewLocation("");
        }
    };
    const getMinDateTime = () => {
        const now = new Date();
        return now.toISOString().slice(0, 16); // Формат для <input type="datetime-local">
    };

    const handleDeleteLocation = (id) => {
        setLocations((prev) => prev.filter((location) => location.id !== id));
    };

    const handleSave = async () => {
        try {
            const updatedActivity = { ...activity, languages: selectedLanguages, locations };
            await apiClient.post(`http://localhost:8081/admin/events-api/${eventId}/edit-activity/${activityId}`, updatedActivity);
            navigate(`/events/${eventId}/activities`);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    navigate("/404"); // Перенаправляем на страницу 404
                } else if (error.response.status === 401) {
                    navigate("/401"); // Перенаправляем на страницу 401
                } else {
                    console.error("Ошибка при загрузке событий:", error);
                }
            } else {
                console.error("Ошибка сети или сервер недоступен:", error);
            }
        }
    };

    if (!activity) return <div>Загрузка...</div>;

    return (
        <div style={{ maxWidth: "800px", margin: "50px auto" }}>
            <Link to="/events" style={{ textDecoration: "none", color: "blue", fontSize: "18px" }}>
                Вернуться на главную страницу
            </Link>
            <h2>Редактирование мероприятия</h2>

            <label>
                Название:
                <input
                    type="text"
                    name="name"
                    value={activity.name}
                    onChange={handleInputChange}
                />
            </label>
            <br />
            <label>
                Дата и время начала:
                <input
                    type="datetime-local"
                    name="startDate"
                    value={activity.startDate ? activity.startDate : ""}
                    onChange={handleInputChange}
                    min={getMinDateTime()}
                />
            </label>
            <br/>
            <label>
                Требуемые волонтеры:
                <input
                    type="number"
                    name="requiredVolunteers"
                    value={activity.requiredVolunteers}
                    onChange={handleInputChange}
                />
            </label>

            <h3>Языки</h3>
            {languages.map((language) => (
                <label key={language.id}>
                    <input
                        type="checkbox"
                        checked={selectedLanguages.some((lang) => lang.id === language.id)}
                        onChange={() => handleLanguageToggle(language)}
                    />
                    {language.name}
                </label>
            ))}

            <h3>Локации</h3>
            {locations.map((location) => (
                <div key={location.id}>
                    {location.name}
                    <button onClick={() => handleDeleteLocation(location.id)}>Удалить</button>
                </div>
            ))}
            <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="Добавить локацию"
            />
            <button onClick={handleAddLocation}>Добавить локацию</button>

            <button onClick={handleSave} style={{ marginTop: "20px" }}>
                Сохранить
            </button>
        </div>
    );
};

export default EditActivityPage;
