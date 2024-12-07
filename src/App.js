import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Registration from './Registration'; // ваш компонент регистрации
import LoginForm from './LoginForm';
import EventsPage from "./EventsPage";
import AddEventPage from "./AddEventPage";

function App() {
  return (
      <Router>
        <Routes>
          {/* Здесь определяем маршрут для страницы регистрации */}
            <Route path="/registration" element={<Registration />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/add-event" element={<AddEventPage />} />
        </Routes>
      </Router>
  );
}

export default App;
