import React, { useEffect, useState } from "react";
import apiClient from "../../apiClient";
import {Link, useNavigate} from "react-router-dom";
import {handleError} from "../../errorHandler";
import './EditUserProfile.css';

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
        <div className="profile">
        <div className="window">
            <div>
                <Link className="link" to="/myRequests">
                    мои заявки
                </Link>
                <Link className="link" to="/events">
                    на главную
                </Link>
            </div>
            <form onSubmit={handleSubmit} className="prof_form">
                <a className="prof_text">ФИО:</a>
                <input
                    style={{minWidth:"250px", maxWidth:"30%",textAlign:"center", borderRadius:"5px"}}
                    type="text"
                    name="fio"
                    value={formData.fio}
                    onChange={handleChange}
                    maxLength="50"
                    minLength="0"
                    required
                />
                <a className="prof_text">Дата рождения:</a>
                <div style={{display:"flex",gap:"10px"}}>
                    <a>Выберите дату:</a>
                    <input
                        style={{minWidth:"132px", borderRadius:"5px"}}
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                        max={getMaxDate()}
                    />
                </div>
                <div style={{display:"flex",gap:"5px"}}>
                    <label className="prof_text">Пол:</label>
                    <div style={{display: "flex",gap:"5px", paddingTop:"5px"}}>
                        <label>
                            <input onChange={handleChange} type="radio" name="gender" value="Мужчина" checked={formData.gender === "Мужчина"}/>
                            Мужской
                        </label>
                        <label>
                            <input onChange={handleChange} type="radio" name="gender" value="Женщина"checked={formData.gender === "Женщина"}/>
                            Женский
                        </label>
                    </div>
                </div>
                <div style={{display:"flex", flexDirection:"row",gap:"2px"}}>
                <a className="prof_text">Языки:</a>
                    <div style={{display:"flex", flexDirection:"row", alignItems:"center", gap:"3px",marginTop:"3px"}}>
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
                    </div>
                </div>
                <div style={{display:"flex",flexDirection:"column"}}>
                    <label className="prof_text">О себе:</label>
                    <textarea
                        style={{resize:"none"}}
                        name="about"
                        value={formData.about}
                        onChange={handleChange}
                        maxLength={500}
                    />
                </div>
                <button type="submit" className="submit">
                    Принять изменения
                </button>
            </form>
        </div>
    </div>
    );
};

export default EditUserProfilePage;
