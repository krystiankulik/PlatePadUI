import { useState } from 'react';

const useAuthToken = () => {
    const [token, setTokenInternal] = useState<string | null>(() => {
        return window.localStorage.getItem('authToken');
    });

    const setToken = (newToken: string) => {
        window.localStorage.setItem('authToken', newToken);
        setTokenInternal(newToken);
    };

    const removeToken = () => {
        window.localStorage.removeItem('authToken');
        setTokenInternal(null);
    }

    return {
        setToken,
        removeToken,
        token,
        isLoggedIn: token !== null
    }
};

export default useAuthToken;
