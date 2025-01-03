import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import apiClient from "../../apiClient";
import { handleError } from "../../errorHandler";
import './AddEditEventPage.css';
import { useSelector } from "react-redux";

const EditEventPage = () => {
    const filtr_list_status = useSelector(state => state.filtr_list_status);
    const filtr_list_type = useSelector(state=>state.filtr_list_type);
    const { id } = useParams();
    const navigate = useNavigate();
    const [events,setEvents] = useState([]);
    const [event, setEvent] = useState(null);
    const [no_numb,setNoNumb] = useState(false);
    const [more,setMore] = useState(false);
    const [less,setLess] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await apiClient.get(`http://localhost:8081/admin/events-api/events/${id}`);
                setEvent(response.data);
            } catch (error) {
                handleError(error, navigate);
            }
        };
        const fetchEvents = async ()=>{
            try{
                const response =await apiClient.get(`http://localhost:8081/admin/events-api/all-events`);
                setEvents(response.data);
            }
            catch(error){
                handleError(error,navigate);
            }
        }
        fetchEvents();
        fetchEvent();
    }, [id]);

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
        setEvent((prevEvent) => ({ ...prevEvent, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if(!events
        .filter((ev)=>{return ev.id != id})
        .some((ev)=>{return ev.name === event.name})){
            try {
                await apiClient.post(`http://localhost:8081/admin/events-api/${id}/edit-event`, event);
                navigate("/events");
            } catch (error) {
                handleError(error, navigate);
            }
        }
        else alert(`Событие с именем "${event.name}" уже существует`);
    };

    const getMinDateTime = () => {
        const now = new Date();
        return now.toISOString().slice(0, 16); // Формат для <input type="datetime-local">
    };

    if (!event) {
        return <p>Загрузка...</p>;
    }
    return (
        <div className="event-add-change-form">
            <div style={{display:"flex", flexDirection:"column", fontSize:"10px",marginLeft:"10px"}}>
                <Link to="/requests" className="event-link" style={{marginLeft:"10px"}}>
                    просмотр заявок
                </Link>
                <Link to="/events" className="event-link">
                    на главную
                </Link>
            </div>
            <form onSubmit={handleSave}>
                    <div className="addform">
                        <label className="first_column">
                            Событие:
                        </label>
                        <input
                            autoComplete="off"
                            style={{textAlign:"center"}}
                            className="second_column" 
                            name="name" 
                            value={event.name} 
                            onChange={handleChange}
                            required
                        />
                        <label className="first_column">
                            Время:
                        </label>
                        <input 
                            style={{textAlign:"center"}}
                            className="second_column"
                            type="datetime-local"
                            name="dateTime"
                            value={event.dateTime} 
                            onChange={handleChange} 
                            min={getMinDateTime()} 
                            required />
                        <a className="first_column">Тип :</a>
                        <select
                            name="type"
                            value={event.type}
                            onChange={handleChange}
                            style={{borderRadius:"10px",textAlign:"center"}}
                            required
                        >
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
                            value={event.status}
                            onChange={handleChange}
                            required
                            style={{borderRadius:"10px",textAlign:"center"}}
                        >
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
                                    value={event.requiredVolunteers}
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
                                    <label style={{fontSize:"10px",color:"red",position:"absolute"}}>Вы ввели недопустимое число</label>
                                </div>
                            )}
                            {no_numb && (
                                <div style={{position:"relative"}}>
                                    <label style={{fontSize:"10px",color:"red",position:"absolute"}}>Вы ввели не число</label>
                                </div>
                            )}  

                            </div>
                        </div>
                    <div style={{display:"flex",flexDirection:"column"}}>
                        <button type="submit" className="change-event-button" disabled={!(more==false && no_numb == false && less ==false)? "disabled":""}>Редактировать событие</button>
                    </div>
                </form>
                <button className="act-list-activity" onClick={() => navigate(`/events/${id}/activities`)}>Список мероприятий</button>
            </div>
    );
};

export default EditEventPage;
