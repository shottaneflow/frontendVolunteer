import React from "react";

const UnauthorizedPage = () => {
    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Ошибка 401</h1>
            <p>У вас нет доступа к этой странице</p>
        </div>
    );
};

export default UnauthorizedPage;
