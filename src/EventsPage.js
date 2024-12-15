import React, { useEffect, useState } from "react";
import apiClient from "./apiClient";
import { useNavigate } from "react-router-dom";
import { handleError } from "./errorHandler";

const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [sortOrder, setSortOrder] = useState(null); // Состояние для сортировки
    const [selectedTypes, setSelectedTypes] = useState([]); // Фильтрация по типу
    const [selectedStatuses, setSelectedStatuses] = useState([]); // Фильтрация по статусу
    const roles = JSON.parse(localStorage.getItem("userRoles"));

    // Проверяем, есть ли среди ролей "ROLE_ADMIN"
    const isAdmin = roles.some(role => role.authority === "ROLE_ADMIN");
    const isUser = roles.some(role => role.authority === "ROLE_USER");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                let url = isAdmin
                    ? "http://localhost:8081/admin/events-api/all-events"
                    : "http://localhost:8081/events-api/all-events";

                // Добавляем фильтрацию по типу
                if (selectedTypes.length > 0) {
                    const typesUrl = `http://localhost:8081/events-api/events/filter/type?types=${selectedTypes.join('&types=')}`;
                    const typeResponse = await apiClient.get(typesUrl);
                    setEvents(typeResponse.data);
                }

                // Добавляем фильтрацию по статусу
                if (selectedStatuses.length > 0) {
                    const statusUrl = `http://localhost:8081/events-api/events/filter/status?status=${selectedStatuses.join('&status=')}`;
                    const statusResponse = await apiClient.get(statusUrl);
                    setEvents((prevEvents) => {
                        // Фильтруем события по типу и статусу
                        const filteredByStatus = statusResponse.data.filter(event =>
                            selectedTypes.length === 0 || selectedTypes.includes(event.type)
                        );
                        return filteredByStatus;
                    });
                }

                if (selectedTypes.length === 0 && selectedStatuses.length === 0) {
                    const response = await apiClient.get(url);
                    setEvents(response.data);
                }
            } catch (error) {
                handleError(error, navigate);
            }
        };

        fetchEvents();
    }, [isAdmin, selectedTypes, selectedStatuses]); // Завершаем зависимость от фильтров

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
            handleError(error, navigate);
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

    // Функции для изменения фильтров
    const handleTypeFilterChange = (event) => {
        const value = event.target.value;
        setSelectedTypes(prev =>
            prev.includes(value) ? prev.filter(type => type !== value) : [...prev, value]
        );
    };

    const handleStatusFilterChange = (event) => {
        const value = event.target.value;
        setSelectedStatuses(prev =>
            prev.includes(value) ? prev.filter(status => status !== value) : [...prev, value]
        );
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

            {/* Фильтры */}
            <div>
                <h4>Фильтровать по типу:</h4>
                <label>
                    <input type="checkbox" value="Культурное" onChange={handleTypeFilterChange} /> Культурное
                </label>
                <label>
                    <input type="checkbox" value="Спортивное" onChange={handleTypeFilterChange} /> Спортивное
                </label>
                <label>
                    <input type="checkbox" value="Социальное" onChange={handleTypeFilterChange} /> Социальное
                </label>
            </div>

            <div>
                <h4>Фильтровать по статусу:</h4>
                <label>
                    <input type="checkbox" value="Международный" onChange={handleStatusFilterChange} /> Международное
                </label>
                <label>
                    <input type="checkbox" value="Районный" onChange={handleStatusFilterChange} /> Районное
                </label>
                <label>
                    <input type="checkbox" value="Городской" onChange={handleStatusFilterChange} /> Городское
                </label>
                <label>
                    <input type="checkbox" value="Всероссийский" onChange={handleStatusFilterChange} /> Всероссийское
                </label>
            </div>

            <ul>
                {getSortedEvents().map((event) => (
                    <li key={event.id}>
                        <h3 onClick={() => isAdmin && handleEditEvent(event.id)} style={{ cursor: "pointer", color: "blue" }}>{event.name}</h3>
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
