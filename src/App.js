import React from 'react';
import { BrowserRouter as Router, Route, Routes,Navigate } from 'react-router-dom';
import Registration from './Registration'; // ваш компонент регистрации
import LoginForm from './LoginForm';
import AddEventPage from "./AddEventPage";
import EventsPage from "./EventsPage";
import ActivitiesPage from "./ActivitiesPage";
import AddActivityPage from "./AddActivityPage";
import EditEventPage from "./EditEventPage";
import EditActivityPage from "./EditActivityPage";
import EditUserProfilePage from "./EditUserProfile";
import UserRequestsPage from "./UserRequestsPage";
import AdminRequestsPage from "./AdminRequestsPage";
import DeveloperPage from "./DeveloperPage";

function App() {


    return (
      <Router>
        <Routes>
          {/* Здесь определяем маршрут для страницы регистрации */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/login" element={<LoginForm />} />
            {<Route path="/add-event" element={<AddEventPage />} />}
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id/activities" element={<ActivitiesPage />} />
            <Route path="/events/:id/activities/create" element={<AddActivityPage />} />
            <Route path="/events/:id/edit" element={<EditEventPage />} />
            <Route path="/events/:eventId/activity/:activityId/edit" element={<EditActivityPage />} />
            <Route path="/profile" element={<EditUserProfilePage />} />
            <Route path="/myRequests" element={<UserRequestsPage />} />
            <Route path="/requests" element={<AdminRequestsPage />} />
            <Route path="/about-developers" element={<DeveloperPage />} />
        </Routes>
      </Router>
  );
}

export default App;
