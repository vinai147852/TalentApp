import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Notfound from "./components/Notfound/Notfound";
import About from "./pages/about";
import Account from "./pages/account";
import Audition from "./pages/audition";
import Contact from "./pages/contact";
import Faq from "./pages/faq";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Viewaudition from "./pages/viewaudition";
import Chat from "./pages/chat";
import { useGlobalState } from "./states";
import socket from "./socket";
import { useEffect, useState } from "react";
import { axiosinstance } from "./utils/axiosinstance";
import axios from "axios";
import Conditions from "./pages/conditions";
import Forgotpass from "./pages/forgotpass";

function App() {
  const User = useSelector((state) => state.user.user);
  const [details, setDetails] = useState();
  const [CurrentVisitor, setCurrentVisitor] = useState();
  const [clocation] = useGlobalState("location");
  const [, setCurreConversation] = useGlobalState("Cconversation");
  const [, setOnlineusers] = useGlobalState("Online");
  const [, setArrivalnotification] = useGlobalState("Arrivalnotification");
  const [arrivalmsgs, setarrivalmsgs] = useState();
  const [, setUnreadMessages] = useGlobalState("UnreadMessages");

  // Building Socket Connection Here --------------------------------------------------------

  useEffect(() => {
    socket.emit("Adduser", User);
    socket.on("CurrentUser", (CurrentUserId) => {
      setCurrentVisitor(CurrentUserId);
    });
    socket.on("Getusers", (users) => {
      setOnlineusers(users);
    });
    socket.on("GetNotification", (notify) => {
      setArrivalnotification(notify);
    });
    socket.on("GetMessage", (message) => {
      setarrivalmsgs(message);
    });
    socket.on("GetisClosed", (isClosed) => {
      setCurreConversation((prev) => ({ ...prev, isClosed: isClosed }));
    });
  }, [User]);

  // Get My Ip address ---------------------------------------------------------------------

  const getData = async () => {
    const res = await axios.get(`https://ipinfo.io/json?token=0d52c4a0300810`);
    setDetails(res.data);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const AddVisitor = async () => {
      try {
        await axiosinstance.post("/visitor/create", {
          ip: details?.ip,
          country: details?.country,
          visitorId: CurrentVisitor,
          isRegistered: User?._id && true,
        });
      } catch (error) {
        console.log(error);
      }
    };
    details && CurrentVisitor && AddVisitor();
  }, [details, CurrentVisitor]);

  // Get All Unread  Messaes ----------   ---------------------------------------------------

  useEffect(() => {
    const GetAllUnreadMessages = async () => {
      try {
        if (User?._id) {
          const res = await axiosinstance.post(
            `/chat/get/all/unread/msgs/${User._id}`
          );
          setUnreadMessages(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    GetAllUnreadMessages();
  }, [arrivalmsgs, clocation, User?._id]);

  // Clearing The Current Conversation if we are not in chat page -----------------------------

  useEffect(() => {
    if (clocation !== null && clocation !== "/chat") {
      setCurreConversation(null);
    }
  }, [clocation]);
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/about"
          element={User ? <About /> : <Navigate to="/login" />}
        />
        <Route
          path="/auditions"
          element={User ? <Audition /> : <Navigate to="/login" />}
        />
        <Route
          path="/faqs"
          element={User ? <Faq /> : <Navigate to="/login" />}
        />
        <Route
          path="/contact"
          element={User ? <Contact /> : <Navigate to="/login" />}
        />
        <Route
          path="/account"
          element={User ? <Account /> : <Navigate to="/login" />}
        />
        <Route
          path="/chat"
          element={User ? <Chat /> : <Navigate to="/login" />}
        />
        <Route path="/audition/:id" element={<Viewaudition />} />
        <Route path="/policy" element={<Conditions />} />
        <Route
          path="/forgotpassword"
          element={!User ? <Forgotpass /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!User ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!User ? <Register /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </Router>
  );
}

export default App;
