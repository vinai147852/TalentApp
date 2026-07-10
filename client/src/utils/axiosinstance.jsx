import axios from "axios";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://tjcfdbv2-5005.inc1.devtunnels.ms/api/"
    : "http://localhost:5005/api/";
    
const AuthRequest = () => {
  const Token = JSON.parse(
    JSON.parse(localStorage.getItem("persist:talentapp-client")).user
  ).user?.accesstoken;

  const adminaxiosinstance = axios.create({
    baseURL: BASE_URL,
    headers: { token: `Bearer ${Token}` },
  });

  return adminaxiosinstance;
};

export const axiosinstance = axios.create({
  baseURL: BASE_URL,
});

export default AuthRequest;
