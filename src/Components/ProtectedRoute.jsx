import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { userContext } from "../Context/userContext";

export default function ProtectedRoute({children}) {
   const { userLogin } = useContext(userContext);

  if (!userLogin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

