import React, { useState } from "react";
import axios from "axios";
import { handleError } from "../errorHandler";
import { useNavigate } from "react-router-dom";
import './LoginForm.css';

const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Отправка запроса на авторизацию
            const response = await axios.post("http://localhost:8081/auth-api", { username, password });

            if (response.status === 200) {
                const { token, roles } = response.data;

                // Сохраняем токен и роли
                localStorage.setItem("jwtToken", token);
                localStorage.setItem("userRoles", JSON.stringify(roles));

                console.log("Авторизация успешна!", response.data);
                console.log("Роли пользователя:", roles);

                // Перенаправление на страницу событий
                window.location.href = "/events";
            }
        } catch (error) {
            handleError(error, navigate);
        }
    };


    return (
        <div className="login">
            <h1 style={{marginBottom:"5px"}}>Авторизация</h1>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <form className="login-form"onSubmit={handleSubmit}>
                <label>Логин:</label>
                <input 
                    className="login-input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    maxLength="8"
                    minLength="4"
                    required
                />
                <label>Пароль:</label>
                <input
                    className="login-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    maxLength="100"
                    minLength="0"
                    required
                />
                <button className="login-button" type="submit">Войти</button>
                <div>
                    <label>Новенький здесь? </label><a className="login-create-link" href="/registration">Создать аккаунт</a>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
