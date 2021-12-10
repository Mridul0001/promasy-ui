import * as React from "react";

const useAuth = () => {
    return {
        isAuthenticated() {
            return localStorage.getItem("test")==="true";
        },
        login(isAdmin,email,password) {
            localStorage.setItem("test",true);
        },
        logout() {
            localStorage.setItem("test",false);
        }
    }
}

export default useAuth;