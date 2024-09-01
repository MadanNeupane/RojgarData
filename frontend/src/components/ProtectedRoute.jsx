import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";


function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false));
    }, []);

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        if (refreshToken) {
            try {
                const response = await api.post("/accounts/jwt/refresh/", {
                    refresh: refreshToken
                });
                if (response.status === 200) {
                    localStorage.setItem(ACCESS_TOKEN, response.data.access);
                    setIsAuthorized(true);
                } else {
                    setIsAuthorized(false);
                }
            } catch (error) {
                console.log(error);
                setIsAuthorized(false);
            }
        }
    }

    const auth = async () => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        if (accessToken) {
            const decoded = jwtDecode(accessToken);
            const tokenExpiration = new Date(decoded.exp * 1000);
            if (tokenExpiration < new Date()) {
                await refreshToken();
            } else {
                setIsAuthorized(true);
            }
        } else {
            setIsAuthorized(false);
        }
    }

    return isAuthorized ? children : <Navigate to="/login" />
}

export default ProtectedRoute
