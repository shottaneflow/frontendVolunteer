import React from "react";
import './AboutSystemPage.css';


const AboutSystemPage = () =>{
    const roles = JSON.parse(localStorage.getItem("userRoles"));
    const isAdmin = roles.some(role => role.authority === "ROLE_ADMIN");
    const isUser = roles.some(role => role.authority === "ROLE_USER");

    return(
        <div className="about-system-main">  
            <h1 style={{marginTop:"0px"}}>О системе</h1>
            {isUser && (
                <>
                    <ul>
                        <li><a className="about-system-link" href="#login">Авторизация</a></li>
                        <li><a className="about-system-link" href="#registration">Регистрация</a></li>
                        <li><a className="about-system-link" href="#events">События</a></li>
                        <ul>
                            <li><a className="about-system-link" href="#type_status">Фильтрация по типам и статусу</a></li>
                            <li><a className="about-system-link" href="#events_sort">Сортировка времени</a></li>
                        </ul>
                        <li><a className="about-system-link" href="#activities">Мероприятия</a></li>
                        <ul>
                            <li><a className="about-system-link" href="#language">Фильтрация по языкам</a></li>
                            <li><a className="about-system-link" href="#activities_sort">Сортировка по времени</a></li>
                            <li><a className="about-system-link" href="#torequest">Подача заявки</a></li>
                        </ul>
                        <li><a className="about-system-link" href="#profile">Профиль</a></li>
                        <ul>
                            <li><a className="about-system-link" href="#request">Заявки пользователя</a></li>
                        </ul>
                    </ul>
                    <h2>Web-приложение для помощи в организации мероприятий с привлечением волонтёров</h2>
                    <h3 id="login">Авторизация</h3>
                    <p>При запуске программы открывается страница с авторизацией, представленная на рисунке. В поля "Логин" и "Пароль" необходимо ввести имя пользоваетеля и пароль 
                    зарегистрированного пользователя и нажать кнопку "Войти". Если данные введены верно, то откроется главная страница</p>
                    <div className="img_box">
                        <img style={{width:"400px"}} src={require('./image/login.png')}></img>
                    </div>
                    <p>Если пользователь введёт неверные значения в поля "Пароль" или "Логин", то будет выведено модальное окно, которое сообщит нам о полученной ошибке. Ошибки приведенны на рисунках</p>
                    <div className="img_box">
                        <img className="square" src={require('./image/login_invalid_username.png')}></img>
                    </div>
                    <p>Пользователя с таким именем не существует</p>
                    <div className="img_box">
                        <img className="square" src={require('./image/login_invalid_password.png')}></img>
                    </div>
                    
                    <h3 id="registration">Регистрация</h3>
                    <p>При нажатии на гиперссылку "Создать аккаунт" на сайте с авторизацией пользователя отправляет на страницу регистрации, представленную на рисунке.</p>
                    <div className="img_box">
                        <img className="square" src={require('./image/registration.png')}></img>
                    </div>
                    <p>Поля "Логин", "Пароль" и "Электронная почта" необходимо заполнить и нажать на кнопку "Зарегистрироваться". Если данные введены верно, 
                        то появится всплывающее окно, которое потребует подтвердить почту</p>
                    <div className="img_box">
                        <img className="square" src={require('./image/registration_validation_email.png')}></img>
                    </div>
                    <p>Если при заполнении поля "Логин" имя пользоваетеля совпадёт с тем, что есть в базе данных, то появится всплывающее окно, оповещающее что такое имя пользоваетеля занято  </p>
                    <div className="img_box">
                        <img className="square" src={require('./image/registration_is_user.png')}></img>
                    </div>
                    <p>При вводе некорректной почты появится представленное на рисунке предупреждение</p>
                    <div className="img_box">
                        <img className="square" src={require('./image/registration_valid_mail.png')}></img>
                    </div>
                    <h3 id="events">События</h3>
                    <p>После авторизации пользователя он направляется на главный экран, страницу со всеми событиями, представленную на рисунке</p>
                    <div className="img_box">
                        <img src={require('./image/user_events.png')}></img>
                    </div>
                    <p>На данной странице пользователь может просмотреть все события, отфильтровать по типу и статусу и отсортировать по времени.</p>
                    <h4 id="type_status">Фильтрация по типам и статусу</h4>
                    <p>При нажатии на "фильтровать по типу" и "фильтровать по статусу" открывается dropdown меню, где мы выбираем нужные нам типы и статусы</p>
                    <div className="img_box">
                        <img src={require('./image/user_type_filtr.png')}></img>
                    </div>
                    <p></p>
                    <div className="img_box">
                        <img src={require('./image/user_status_filtr.png')}></img>
                    </div>
                    <p></p>
                    <h4 id="events_sort">Сортировка по времени</h4>
                    <p>При нажатии на "сортировать по времени" открывается меню с выбором сортировки</p>
                    <div className="img_box">
                        <img src={require('./image/user_events_sort.png')}></img>
                    </div>
                    <h3 id="activities">Мероприятия</h3>
                    <p>Выбрав понравившееся ему событие, он может нажать на имя, и тогда его перенесёт на страницу с мероприятиями, представленную на рисунке. 
                    </p>
                    <h4 id="torequest">Подача заявки</h4>
                    <p>Нажав на кнопку <span>"Подать заявку"</span> пользователь отправляет заявку на мероприятие</p>
                    <div className="img_box">
                        <img src={require('./image/user_activities.png')}></img>
                    </div>
                    <p>На данной странице пользователь может отфильтровать их по языкам и отсортировать по времени.</p>
                    <h4 id="language">Фильтрация языкам</h4>
                    <p>При нажатии на "фильтровать языкам" открывается dropdown меню, где мы выбираем нужные нам языки</p>
                    <div className="img_box">
                        <img src={require('./image/user_language_filtr.png')}></img>
                    </div>
                    <h4 id="activities_sort">Сортировка по времени</h4>
                    <p>При нажатии на "сортировать по времени" открывается меню с выбором сортировки</p>
                    <div className="img_box">
                        <img src={require('./image/user_activities_sort.png')}></img>
                    </div>
                    <h3 id="profile">Профиль</h3>
                    <p>При нажатии на гиперссылку <span>"Перейти в профиль"</span> пользователя перенаправляет на страницу профиля,представленную на рисунке, где он может заполнить: ФИО, дату рождения, пол, 
                    языки, которыми он владеет, и более подробную информацию в поле "О себе".</p>
                    <div className="img_box">
                        <img src={require('./image/user_profile.png')}></img>
                    </div>
                    <h2 id="request">Заявки пользователя</h2>
                    <p>Также в профиле находится гиперссылка <span>"Мои заявки"</span>, нажав на которую
                    пользователь переходит на страницу, где он видит все свои заявки и их статусы. Данная страница представленна на рисунке</p>
                    <div className="img_box">
                        <img src={require('./image/user_request.png')}></img>
                    </div>
                </>
            )}
            {isAdmin && (
                <>
                    <ul>
                    <li><a className="about-system-link" href="#login">Авторизация</a></li>
                        <li><a className="about-system-link" href="#registration">Регистрация</a></li>
                        <li><a className="about-system-link" href="#events">События</a></li>
                        <ul>
                            <li><a className="about-system-link" href="#add_event">Добавление событий</a></li>
                            <li><a className="about-system-link" href="#change_event">Редактирование событий</a></li>
                            <li><a className="about-system-link" href="#type_status">Фильтрация по типам и статусу</a></li>
                            <li><a className="about-system-link" href="#events_sort">Сортировка времени</a></li>
                        </ul>
                        <li><a className="about-system-link" href="#activities">Мероприятия</a></li>
                        <ul>
                            <li><a className="about-system-link" href="#add_act">Добавление мероприятий</a></li>
                            <li><a className="about-system-link" href="#change_act">Редактирование мероприятий</a></li>
                            <li><a className="about-system-link" href="#language">Фильтрация по языкам</a></li>
                            <li><a className="about-system-link" href="#act_sort">Сортировка по времени</a></li>
                        </ul>
                        <li><a className="about-system-link" href="#request">Заявки</a></li>
                    </ul>
                    <h2>Web-приложение для помощи в организации мероприятий с привлечением волонтёров</h2>
                    <h3 id="login">Авторизация</h3>
                    <p>При запуске программы открывается страница с авторизацией, представленная на рисунке. В поля "Логин" и "Пароль" необходимо ввести пароль 
                    зарегистрированного пользователя и нажать кнопку "Войти". Если данные введены верно, то откроется главная страница</p>
                    <div className="img_box">
                        <img style={{width:"420px", margin:"0px auto"}} src={require('./image/login.png')} alt="Авторизация"/>
                    </div>
                    <p>Если пользователь введёт неверные значения в поля "Пароль" или "Логин", то будет выведено модальное окно, которое сообщит нам о полученной ошибке. Ошибки приведенны на рисунках</p>
                    <div className="img_box">
                        <img className="square" src={require('./image/login_invalid_username.png')}></img>
                    </div>
                    <p>Пользователя с таким именем не существует</p>
                    <div className="img_box">
                        <img className="square" src={require('./image/login_invalid_password.png')}></img>
                    </div>
                    <p>Введенный пароль неверный</p>
                    
                    <h3 id="registration">Регистрация</h3>
                    <p>При нажатии на гиперссылку "Создать аккаунт" на сайте с авторизацией пользователя отправляет на страницу регистрации, представленную на рисунке.</p>
                    <div className="img_box">
                        <img className="square" src={require('./image/registration.png')}></img>
                    </div>
                    <p>Поля "Логин", "Пароль" и "Электронная почта" необходимо заполнить и нажать на кнопку "Зарегистрироваться". Если данные введены верно,
                    то появится всплывающее окно, которое потребует подтвердить почту</p>
                    <div className="img_box">
                        <img className="square" src={require('./image/registration_validation_email.png')}></img>
                    </div>
                    <p>Если при заполнении поля "Логин" имя пользоваетеля совпадёт с тем, что есть в базе данных, то появится всплывающее окно, оповещающее что такое имя пользоваетеля занято  </p>
                    <div className="img_box">
                        <img className="square" src={require('./image/registration_is_user.png')}></img>
                    </div>
                    <p>При вводе некорректной почты появится представленное на рисунке предупреждение</p>
                    <div className="img_box">
                        <img className="square" src={require('./image/registration_valid_mail.png')}></img>
                    </div>

                    <h3 id="events">События</h3>
                    <p> На главной странцие администратор может создавать, удалять, редактировать, сортировать по времени и фильтровать 
                    по типам и статусу события. Удалить событие администратор может нажав на кнопку <span>"Удалить"</span>.</p>
                        <img className="rect" src={require('./image/events.png')} alt="Список событий"></img> 
                    <h4 id="type_status">Фильтрация по типам и статусу</h4>
                    <p>При нажатии на "фильтровать по типу" и "фильтровать по статусу" открывается dropdown меню, где мы выбираем нужные нам типы и статусы</p>
                        <img className="rect" src={require('./image/type_filtr.png')} alt="Фильтрация по типу"></img>
                    <p>Фильтрация по типу</p>
                        <img className="rect" src={require('./image/status_filtr.png')} alt="Фильтрация по статусу"></img>
                    <p></p>
                    <h4 id="events_sort">Сортировка по времени</h4>
                    <p>При нажатии на "сортировать по времени" открывается меню с выбором сортировки</p>
                        <img className="rect" src={require('./image/events_sort.png')} alt="Сортировка по времени"></img>
                    <h4 id="add_event">Добавление событий</h4>
                    <p> Нажав на кнопку <span>"Добавить событие"</span>, администратор переходит на страницу, представленную на рисунке, где ему нужно обязательно заполнить поля "Название", "Дата и время", "Тип", "Статус" и "Количество волонтёров"
                    и нажать на кнопку <span>"Добавить событие"</span>. После чего администратор перенаправляется на главную страницу</p>
                    <p>При неверном заполнении полей будут выдаваться предупреждения в зависимости от вида поля:</p>
                    <li>Событие с таким именем уже существует</li>
                    <div className="img_box">
                        <img className="square" src={require('./image/event_add_change_is.png')}></img>
                    </div>
                    <li>Введено слишком большое количество волонтеров</li>
                    <div className="img_box">
                        <img className="square" src={require('./image/event_add_change_more.png')} alt="Слишком большое количество волонтеров"></img>
                    </div>
                    <li>Введено слишком маленькое количество волонтеров</li>
                    <div className="img_box">
                        <img className="square" src={require('./image/event_add_change_less.png')} alt="Слишком маленькое количество волонтеров" ></img>
                    </div>
                    <li>В поле с количеством волонтеров введено не число</li>
                    <div className="img_box">
                        <img className="square" src={require('./image/event_add_change_not_number.png')} alt="Введено не число"></img>
                    </div>
                    <li>Обязательное поле</li>
                    <div className="img_box">
                        <img className="square" src={require('./image/event_add_change_required.png')} alt="Обязательное поле"></img>
                    </div>

                    <h4 id="change_event">Редактирование событий</h4>
                    <p> Нажав на кнопку <span>"Редактировать событие"</span>, администратор переходит на страницу, представленную на рисунке, где он может изменить нужные ему поля "Событие", "Дата и время", "Тип", "Статус" или "Количество волонтёров"
                    и нажать на кнопку <span>"Редактировать событие"</span>. После чего администратор перенаправляется на главную страницу</p>
                    <div className="img_box">
                        <img className="square" src={require('./image/event_change.png')} alt="Страница с редактированием события"></img>    
                    </div> 
                    <p>При неверном заполнении полей будут выдаваться такие же предупреждения как и при добавлении событий.</p>

                    <h3 id="activities">Мероприятия</h3>
                    <p>Нажав на имя события, администратор перейдет на страницу с мероприятиями этого события, представленную на рисунке,
                    где ему представляется точно такой же функционал, за исключением того, что фильтрация будет по языкам.</p>
                        <img className="rect" src={require('./image/activities.png')} alt="Страница с мероприятиями"></img>
                    <h4 id="language">Фильтрация языкам</h4>
                    <p>При нажатии на "фильтровать языкам" открывается dropdown меню, где мы выбираем нужные нам языки</p>
                        <img className="rect" src={require('./image/language_filtr.png')} alt="Страница с редактированием события"></img>
                    <h4 id="act_sort">Сортировка по времени</h4>
                    <p>При нажатии на "сортировать по времени" открывается меню с выбором сортировки</p>
                        <img className="rect" src={require('./image/activities_sort.png')} alt="Страница с редактированием события"></img>
                    <h4 id="add_act">Добавление мероприятий</h4>
                    <p> Нажав на кнопку <span>"Добавить меоприятие"</span>, администратор переходит на страницу, представленную на рисунке, где ему нужно обязательно заполнить поля "Мероприятие","Время начала","Языки","Количество волонтёров" и "Локации"
                    и нажать на кнопку <span>"Добавить мероприятие"</span>. После чего администратор перенаправляется на страницу с мероприятиями</p>
                    <p>При неверном заполнении полей будут выдаваться предупреждения в зависимости от вида поля:</p>
                    <ul>
                    <li>Мероприятие с таким именем уже существует</li>
                    <div className="img_box">
                        <img className="square" src={require('./image/activity_add_change_is.png')}></img>
                    </div>
                    <li>Введено слишком большое количество волонтеров</li>
                    <div className="img_box">
                        <img className="square" src={require('./image/activity_add_change_more.png')} alt="Слишком большое количество волонтеров"></img>
                    </div>
                    <li>Введено слишком маленькое количество волонтеров</li>
                    <div className="img_box">
                        <img className="square" src={require('./image/activity_add_change_less.png')} alt="Слишком маленькое количество волонтеров"></img>
                    </div>
                    <li>В поле с количеством волонтеров введено не число</li>
                    <div className="img_box">
                        <img className="square" src={require('./image/activity_add_change_not_number.png')} alt="Введено не число"></img>
                    </div>
                    <li>Обязательное поле</li>
                    <div className="img_box">
                        <img className="square" src={require('./image/activity_add_change_required.png')} alt="Обязательное поле"></img>
                    </div>
                    <li>Локация с таким именем уже существует</li>
                    <div className="img_box">
                        <img className="square" src={require('./image/activity_add_change_is_location.png')} alt="Локация уже существует"></img>
                    </div>
                    <li>Не были введены локации для мероприятия</li>
                    <div className="img_box">
                        <img className="square" src={require('./image/activity_add_change_is_locations.png')}></img>
                    </div>
                    </ul>

                    <h4 id="change_act">Редактирование мероприятий</h4>
                    <p> Нажав на кнопку <span>"Редактировать мероприятие"</span>, администратор переходит на страницу, представленную на рисунке, где он может изменить нужные ему поля "Мероприятие", "Время начала", "Языки", "Количество волонтёров" и "Локации"
                    и нажать на кнопку <span>"Редактировать меоприятие"</span>. После чего администратор перенаправляется на страницу с мероприятиями</p>
                    <div className="img_box">
                        <img className="square" src={require('./image/activity_change.png')} alt="Страница редактирования мероприятия"></img>
                    </div>
                    <p>При неверном заполнении полей будут выдаваться такие же предупреждения как и при добавлении мероприятий</p>
                    <h3 id="request">Заявки</h3>
                    <p>Нажав на гипер ссылку<span>"Нерассмотренные заявки"</span>, администратор отправляется на страницу, представленную на рисунке, где отображаются 
                    заявки со всех мероприятий. Он может их принимать при нажатии на кнопку "Принять"  и отклонять при нажатии на "Отклонить".</p>
                        <img className="rect" src={require('./image/admin_requests.png')} alt="Заявки пользователей"></img>
                </>
                )
            }
        </div> 
    )
}
export default AboutSystemPage;