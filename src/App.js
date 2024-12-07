import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Registration from './Registration'; // ваш компонент регистрации
import LoginForm from './LoginForm';

function App() {
  return (
      <Router>
        <Routes>
          {/* Здесь определяем маршрут для страницы регистрации */}
            <Route path="/registration" element={<Registration />} />
            <Route path="/login" element={<LoginForm />} />
        </Routes>
      </Router>
  );
}

export default App;
