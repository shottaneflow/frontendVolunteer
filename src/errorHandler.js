import { useNavigate } from "react-router-dom";

export const handleError = (error, navigate) => {
    if (error.response) {
        const { status, data } = error.response;

        // Обработка различных статусов HTTP
        switch (status) {
            case 400:
                alert(`${data}`);
                break;
            case 404:
                navigate("/404");
                break;
            case 401:
                navigate("/401");
                break;
            case 503:
                // База данных недоступна
                alert(data.details || "База данных недоступна. Попробуйте позже.");
                break;
            case 500:
                if (data.error === "Database Error") {
                    alert(data.details || "Ошибка базы данных. Попробуйте позже.");
                } else {
                    alert("Ошибка сервера: " + (data.message || "Попробуйте позже."));
                }
                break;
            default:
                console.error("Неизвестная ошибка:", data.message || error.message);
                alert("Произошла ошибка. Попробуйте позже.");
        }
    } else {
        // Обработка сетевых ошибок
        console.error("Ошибка сети или сервера:", error.message);
        alert("Проблема с соединением. Проверьте интернет и попробуйте позже.");
    }
};
