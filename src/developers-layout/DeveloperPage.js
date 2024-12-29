import React from "react";
import { Link } from "react-router-dom";
import "./DeveloperPage.css"

const DeveloperPage = () => {
    return (
        <div className="about-developers">
            <Link to="/events" className="dev-link">
                На главную
            </Link>
            <h3 style={{marginTop: "0px"}} className="without-margin">
                Сведения о разработчиках
            </h3>
            <a>Лабораторный практикум по дисциплине <br/>
                "Технология программирования"</a>
            <div style={{marginTop: "7px"}}>
                <a>Тема: "Веб-приложение для помощи в<br/>
                    организации мероприятий с привлечением<br/>
                    волонтеров"</a>
            </div>

            <h4 className="without-margin">Разработчики:</h4>
            <h4 className="without-margin">Обучающиеся группы 6402-090301D</h4>
            <ul className="without-margin">

                <li>Дмитриев Данила Олегович</li>
                <li>Артемьев Артем Артемьевич</li>
            </ul>

            <h4 className="without-margin">Руководитель:</h4>
            <ul className="without-margin">
                <li>Зеленко Лариса Сергеевна</li>
            </ul>

            <p className="without-margin">Самарский университет 2024</p>
        </div>
    );
};

export default DeveloperPage;
