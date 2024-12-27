import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {createStore} from "redux";
import { Provider } from 'react-redux';


const defaultState = {
    filtr_list_status:[
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
    ],
    filtr_list_type:[
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
    ],
}

const reducer = (state = defaultState,action) =>{
    switch(action.type){
        case "CHANGE":
            return {...state, event:{name:action.payload.name, requiredVol:action.payload.requiredVol}}
        default:
            return state
    }
}


const store = createStore(reducer)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
    <React.StrictMode>
        <App />
    </React.StrictMode>
    </Provider>
);
