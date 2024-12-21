import React from 'react';
import { BrowserRouter as Router, Route, Routes,Navigate } from 'react-router-dom';
import Registration from './registration-layout/Registration'; // ваш компонент регистрации
import LoginForm from './login-layout/LoginForm';
import AddEventPage from "./Event/event-add-edit-layout/AddEventPage";
import EventsPage from "./Event/events-layout/EventsPage";
import ActivitiesPage from "./Activity/activities-layout/ActivitiesPage";
import AddActivityPage from "./Activity/activities-layout/add-edit-activity-layout/AddActivityPage";
import EditEventPage from "./Event/event-add-edit-layout/EditEventPage";
import EditActivityPage from "./Activity/activities-layout/add-edit-activity-layout/EditActivityPage";
import EditUserProfilePage from "./User/user-profile-layout/EditUserProfile";
import UserRequestsPage from "./User/user-requests-layout/UserRequestsPage";
import AdminRequestsPage from "./admin-requests-layout/AdminRequestsPage";
import DeveloperPage from "./developers-layout/DeveloperPage";
import UnauthorizedPage from "./UnauthorizedPage";
import NotFoundPage from "./NotFoundPage";
import AboutSystemPage from './system-layout/AboutSystemPage';

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
            <Route path="/about-system" element={<AboutSystemPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="/401" element={<UnauthorizedPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
  );
}

export default App;
