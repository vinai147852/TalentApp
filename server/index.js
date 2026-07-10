const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const { Server } = require("socket.io");

// Import All Routes -----------------------------------------------------
const AuthRoute = require("./Routes/auth");
const UserAuthRoute = require("./Routes/userauth");
const UserRoute = require("./Routes/user");
const AdminRoute = require("./Routes/admin");
const AssistantRoute = require("./Routes/assistant");
const AuditionRoute = require("./Routes/audition");
const ProjectRoute = require("./Routes/project");
const ReviewRoute = require("./Routes/review");
const BlockRoute = require("./Routes/block");
const AddedArtistsRoute = require("./Routes/addedartists");
const ChatRoute = require("./Routes/chat");
const NotificationRoute = require("./Routes/notification");
const NewsLetterRoute = require("./Routes/newsletter");
const AdminLogsRoute = require("./Routes/adminlogs");
const SpasswordRoute = require("./Routes/superpassword");
const EmailRoute = require("./Routes/email");
const VisitorRoute = require("./Routes/visitor");
const ForgotPassRoute = require("./Routes/forgotpassword");
const UploadRoute = require("./Routes/upload");

// Middle wares ----------------------------------------------------------
dotenv.config();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(__dirname + "/uploads"));

// Setting Up apis
app.use("/api/auth", AuthRoute);
app.use("/api/user/auth", UserAuthRoute);
app.use("/api/user", UserRoute);
app.use("/api/admin", AdminRoute);
app.use("/api/assistant", AssistantRoute);
app.use("/api/audition", AuditionRoute);
app.use("/api/project", ProjectRoute);
app.use("/api/review", ReviewRoute);
app.use("/api/block", BlockRoute);
app.use("/api/addedartist", AddedArtistsRoute);
app.use("/api/chat", ChatRoute);
app.use("/api/notification", NotificationRoute);
app.use("/api/newsletter", NewsLetterRoute);
app.use("/api/adminlogs", AdminLogsRoute);
app.use("/api/spassword", SpasswordRoute);
app.use("/api/email", EmailRoute);
app.use("/api/visitor", VisitorRoute);
app.use("/api/forgot/password", ForgotPassRoute);
app.use("/api/upload", UploadRoute);

// Connecting to MongoDB --------------------------------------------------------

// Listening to App -----------------------------------------------------
const myserver = app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`Listening on port ${process.env.PORT}`);
});

// Initilaizing Socket Server Here ------------------------------------------------------------
const io = new Server({
  cors: {
    origin: "*",
  },
});

// Stroring Users
let users = [];

// Store Online Users ------------------------------------------------------------
const AddUsers = ({ userId, socketId, role }) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId, role });
};

// Remove Online Users ------------------------------------------------------------
const RemoveUsers = (socketId) => {
  users = users.filter((item) => item.socketId !== socketId);
};

// Gte Online User ------------------------------------------------------------
const GetUser = (recieverId) => {
  return users.find((item) => item.userId === recieverId);
};

// On Socket Connection -------------------------------------------------------------------

io.on("connection", (socket) => {
  // Send Current User Id-------------------------------------------------------
  socket?.id && io.to(socket?.id).emit("CurrentUser", socket?.id);

  socket.on("Adduser", (user) => {
    user?._id &&
      AddUsers({ userId: user?._id, socketId: socket?.id, role: user?.role });
    io.emit("Getusers", users);
  });

  socket.on("SendMessage", ({ recieverId, message }) => {
    const user = GetUser(recieverId);
    user && io.to(user?.socketId).emit("GetMessage", message);
  });

  socket.on("SendisClosed", ({ recieverId, isClosed }) => {
    const user = GetUser(recieverId);
    user && io.to(user?.socketId).emit("GetisClosed", isClosed);
  });

  socket.on("SendTyping", ({ recieverId, conversationId, istyping }) => {
    const user = GetUser(recieverId);
    user &&
      io.to(user?.socketId).emit("GetTyping", { conversationId, istyping });
  });

  socket.on("SendNotification", (response) => {
    io.emit("GetNotification", response);
  });

  socket.on("disconnect", () => {
    RemoveUsers(socket.id);
    io.emit("Getusers", users);
  });
});

// Adding Online Users -------------------------------------------------------------------

io.listen(myserver);
