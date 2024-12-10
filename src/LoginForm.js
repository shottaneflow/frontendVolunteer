import React, { useState } from "react";
import axios from "axios";

const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Отправка запроса на авторизацию
            const response = await axios.post("http://localhost:8081/auth-api", { username, password });

            if (response.status === 200) {
                const { token, roles } = response.data;  // Извлекаем токен и роли из ответа

                // Сохраняем токен и роли в localStorage
                localStorage.setItem("jwtToken", token);
                localStorage.setItem("userRoles", JSON.stringify(roles));  // Роли сохраняем как строку JSON

                console.log("Авторизация успешна!", response.data);
                console.log("Роли пользователя:", roles);

                // Перенаправление на страницу событий
                window.location.href = "/events";
            } else {
                setErrorMessage(response.data.message || "Ошибка авторизации");
            }
        } catch (error) {
            console.error("Ошибка при авторизации:", error);

            if (error.response) {
                if (error.response.status === 409) {
                    setErrorMessage("Подтвердите свой email.");
                } else if (error.response.status === 401) {
                    setErrorMessage("Неправильный логин или пароль.");
                } else {
                    setErrorMessage("Произошла ошибка, попробуйте позже.");
                }
            } else {
                setErrorMessage("Произошла ошибка, попробуйте позже.");
            }
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
            <h2>Авторизация</h2>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Имя пользователя:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Пароль:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Войти</button>
            </form>
        </div>
    );
};

export default LoginForm;
