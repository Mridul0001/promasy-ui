import { Navigate, useLocation } from "react-router";
import useAuth from './Login';

const Authenticate = ({children}) => {
    const location = useLocation();
    const isAuthenticated = useAuth().isAuthenticated;

    return isAuthenticated() ? 
            children :
             <Navigate
                to="/"
                replace
                state={{path:location.pathname}} />
}

export default Authenticate