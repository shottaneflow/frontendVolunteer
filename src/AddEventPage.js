import React, { useState } from "react";
import apiClient from "./apiClient";
import { useNavigate } from "react-router-dom";

const AddEventPage = () => {
    const [eventData, setEventData] = useState({
        name: "",
        dateTime: "",
        type: "",
        requiredVolunteers: 0,
        registeredVolunteers: 0,
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
            await apiClient.post("/events-api/create-event", eventData);
            navigate("/events");
        } catch (error) {
            console.error("Ошибка при добавлении события:", error);
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
            <h2>Добавить событие</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Название:</label>
                    <input type="text" name="name" value={eventData.name} onChange={handleChange} required />
                </div>
                <div>
                    <label>Дата и время:</label>
                    <input type="datetime-local" name="dateTime" value={eventData.dateTime} onChange={handleChange} required />
                </div>
                <div>
                    <label>Тип:</label>
                    <input type="text" name="type" value={eventData.type} onChange={handleChange} required />
                </div>
                <div>
                    <label>Требуемые волонтеры:</label>
                    <input type="number" name="requiredVolunteers" value={eventData.requiredVolunteers} onChange={handleChange} required />
                </div>
                <div>
                    <label>Зарегистрированные волонтеры:</label>
                    <input type="number" name="registeredVolunteers" value={eventData.registeredVolunteers} onChange={handleChange} required />
                </div>
                <div>
                    <label>Статус:</label>
                    <input type="text" name="status" value={eventData.status} onChange={handleChange} required />
                </div>
                <button type="submit">Добавить</button>
            </form>
        </div>
    );
};

export default AddEventPage;
