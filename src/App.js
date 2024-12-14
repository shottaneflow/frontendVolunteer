import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Registration from './Registration'; // ваш компонент регистрации
import LoginForm from './LoginForm';
import AddEventPage from "./AddEventPage";
import EventsPage from "./EventsPage";
import ActivitiesPage from "./ActivitiesPage";
import AddActivityPage from "./AddActivityPage";
import EditEventPage from "./EditEventPage";
import EditActivityPage from "./EditActivityPage";

function App() {


    return (
      <Router>
        <Routes>
          {/* Здесь определяем маршрут для страницы регистрации */}
            <Route path="/registration" element={<Registration />} />
            <Route path="/login" element={<LoginForm />} />
            {<Route path="/add-event" element={<AddEventPage />} />}
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id/activities" element={<ActivitiesPage />} />
            <Route path="/events/:id/activities/create" element={<AddActivityPage />} />
            <Route path="/events/:id/edit" element={<EditEventPage />} />
            <Route path="/events/:eventId/activity/:activityId/edit" element={<EditActivityPage />} />
        </Routes>
      </Router>
  );
}

export default App;
