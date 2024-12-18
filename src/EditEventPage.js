import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import apiClient from "./apiClient";
import { handleError } from "./errorHandler";

const EditEventPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);

    // Списки для типов и статусов событий
    const eventTypes = ["Культурное", "Спортивное", "Социальное"];
    const eventStatuses = ["Международный", "Районный", "Городской", "Всероссийский"];

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await apiClient.get(`http://localhost:8081/admin/events-api/events/${id}`);
                setEvent(response.data);
            } catch (error) {
                handleError(error, navigate);
            }
        };

        fetchEvent();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEvent((prevEvent) => ({ ...prevEvent, [name]: value }));
    };

    const handleSave = async () => {
        try {
            await apiClient.post(`http://localhost:8081/admin/events-api/${id}/edit-event`, event);
            navigate("/events");
        } catch (error) {
            handleError(error, navigate);
        }
    };

    const getMinDateTime = () => {
        const now = new Date();
        return now.toISOString().slice(0, 16); // Формат для <input type="datetime-local">
    };

    if (!event) {
        return <p>Загрузка...</p>;
    }

    return (
        <div style={{ maxWidth: "600px", margin: "50px auto", textAlign: "center" }}>
            <Link to="/events" style={{ textDecoration: "none", color: "blue", fontSize: "18px" }}>
                Вернуться на главную страницу
            </Link>
            <h2>Редактировать событие</h2>
            <label>
                Имя:
                <input type="text" name="name" value={event.name} onChange={handleInputChange} />
            </label>
            <br />
            <label>
                Время:
                <input type="datetime-local" name="dateTime" value={event.dateTime} onChange={handleInputChange} min={getMinDateTime()} />
            </label>
            <br />
            <label>
                Тип:
                <select name="type" value={event.type} onChange={handleInputChange}>
                    <option value="">Выберите тип</option>
                    {eventTypes.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </label>
            <br />
            <label>
                Статус:
                <select name="status" value={event.status} onChange={handleInputChange}>
                    <option value="">Выберите статус</option>
                    {eventStatuses.map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
            </label>
            <br />
            <label>
                Требуемые волонтеры:
                <input type="number" name="requiredVolunteers" value={event.requiredVolunteers} onChange={handleInputChange} />
            </label>
            <br />
            <button onClick={handleSave}>Сохранить</button>
            <button onClick={() => navigate(`/events/${id}/activities`)}>Список мероприятий события</button>
        </div>
    );
};

export default EditEventPage;
