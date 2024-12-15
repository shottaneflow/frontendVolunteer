import React, { useEffect, useState } from "react";
import apiClient from "./apiClient";
import {Link, useNavigate} from "react-router-dom";
import {handleError} from "./errorHandler";

const EditUserProfilePage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fio: "",
        dateOfBirth: "",
        gender: "",
        about: "",
        languages: []
    });
    const [languages, setLanguages] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userResponse = await apiClient.get("http://localhost:8081/user-api/profile");
                setFormData({
                    fio: userResponse.data.fio || "",
                    dateOfBirth: userResponse.data.dateOfBirth || "",
                    gender: userResponse.data.gender || "",
                    about: userResponse.data.about || "",
                    languages: userResponse.data.languages || []
                });

                const languageResponse = await apiClient.get("http://localhost:8081/language-api/all-languages");
                setLanguages(languageResponse.data);
            } catch (error) {
                handleError(error, navigate);
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleLanguageToggle = (language) => {
        setFormData((prev) => {
            const exists = prev.languages.some((lang) => lang.id === language.id);
            return {
                ...prev,
                languages: exists
                    ? prev.languages.filter((lang) => lang.id !== language.id)
                    : [...prev.languages, language]
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post("http://localhost:8081/user-api/profile/edit", formData);
            alert("Профиль успешно обновлён!");
            navigate("/events");
        } catch (error) {
            handleError(error, navigate);
        }
    };
    const getMaxDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0"); // Месяцы начинаются с 0
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };


    return (
        <div style={{ maxWidth: "600px", margin: "50px auto", textAlign: "center" }}>
            <div>
                <Link to="/events" style={{textDecoration: "none", color: "blue", fontSize: "18px"}}>
                    Вернуться на главную страницу
                </Link>
            </div>

            <div>
                <Link to="/myRequests" style={{textDecoration: "none", color: "blue", fontSize: "18px"}}>
                    Мои заявки
                </Link>
            </div>


            <h2>Редактировать профиль</h2>
            <form onSubmit={handleSubmit}>
            <div>
                    <label>ФИО:</label>
                    <input
                        type="text"
                        name="fio"
                        value={formData.fio}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Дата рождения:</label>
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                        max={getMaxDate()}
                    />
                </div>
                <div>
                    <label>Пол:</label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Выберите</option>
                        <option value="Мужской">Мужской</option>
                        <option value="Женский">Женский</option>
                    </select>
                </div>
                <div>
                    <label>О себе:</label>
                    <textarea
                        name="about"
                        value={formData.about}
                        onChange={handleChange}
                        maxLength={500}
                    />
                </div>
                <h3>Языки</h3>
                {languages.map((language) => (
                    <label key={language.id} style={{ display: "block" }}>
                        <input
                            type="checkbox"
                            checked={formData.languages.some((lang) => lang.id === language.id)}
                            onChange={() => handleLanguageToggle(language)}
                        />
                        {language.name}
                    </label>
                ))}
                <button type="submit" style={{ marginTop: "20px" }}>
                    Сохранить изменения
                </button>
            </form>
            <button onClick={() => navigate("/events")}>На главную</button>
        </div>
    );
};

export default EditUserProfilePage;
