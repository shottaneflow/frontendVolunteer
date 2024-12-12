import React, { useState } from "react";
import apiClient from "./apiClient";
import { useParams, useNavigate } from "react-router-dom";

const AddActivityPage = () => {
    const { id: eventId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        startDate: "",
        requiredVolunteers: 0,
        registeredVolunteers: 0,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post(
                `http://localhost:8081/admin/events-api/${eventId}/create-activity`,
                formData
            );

            alert("Мероприятие успешно создано!");

            // Перенаправляем назад к списку мероприятий
            navigate(`/events/${eventId}/activities`);
        } catch (error) {
            console.error("Ошибка при создании мероприятия:", error);
            alert("Не удалось создать мероприятие.");
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "50px auto", textAlign: "center" }}>
            <h2>Создать мероприятие</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Название:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Дата начала:</label>
                    <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Требуемые волонтеры:</label>
                    <input
                        type="number"
                        name="requiredVolunteers"
                        value={formData.requiredVolunteers}
                        onChange={handleChange}
                        min="0"
                        required
                    />
                </div>
                <div>
                    <label>Зарегистрированные волонтеры:</label>
                    <input
                        type="number"
                        name="registeredVolunteers"
                        value={formData.registeredVolunteers}
                        onChange={handleChange}
                        min="0"
                        required
                    />
                </div>
                <button type="submit">Создать</button>
            </form>
        </div>
    );
};

export default AddActivityPage;
