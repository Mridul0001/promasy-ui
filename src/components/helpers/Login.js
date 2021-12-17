import * as React from "react";
import axios from 'axios';
const url = process.env.REACT_APP_PROMASY_API_URL;
const useAuth = () => {
    return {
        isAuthenticated() {
            return localStorage.getItem("auth")==="true";
        },
        login(email,password) {
            const body = {
                email:email,
                password:password
            }
            return axios.post(url+"v1/login", body);
        }
    }
}

export const logout = () => {
    localStorage.clear();
    window.location.href="/";
}

export default useAuth;