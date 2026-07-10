import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Account from "./pages/account";
import Admins from "./pages/admins";
import Artists from "./pages/artists";
import Audition from "./pages/audition";
import Faqs from "./pages/faqs";
import History from "./pages/history";
import Home from "./pages/home";
import Login from "./pages/login";
import Page404 from "./pages/page404";
import Project from "./pages/project";
import ViewAuditions from "./pages/viewauditions";
import ViewProjects from "./pages/viewprojects";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import Profile from "./pages/profile";
import Chat from "./pages/chat";
import { useEffect, useState } from "react";
import { useGlobalState } from "./states";
import socket from "./socket";
import { axiosinstance } from "./utils/axiosinstance";

function App() {
  const User = useSelector((state) => state.admin.admin);
  const [clocation] = useGlobalState("location");
  const [, setCurreConversation] = useGlobalState("Cconversation");
  const [, setOnlineusers] = useGlobalState("Online");
  const [, setArrivalnotification] = useGlobalState("Arrivalnotification");
  const [arrivalmsgs, setarrivalmsgs] = useState();
  const [, setUnreadMessages] = useGlobalState("UnreadMessages");

  // Building Socket Connection Here --------------------------------------------------------

  useEffect(() => {
    socket.emit("Adduser", User);
    socket.on("Getusers", (users) => {
      setOnlineusers(users);
    });
    socket.on("GetNotification", (notify) => {
      setArrivalnotification(notify);
    });
    socket.on("GetMessage", (message) => {
      setarrivalmsgs(message);
    });
  }, [User]);

  // Get All Unread  Messaes ----------   ---------------------------------------------------

  useEffect(() => {
    const GetAllUnreadMessages = async () => {
      try {
        const res = await axiosinstance.post(
          `/chat/get/all/unread/msgs/${User?._id}`
        );
        setUnreadMessages(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    GetAllUnreadMessages();
  }, [arrivalmsgs, clocation]);

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
        <Route path="/" element={User ? <Home /> : <Navigate to="/login" />} />
        <Route
          path="/auditions"
          element={User ? <Audition /> : <Navigate to="/login" />}
        />
        <Route
          path="/audition/:id"
          element={User ? <ViewAuditions /> : <Navigate to="/login" />}
        />
        <Route
          path="/artists"
          element={User ? <Artists /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile/:id"
          element={User ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/projects"
          element={User ? <Project /> : <Navigate to="/login" />}
        />
        <Route
          path="/project/:id"
          element={User ? <ViewProjects /> : <Navigate to="/login" />}
        />
        <Route
          path="/faqs"
          element={User ? <Faqs /> : <Navigate to="/login" />}
        />
        <Route
          path="/admins"
          element={User ? <Admins /> : <Navigate to="/login" />}
        />
        <Route
          path="/account"
          element={User ? <Account /> : <Navigate to="/login" />}
        />
        <Route
          path="/history/:id"
          element={User ? <History /> : <Navigate to="/login" />}
        />
        <Route
          path="/chat"
          element={User ? <Chat /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!User ? <Login /> : <Navigate to="/" />}
        />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </Router>
  );
}

export default App;
