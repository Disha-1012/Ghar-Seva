import { useContext } from "react";
import { AuthContext } from "./src/context/AuthContext";

export default function Navigation() {
  const { userToken, loading } = useContext(AuthContext);

  if (loading) return null;

  return userToken ? <MainStack /> : <AuthStack />;
}