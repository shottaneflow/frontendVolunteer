import React from "react";
import { Link } from "react-router-dom";

const DeveloperPage = () => {
    return (
        <div style={{ maxWidth: "800px", margin: "50px auto", textAlign: "center" }}>
            <h2>Лабораторный практикум по дисциплине</h2>
            <h3>"Технология программирования"</h3>
            <p>Тема: "Веб-приложение для помощи в организации мероприятий с привлечением волонтеров"</p>

            <h4>Разработчики:</h4>
            <ul>
                <li>Дмитриев Данила Олегович</li>
                <li>Артемьев Артем Артемьевич</li>
            </ul>

            <h4>Руководитель:</h4>
            <ul>
                <li>Зеленко Лариса Сергеевна</li>
            </ul>

            <p>Самарский университет 2024</p>

            <h3>Инструкция к приложению:</h3>
            <p>Это веб-приложение предназначено для организации событий с привлечением волонтеров. Пользователи могут просматривать список мероприятий, регистрироваться на них как волонтеры и отслеживать статус заявок. Администраторы могут добавлять новые события и мероприятия, редактировать и удалять существующие.</p>
            <p>Для регистрации заявки на мероприятие, выберите нужное мероприятие и нажмите на кнопку "Зарегистрироваться". Ваша заявка будет отправлена на рассмотрение.</p>
            <p>Администраторы могут управлять заявками, просматривать их и принимать или отклонять.</p>

            <Link to="/events" style={{ textDecoration: "none", color: "blue", fontSize: "18px" }}>
                Вернуться на главную страницу
            </Link>
        </div>
    );
};

export default DeveloperPage;
