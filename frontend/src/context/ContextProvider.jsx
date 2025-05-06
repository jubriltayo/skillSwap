import { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../api/axios-client";

const StateContext = createContext({
    user: null,
    token: null,
    notification: null,
    setUser: () => {},
    setToken: () => {},
    setNotification: () => {},
});

export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("USER")) || null);
    const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));
    const [notification, _setNotification] = useState("");

    // ensure token is saved both in memory and local storage to avoid token loss on refresh
    const setToken = (token) => {
        _setToken(token);
        if (token) {
            localStorage.setItem("ACCESS_TOKEN", token);
        } else {
            localStorage.removeItem("ACCESS_TOKEN");
        }
    };

    const setNotification = (message) => {
        _setNotification(message);
        setTimeout(() => {
            _setNotification("");
        }, 5000);
    };

    useEffect(() => {
        if (token) {
            axiosClient.get("/user")
                .then(({ data }) => {
                    setUser(data);
                    localStorage.setItem("USER", JSON.stringify(data));
                })
                .catch(() => {
                    setToken(null);
                });
        }
    }, [token])

    return (
        <StateContext.Provider value={{ user, setUser, token, setToken, notification, setNotification }}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
