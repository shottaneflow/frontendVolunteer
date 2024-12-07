import React, { useEffect, useState } from "react";
import apiClient from "./apiClient";
import { useNavigate } from "react-router-dom";

const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Получение списка событий
        const fetchEvents = async () => {
            try {
                const response = await apiClient.get("http://localhost:8081/events-api/all-events");
                setEvents(response.data);
            } catch (error) {
                console.error("Ошибка при загрузке событий:", error);
            }
        };

        fetchEvents();
    }, []);

    const handleAddEvent = () => {
        navigate("/add-event");
    };

    return (
        <div style={{ maxWidth: "800px", margin: "50px auto", textAlign: "center" }}>
            <h2>События</h2>
            <button onClick={handleAddEvent} style={{ marginBottom: "20px" }}>Добавить событие</button>
            <ul>
                {events.map((event) => (
                    <li key={event.id}>
                        <h3>{event.name}</h3>
                        <p>Дата: {new Date(event.dateTime).toLocaleString()}</p>
                        <p>Тип: {event.type}</p>
                        <p>Требуемые волонтеры: {event.requiredVolunteers}</p>
                        <p>Зарегистрированные волонтеры: {event.registeredVolunteers}</p>
                        <p>Статус: {event.status}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EventsPage;
