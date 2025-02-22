import "./../global.css";
import { Redirect } from "expo-router";

export default function Index() {
  // TODO: Check authentication status
  const isAuthenticated = false;

  return <Redirect href={isAuthenticated ? "(app)/home" : "/login"} />;
}
