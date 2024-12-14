import React, { useEffect, useState } from "react";
import apiClient from "./apiClient";
import {useParams, useNavigate, Link} from "react-router-dom";

const AddActivityPage = () => {
    const { id: eventId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        startDate: "",
        requiredVolunteers: 0,
        registeredVolunteers: 0,
        languages: [], // выбранные языки
        locations: [] // указанные локации
    });
    const [languages, setLanguages] = useState([]);
    const [newLocation, setNewLocation] = useState("");

    useEffect(() => {
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
        fetchLanguages();
    }, []);

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

    return (
        <div style={{ maxWidth: "600px", margin: "50px auto", textAlign: "center" }}>
            <Link to="/events" style={{ textDecoration: "none", color: "blue", fontSize: "18px" }}>
                Вернуться на главную страницу
            </Link>
            <h2>Создать мероприятие</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Название:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Дата начала:</label>
                    <input
                        type="datetime-local"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        min={getMinDateTime()}
                        required
                    />
                </div>
                <div>
                    <label>Требуемые волонтеры:</label>
                    <input
                        type="number"
                        name="requiredVolunteers"
                        value={formData.requiredVolunteers}
                        onChange={handleChange}
                        min="0"
                        required
                    />
                </div>
                <h3>Языки</h3>
                {languages.map((language) => (
                    <label key={language.id}>
                        <input
                            type="checkbox"
                            checked={formData.languages.some((lang) => lang.id === language.id)}
                            onChange={() => handleLanguageToggle(language)}
                        />
                        {language.name}
                    </label>
                ))}
                <h3>Локации</h3>
                {formData.locations.map((location, index) => (
                    <div key={index}>{location.name}</div>
                ))}
                <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="Добавить локацию"
                />
                <button type="button" onClick={handleAddLocation}>
                    Добавить локацию
                </button>
                <button type="submit" style={{ marginTop: "20px" }}>
                    Создать
                </button>
            </form>
        </div>
    );
};

export default AddActivityPage;
