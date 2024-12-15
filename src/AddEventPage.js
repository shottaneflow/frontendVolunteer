import React, { useState } from "react";
import apiClient from "./apiClient";
import { Link, useNavigate } from "react-router-dom";
import { handleError } from "./errorHandler";

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
            handleError(error, navigate);
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
                        min={getMinDateTime()}
                        required
                    />
                </div>
                <div>
                    <label>Тип:</label>
                    <select
                        name="type"
                        value={eventData.type}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>Выберите тип</option>
                        <option value="Культурное">Культурное</option>
                        <option value="Спортивное">Спортивное</option>
                        <option value="Социальное">Социальное</option>
                    </select>
                </div>
                <div>
                    <label>Требуемые волонтеры:</label>
                    <input
                        type="number"
                        name="requiredVolunteers"
                        value={eventData.requiredVolunteers}
                        onChange={handleChange}
                        required
                        min="1"
                    />
                </div>
                <div>
                    <label>Статус:</label>
                    <select
                        name="status"
                        value={eventData.status}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>Выберите статус</option>
                        <option value="Международный">Международный</option>
                        <option value="Районный">Районный</option>
                        <option value="Городской">Городской</option>
                        <option value="Всероссийский">Всероссийский</option>
                    </select>
                </div>
                <button type="submit">Добавить</button>
            </form>
        </div>
    );
};

export default AddEventPage;
