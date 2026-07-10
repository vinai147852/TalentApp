import io from "socket.io-client";
const ENDPOINT =
  process.env.NODE_ENV === "production"
    ? "https://tjcfdbv2-5005.inc1.devtunnels.ms/"
    : `http://${window.location.hostname}:5005/`;
export default io(ENDPOINT);
