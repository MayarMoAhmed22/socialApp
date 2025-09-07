import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

export let userContext = createContext();

export default function UserContextProvider(props) {

  const [userLogin, setuserLogin] = useState(null);
  
    useEffect(() => {
    const token = Cookies.get("userToken");
    if (token) {
      setuserLogin(token);
    }
  }, []);

  return (
    <userContext.Provider value={{ userLogin, setuserLogin }}>
      {props.children}
    </userContext.Provider>
  );
}
