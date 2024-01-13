import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const useAuthToken = () => {

    const context = useContext(AuthContext);

    const setToken = (newToken: string) => {
        window.localStorage.setItem('authToken', newToken);
        context.setToken(newToken);
    };

    const removeToken = () => {
        window.localStorage.removeItem('authToken');
        context.setToken(null);
    }

    return {
        setToken,
        removeToken,
        token: context.token,
        isLoggedIn: context.token !== null
    }
};

export default useAuthToken;
