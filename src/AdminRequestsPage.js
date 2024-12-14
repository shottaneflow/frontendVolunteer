import React, { useEffect, useState } from "react";
import apiClient from "./apiClient";
import {Link} from "react-router-dom";

const AdminRequestsPage = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await apiClient.get("http://localhost:8081/admin/request-api/all-requests");
                setRequests(response.data);
            } catch (error) {
                console.error("Ошибка при загрузке заявок:", error);
            }
        };

        fetchRequests();
    }, []);

    const handleApprove = async (requestId) => {
        try {
            await apiClient.post(`http://localhost:8081/admin/request-api/accept/${requestId}`);
            setRequests(requests.filter((req) => req.id !== requestId));
        } catch (error) {
            console.error("Ошибка при принятии заявки:", error);
        }
    };

    const handleReject = async (requestId) => {
        try {
            await apiClient.post(`http://localhost:8081/admin/request-api/reject/${requestId}`);
            setRequests(requests.filter((req) => req.id !== requestId));
        } catch (error) {
            console.error("Ошибка при отклонении заявки:", error);
        }
    };

    // Фильтруем заявки по статусу "На рассмотрении"
    const filteredRequests = requests.filter(request => request.status === "На рассмотрении");

    return (
        <div style={{ maxWidth: "800px", margin: "50px auto", textAlign: "center" }}>
            <Link to="/events" style={{ textDecoration: "none", color: "blue", fontSize: "18px" }}>
                Вернуться на главную страницу
            </Link>
            <h2>Все заявки</h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                <tr>
                    <th style={{ border: "1px solid black", padding: "8px" }}>Номер заявки</th>
                    <th style={{ border: "1px solid black", padding: "8px" }}>Мероприятие</th>
                    <th style={{ border: "1px solid black", padding: "8px" }}>Статус</th>
                    <th style={{ border: "1px solid black", padding: "8px" }}>Действия</th>
                </tr>
                </thead>
                <tbody>
                {filteredRequests.map((request) => (
                    <tr key={request.id}>
                        <td style={{ border: "1px solid black", padding: "8px" }}>{request.id}</td>
                        <td style={{ border: "1px solid black", padding: "8px" }}>
                            {request.activity.name}
                        </td>
                        <td style={{ border: "1px solid black", padding: "8px" }}>{request.status}</td>
                        <td style={{ border: "1px solid black", padding: "8px" }}>
                            <button onClick={() => handleApprove(request.id)}>Принять</button>
                            <button onClick={() => handleReject(request.id)}>Отклонить</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminRequestsPage;
