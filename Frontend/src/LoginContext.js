import { createContext } from "react";

export const LoginContext = createContext({
    isLoggedIn : false,
    userId : null,
    token : null,
    login :() =>{},
    logout : () => {}
})