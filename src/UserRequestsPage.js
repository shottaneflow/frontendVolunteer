import React, { useEffect, useState } from "react";
import apiClient from "./apiClient";
import {Link, useNavigate} from "react-router-dom";

const UserRequestsPage = () => {
    const [requests, setRequests] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await apiClient.get("http://localhost:8081/request-api/my-requests");
                setRequests(response.data);
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

        fetchRequests();
    }, []);

    return (
        <div style={{ maxWidth: "800px", margin: "50px auto", textAlign: "center" }}>
            <Link to="/events" style={{ textDecoration: "none", color: "blue", fontSize: "18px" }}>
                Вернуться на главную страницу
            </Link>
            <h2>Мои заявки</h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                <tr>
                    <th style={{ border: "1px solid black", padding: "8px" }}>Номер заявки</th>
                    <th style={{ border: "1px solid black", padding: "8px" }}>Название мероприятия</th>
                    <th style={{ border: "1px solid black", padding: "8px" }}>Статус</th>
                </tr>
                </thead>
                <tbody>
                {requests.map((request) => (
                    <tr key={request.id}>
                        <td style={{ border: "1px solid black", padding: "8px" }}>{request.id}</td>
                        <td style={{ border: "1px solid black", padding: "8px" }}>
                            {request.activity.name}
                        </td>
                        <td style={{ border: "1px solid black", padding: "8px" }}>{request.status}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserRequestsPage;