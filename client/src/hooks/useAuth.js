import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";

// Hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
