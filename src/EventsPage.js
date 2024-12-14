import React, { useEffect, useState } from "react";
import apiClient from "./apiClient";
import { useNavigate } from "react-router-dom";

const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [sortOrder, setSortOrder] = useState(null); // Состояние для сортировки
    const roles = JSON.parse(localStorage.getItem("userRoles"));

    // Проверяем, есть ли среди ролей "ROLE_ADMIN"
    const isAdmin = roles.some(role => role.authority === "ROLE_ADMIN");
    const isUser = roles.some(role => role.authority === "ROLE_USER");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await apiClient.get(isAdmin
                    ? "http://localhost:8081/admin/events-api/all-events"
                    : "http://localhost:8081/events-api/all-events");
                setEvents(response.data);
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

        fetchEvents();
    }, [isAdmin]); // Завершаем зависимость только от isAdmin

    // Функция для сортировки событий
    const getSortedEvents = () => {
        if (sortOrder === null) {
            return events; // Если сортировка не выбрана, возвращаем оригинальный список
        }
        return [...events].sort((event1, event2) => {
            const date1 = new Date(event1.dateTime);
            const date2 = new Date(event2.dateTime);

            return sortOrder === "asc" ? date1 - date2 : date2 - date1;
        });
    };

    const handleAddEvent = () => {
        navigate("/add-event");
    };

    const handleOpenActivities = (eventId) => {
        navigate(`/events/${eventId}/activities`);
    };

    const handleDeleteEvent = async (id) => {
        try {
            await apiClient.delete(`http://localhost:8081/admin/events-api/events/${id}`);
            setEvents(events.filter((event) => event.id !== id)); // Обновляем локальный список
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

    const handleSortAsc = () => {
        setSortOrder("asc");
    };

    const handleSortDesc = () => {
        setSortOrder("desc");
    };
    const handleEditEvent = (eventId) => {
        navigate(`/events/${eventId}/edit`);
    };

    return (
        <div style={{ maxWidth: "800px", margin: "50px auto", textAlign: "center" }}>

            <h2>События</h2>
            {isAdmin && (
                <button onClick={handleAddEvent} style={{ marginBottom: "20px" }}>Добавить событие</button>
            )}
            <div style={{ marginBottom: "20px" }}>
                <button onClick={handleSortAsc}>Сортировать по возрастанию</button>
                <button onClick={handleSortDesc}>Сортировать по убыванию</button>
            </div>
            <ul>
                {getSortedEvents().map((event) => (
                    <li key={event.id}>
                        <h3 onClick={() => isAdmin && handleEditEvent(event.id)} style={{cursor: "pointer", color: "blue"}}>{event.name}</h3>
                        <p>Дата: {new Date(event.dateTime).toLocaleString()}</p>
                        <p>Тип: {event.type}</p>
                        <p>Требуемые волонтеры: {event.requiredVolunteers}</p>
                        <p>Статус: {event.status}</p>
                        <button onClick={() => handleOpenActivities(event.id)}>Просмотреть мероприятия</button>
                        {isAdmin && (
                            <button onClick={() => handleDeleteEvent(event.id)}>Удалить</button>
                        )}
                    </li>
                ))}
            </ul>
            <div style={{ marginTop: "30px" }}>
                <a href="/about-developers" style={{ textDecoration: "none", color: "blue", fontSize: "18px" }}>
                    Информация о разработчиках
                </a>
            </div>
            {isUser && (
                <div style={{ marginTop: "20px" }}>
                    <a href="/profile" style={{ textDecoration: "none", color: "blue", fontSize: "18px" }}>
                        Перейти в профиль
                    </a>
                </div>
            )}
            {isAdmin && (
                <div style={{ marginTop: "20px" }}>
                    <a href="/requests" style={{ textDecoration: "none", color: "blue", fontSize: "18px" }}>
                        Нерасмотренные заявки
                    </a>
                </div>
            )}
        </div>
    );
};

export default EventsPage;
