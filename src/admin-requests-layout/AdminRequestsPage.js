import React, { useEffect, useState } from "react";
import apiClient from "../apiClient";
import {Link, useNavigate} from "react-router-dom";
import {handleError} from "../errorHandler";
import "./AdminRequestsPage.css";

const AdminRequestsPage = () => {
    const [requests, setRequests] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await apiClient.get("http://localhost:8081/admin/request-api/all-requests");
                setRequests(response.data);
            } catch (error) {
                handleError(error, navigate);
            }
        };

        fetchRequests();
    }, []);

    const handleApprove = async (requestId) => {
        try {
            await apiClient.post(`http://localhost:8081/admin/request-api/accept/${requestId}`);
            setRequests(requests.filter((req) => req.id !== requestId));
        } catch (error) {
            handleError(error, navigate);
        }
    };

    const handleReject = async (requestId) => {
        try {
            await apiClient.post(`http://localhost:8081/admin/request-api/reject/${requestId}`);
            setRequests(requests.filter((req) => req.id !== requestId));
        } catch (error) {
            handleError(error, navigate);
        }
    };

    // Фильтруем заявки по статусу "На рассмотрении"
    const filteredRequests = requests.filter(request => request.status === "На рассмотрении");

    return (
        <div style={{width:"100%", margin:"50px 0px", overflow:"hidden"}}>
            <div style={{width:"100%", border:"1px solid black"}}></div>
            <div className="requests-page">
                <Link to="/events" className="requests-link">
                    На главную
                </Link>
                {filteredRequests.length > 0 && (
                    <table style={{ width: "100%", borderCollapse: "collapse"}}>
                        <thead>
                        <tr style={{textAlign:"left"}}>
                            <th>Заявки</th>
                            <th>Мероприятие</th>
                            <th>Статус</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredRequests.map((request) => (
                            <tr className="row" key={request.id}>
                                <td className="margin-top">Заявка №{request.id}</td>
                                <td className="margin-top">
                                    {request.activity.name}
                                </td>
                                <td className="margin-top">{request.status}</td>
                                <td className="margin-top">
                                    <button className="requests-button" onClick={() => handleReject(request.id)}>отклонить</button>
                                    <button className="requests-button" onClick={() => handleApprove(request.id)}>принять</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
                {filteredRequests.length == 0 && (
                    <div className="not-found-requests">
                        Заявок нет
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminRequestsPage;
