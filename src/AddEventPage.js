import React, { useState } from "react";
import apiClient from "./apiClient";
import {Link, useNavigate} from "react-router-dom";

const AddEventPage = () => {
    const [eventData, setEventData] = useState({
        name: "",
        dateTime: "",
        type: "",
        requiredVolunteers: 0,
        status: ""
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData({ ...eventData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post("/admin/events-api/create-event", eventData);
            navigate("/events");
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

    const getMinDateTime = () => {
        const now = new Date();
        return now.toISOString().slice(0, 16); // Формат для <input type="datetime-local">
    };

    return (
        <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
            <Link to="/events" style={{ textDecoration: "none", color: "blue", fontSize: "18px" }}>
                Вернуться на главную страницу
            </Link>
            <h2>Добавить событие</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Название:</label>
                    <input
                        type="text"
                        name="name"
                        value={eventData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Дата и время:</label>
                    <input
                        type="datetime-local"
                        name="dateTime"
                        value={eventData.dateTime}
                        onChange={handleChange}
                        min={getMinDateTime()}// Ограничение максимальной даты
                        required
                    />
                </div>
                <div>
                    <label>Тип:</label>
                    <input
                        type="text"
                        name="type"
                        value={eventData.type}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Требуемые волонтеры:</label>
                    <input
                        type="number"
                        name="requiredVolunteers"
                        value={eventData.requiredVolunteers}
                        onChange={handleChange}
                        required
                        min="1" // Минимальное количество волонтеров
                    />
                </div>
                <div>
                    <label>Статус:</label>
                    <input
                        type="text"
                        name="status"
                        value={eventData.status}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Добавить</button>
            </form>
        </div>
    );
};

export default AddEventPage;
