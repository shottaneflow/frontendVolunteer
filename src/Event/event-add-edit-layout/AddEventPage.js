import React, { useState } from "react";
import apiClient from "../../apiClient";
import { Link, useNavigate } from "react-router-dom";
import { handleError } from "../../errorHandler";
import './AddEditEventPage.css';

const AddEventPage = () => {
    const [no_numb,setNoNumb] = useState(false);
    const [more,setMore] = useState(false);
    const [less,setLess] = useState(false);
    const [eventData, setEventData] = useState({
        name: "",
        dateTime: "",
        type: {
            id: "",
            name:"",
        },
        requiredVolunteers: null,
        status: ""
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if(name === "requiredVolunteers"){
            if(isNaN(+value)){
                setMore(false);
                setLess(false);
                setNoNumb(true);
            }
            else {
                if(value > 250){
                    setMore(true);
                }
                else{
                        if(value < 1){
                            setNoNumb(false);
                            setLess(true);
                        }
                        else
                            setLess(false)
                    setMore(false);
                }   
                setNoNumb(false);
            }
            if(value===""){
                setLess(false);
                setMore(false);
                setNoNumb(false);
            }
        }
        setEventData({ ...eventData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post("/admin/events-api/create-event", eventData);
            navigate("/events");
        } catch (error) {
            handleError(error, navigate);
        }
    };

    const getMinDateTime = () => {
        const now = new Date();
        return now.toISOString().slice(0, 16); // Формат для <input type="datetime-local">
    };

    const filtr_list_status = [
        {
            id: "1",
            name: "Не началось",
        },
        {
            id: "2",
            name: "Завершилось",
        },
        {
            id: "3",
            name: "В РАЗГАРЕ!",
        },
    ]
    const filtr_list_type = [
        {
            id: "1",
            name: "Районный",
        },
        {
            id: "2",
            name: "Городской",
        },
        {
            id: "3",
            name: "Всероссийский",
        },
        {
            id: "4",
            name: "Международный",
        },
    ]

    return (
        <div style={{ maxWidth: "400px", margin: "130px auto", textAlign: "left" }}>
            <div style={{display:"flex", flexDirection:"column"}}>
            <Link to="/requests" className="event-add-link" style={{marginLeft:"20px"}}>
             просмотр заявок
            </Link>
            <Link to="/events" className="event-add-link"style={{marginLeft:"10px"}}>
             на главную
            </Link>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="addform">
                    <a className="first_column">Название:</a>
                    <input
                        autoComplete="off"
                        className="second_column"
                        maxLength="150"
                        type="text"
                        name="name"
                        value={eventData.name}
                        onChange={handleChange}
                        required
                    />
                    <label className="first_column">Дата и время:</label>
                    <input
                        className="second_column"
                        style={{textAlign:"center"}}
                        type="datetime-local"
                        name="dateTime"
                        value={eventData.dateTime}
                        onChange={handleChange}
                        min={getMinDateTime()}
                        required
                    />
                    <a className="first_column">Тип :</a>
                    <select

                        name="type"
                        value={eventData.type}
                        onChange={handleChange}
                        style={{borderRadius:"10px",textAlign:'center'}}
                        required
                    >
                        <option value="" selected hidden></option>
                        <option value="" disabled>Выберите тип</option>
                        {filtr_list_type.map(list=>{
                                return(
                                        <option value={list.name} key={list.id}>{list.name}</option>
                                    )
                                })
                            }
                    </select>
                    <label className="first_column">Статус:</label>
                    <select
                        name="status"
                        value={eventData.status}
                        onChange={handleChange}
                        required
                        style={{borderRadius:"10px",textAlign:'center'}}
                    >
                        <option value="" selected hidden></option>
                        <option value="" disabled>Выберите статус</option>
                        {filtr_list_status.map(list=>{
                            return(
                                    <option value={list.name} key={list.id}>{list.name}</option>
                                )
                            })
                        }
                    </select>
                </div>
                    <div style={{margin:"5px 0px",display:"flex",gap:"10px"}}>
                        <label style={{margin:"1px 0px",fontSize:"18px"}}>Количество волонтеров:</label>
                        <div style={{flex:1}}>
                            <input
                                autoComplete="off"
                                className="req-vol"
                                name="requiredVolunteers"
                                value={eventData.requiredVolunteers}
                                onChange={handleChange}
                                required
                            />
                            {more && (
                                <div style={{position:"relative"}}>
                                    <label style={{fontSize:"10px",color:"red",position:"absolute"}}>Вы ввели слишком большое число</label>
                                </div>
                            )}
                            {less && (
                                <div style={{position:"relative"}}>
                                    <label style={{fontSize:"10px",color:"red",position:"absolute"}}>Вы ввели число ниже 0</label>
                                </div>
                            )}
                            {no_numb && (
                                <div style={{position:"relative"}}>
                                    <label style={{fontSize:"10px",color:"red",position:"absolute"}}>Вы ввели не число</label>
                                </div>
                            )}  
                        </div>
                    </div>
                <button className="add-event-button" type="submit" disabled={!(more==false && no_numb == false && less ==false)? "disabled":""}>добавить событие</button>
            </form>
        </div>
    );
};

export default AddEventPage;
