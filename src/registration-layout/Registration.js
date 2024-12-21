import React, { useState } from 'react';
import axios from 'axios';
import {handleError} from "../errorHandler";
import { useNavigate } from "react-router-dom";
import './Registration.css';

function Registration() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // состояние для модального окна
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // сбрасываем ошибки при новом запросе

        try {
            // Отправляем данные на сервер
            const response = await axios.post('http://localhost:8081/registration-api', {
                username,
                password,
                email,
            });

            if (response.status === 200) {
                setSuccess(true); // успешно зарегистрировано
                setIsModalOpen(true); // открываем модальное окно
            }
        } catch (error) {
            handleError(error, navigate);
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        window.location.href = '/login'; // редирект на страницу логина
    };

    return (
        <div className='registration'>
        <h1>Регистрация</h1>
        <form className="registration-form" onSubmit={handleSubmit}>
            <label htmlFor="username">Логин:</label>
            <input
                className="registration-input"
                type="text"
                id="username"
                maxLength="8"
                minLength="4"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <label htmlFor="password">Пароль:</label>
            <input
                className="registration-input"
                type="password"
                id="password"
                maxLength="100"
                minLength="0"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <label htmlFor="email">Электронная почта:</label>
            <input
                className="registration-input"
                type="email"
                id="email"
                maxLength="50"
                minLength="0"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <button className="registration-button" type="submit">Зарегистрироваться</button>
            <div>
                <label>Уже есть аккаунт? </label><a className="registration-create-link" href="/login">Авторизоваться</a>
            </div>
        </form>


        {error && <div style={{ color: 'red' }}>{error}</div>}

        {/* Модальное окно */}
        {isModalOpen && (
            <div style={modalStyles.overlay}>
                <div style={modalStyles.modal}>
                    <h3>Подтвердите почту</h3>
                    <p>
                        Мы отправили письмо с подтверждением на указанный вами адрес электронной почты.
                        Пожалуйста, подтвердите ваш email, чтобы завершить регистрацию.
                    </p>
                    <button onClick={handleModalClose} style={modalStyles.button}>Ок</button>
                </div>
            </div>
        )}
    </div>
    );
}

// Стили для модального окна
const modalStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '5px',
        width: '400px',
        textAlign: 'center',
    },
    button: {
        marginTop: '20px',
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default Registration;
