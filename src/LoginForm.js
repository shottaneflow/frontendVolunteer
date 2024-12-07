import React, { useState } from "react";
import axios from "axios";

const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8081/auth-api", { username, password });

            if (response.status === 200) {
                // Успешная авторизация
                console.log("Авторизация успешна!", response.data);
                // Редирект на главную страницу
                window.location.href = "/events";
            } else {
                // Ошибка авторизации
                setErrorMessage(response.data.message || "Ошибка авторизации");
            }
        } catch (error) {
            console.error("Ошибка при авторизации:", error);  // Вывод ошибки в консоль для диагностики

            if (error.response) {
                if (error.response.status === 409) {
                    setErrorMessage("Подтвердите свой email.");
                } else if (error.response.status === 401) {
                    setErrorMessage("Неправильный логин или пароль.");
                } else {
                    setErrorMessage("Произошла ошибка, попробуйте позже.");
                }
            } else {
                // Если ошибка сети или другие проблемы
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
