import React, { useEffect, useState } from "react";
import apiClient from "./apiClient";
import {Link, useParams} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {handleError} from "./errorHandler";

const ActivitiesPage = () => {
    const { id: eventId } = useParams();
    const [activities, setActivities] = useState([]);
    const [sortOrder, setSortOrder] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isUser, setIsUser] = useState(false);
    const [userRequests, setUserRequests] = useState([]); // Для хранения заявок пользователя
    const navigate = useNavigate();

    useEffect(() => {
        const roles = JSON.parse(localStorage.getItem("userRoles"));
        const adminRole = roles && roles.some(role => role.authority === "ROLE_ADMIN");
        const userRole = roles && roles.some(role => role.authority === "ROLE_USER");

        setIsAdmin(adminRole);
        setIsUser(userRole);

        // Функция для загрузки мероприятий
        const fetchActivities = async () => {
            try {
                const response = await apiClient.get(
                    adminRole
                        ? `http://localhost:8081/admin/events-api/${eventId}/activities`
                        : `http://localhost:8081/events-api/${eventId}/activities`
                );
                setActivities(response.data);
            } catch (error) {
                handleError(error, navigate);
            }
        };

        // Функция для загрузки заявок пользователя
        const fetchUserRequests = async () => {
            try {
                const response = await apiClient.get("http://localhost:8081/request-api/my-requests");
                setUserRequests(response.data); // Сохраняем заявки пользователя
            } catch (error) {
                handleError(error, navigate);
            }
        };

        fetchActivities();
        fetchUserRequests();
    }, [eventId]);

    // Функция для сортировки мероприятий
    const getSortedActivities = () => {
        if (sortOrder === null) {
            return activities;
        }
        return [...activities].sort((a1, a2) => {
            const date1 = new Date(a1.startDate);
            const date2 = new Date(a2.startDate);
            return sortOrder === "asc" ? date1 - date2 : date2 - date1;
        });
    };

    const handleSortAsc = () => {
        setSortOrder("asc");
    };

    const handleSortDesc = () => {
        setSortOrder("desc");
    };

    // Функция для подачи заявки
    const handleSubmitRequest = async (activityId) => {
        try {
            await apiClient.post(`http://localhost:8081/request-api/add-request/${activityId}`);
            alert("Заявка успешно подана!");
            // После подачи заявки, обновляем список заявок
            const response = await apiClient.get("http://localhost:8081/request-api/my-requests");
            setUserRequests(response.data);
        } catch (error) {
            handleError(error, navigate);
        }
    };

    // Функции для удаления, добавления и редактирования мероприятия
    const handleDeleteActivity = async (activityId) => {
        try {
            await apiClient.delete(`http://localhost:8081/admin/events-api/${eventId}/delete-activity/${activityId}`);
            setActivities(activities.filter((activity) => activity.id !== activityId));
        } catch (error) {
            handleError(error, navigate);
        }
    };

    const handleAddActivity = () => {
        navigate(`/events/${eventId}/activities/create`);
    };

    const handleEditActivity = (activityId) => {
        navigate(`/events/${eventId}/activity/${activityId}/edit`);
    };

    // Проверка, подал ли пользователь заявку на мероприятие
    const hasUserSubmittedRequest = (activityId) => {
        return userRequests.some(request => request.activity.id === activityId);
    };

    return (

        <div style={{ maxWidth: "800px", margin: "50px auto", textAlign: "center" }}>
            <Link to="/events" style={{ textDecoration: "none", color: "blue", fontSize: "18px" }}>
                Вернуться на главную страницу
            </Link>
            <h2>Мероприятия для события {eventId}</h2>
            {isAdmin && (
                <button onClick={handleAddActivity} style={{ marginBottom: "20px" }}>
                    Добавить мероприятие
                </button>
            )}
            <div style={{ marginBottom: "20px" }}>
                <button onClick={handleSortAsc}>Сортировать по возрастанию</button>
                <button onClick={handleSortDesc}>Сортировать по убыванию</button>
            </div>
            <ul>
                {getSortedActivities().map((activity) => (
                    <li key={activity.id} style={{ marginBottom: "20px", textAlign: "left" }}>
                        <h3
                            onClick={() => isAdmin && handleEditActivity(activity.id)}
                            style={{ cursor: isAdmin ? "pointer" : "default", color: "blue", textDecoration: "underline" }}
                        >
                            {activity.name}
                        </h3>
                        <p>Дата начала: {new Date(activity.startDate).toLocaleDateString()}</p>
                        <p>Требуемые волонтеры: {activity.requiredVolunteers}</p>
                        <p>Зарегистрированные волонтеры: {activity.registeredVolunteers}</p>

                        <h4>Локации:</h4>
                        {activity.locations && activity.locations.length > 0 ? (
                            <ul>
                                {activity.locations.map((location) => (
                                    <li key={location.id}>{location.name}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>Локации не указаны</p>
                        )}

                        <h4>Языки:</h4>
                        {activity.languages && activity.languages.length > 0 ? (
                            <ul>
                                {activity.languages.map((language) => (
                                    <li key={language.id}>{language.name}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>Языки не указаны</p>
                        )}

                        {isAdmin && (
                            <button onClick={() => handleDeleteActivity(activity.id)}>Удалить мероприятие</button>
                        )}
                        {isUser && activity.registeredVolunteers < activity.requiredVolunteers && !hasUserSubmittedRequest(activity.id) && (
                            <button onClick={() => handleSubmitRequest(activity.id)}>Подать заявку</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ActivitiesPage;
