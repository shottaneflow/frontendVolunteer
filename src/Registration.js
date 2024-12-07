import React, { useState } from 'react';
import axios from 'axios';

function Registration() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // состояние для модального окна

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
        } catch (err) {
            if (err.response && err.response.status === 409) {
                setError('Пользователь с таким именем или почтой уже существует.');
            } else {
                setError('Ошибка при регистрации. Попробуйте снова.');
            }
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        window.location.href = '/login'; // редирект на страницу логина
    };

    return (
        <div>
            <h2>Регистрация</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Имя пользователя:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Почта:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Пароль:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Зарегистрироваться</button>
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
