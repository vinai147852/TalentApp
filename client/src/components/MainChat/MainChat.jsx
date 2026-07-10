import React, { useState, useRef, useMemo, useEffect } from "react";
import "./mainchat.scss";
import Picker from "emoji-picker-react";
import Conversation from "./Conversation";
import { Link, useLocation } from "react-router-dom";
import Message from "./Message";
import { axiosinstance } from "../../utils/axiosinstance";
import { useSelector } from "react-redux";
import { useGlobalState } from "../../states";
import RobotImg from "../../images/tapp-chat.jpg";
import { GetReceiverId } from "./GetReceiverId";
import socket from "../../socket";
import $ from "jquery";

export default function MainChat() {
  const User = useSelector((state) => state.user.user);
  const [isEmoji, setisEmoji] = useState(false);
  const [message, setMessage] = useState();
  const [AllConversations, setAllConversations] = useState();
  const [CurrConversation] = useGlobalState("Cconversation");
  const [, setCLocation] = useGlobalState("location");
  const [Onlineusers] = useGlobalState("Online");
  const location = useLocation();
  const [Messages, setMessages] = useState([]);
  const [ArrivalMessage, setArrivalMessage] = useState([]);
  const [Reciever, setReciever] = useState();
  const [Typing, setTyping] = useState();
  const recieverId =
    CurrConversation && GetReceiverId(CurrConversation?.members, User?._id);
  const isOnline = Onlineusers?.some((item) => item?.userId === recieverId);
  const MessageRef = useRef();
  const ScrollToMessage = useRef();

  // Check if There is Any Real time Messages
  useEffect(() => {
    socket.on("GetMessage", (message) => {
      setArrivalMessage(message);
    });

    socket.on("GetTyping", ({ conversationId, istyping }) => {
      setTyping({ conversationId, istyping });
    });
  }, []);

  // Mark Unread Messages as Read on Current Conversation set -----------------------------------
  const MarkasRead = async () => {
    try {
      const res = await axiosinstance.put(
        `/chat/messages/read/${CurrConversation?._id}`,
        {
          senderId: User?._id,
        }
      );
      // Sending Real Time Message ------------------------------------------------------------
      socket.emit("SendMessage", {
        recieverId,
        message: res.data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Get My Conversations ---------------------------------------------------------------------------

  const GetAllMyConversation = async () => {
    try {
      const res = await axiosinstance.get(
        `/chat/get/conversations/${User?._id}`
      );
      setAllConversations(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Get Current Conversation Messages ----------------------------------------------------------------

  const AllMessages = async () => {
    try {
      const res = await axiosinstance.get(
        `/chat/get/messages/${CurrConversation?._id}`
      );
      setMessages(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Send A Message ----------- ----------------------------------  ------------------------
  const SendMessage = async () => {
    try {
      const res = await axiosinstance.post("/chat/create/messages", {
        conversationId: CurrConversation?._id,
        senderId: User?._id,
        message,
      });
      setMessages((prev) => [...prev, res.data]);
      setMessage();
      MessageRef.current.value = "";

      // Sending Real Time Message ------------------------------------------------------------
      socket.emit("SendMessage", {
        recieverId,
        message: res.data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Get Reciever User -------------------------------------------------------------
  const GetReciever = async () => {
    try {
      const res = await axiosinstance.get(`/chat/receiver/${recieverId}`);
      setReciever(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Real time typing Functionality -----------------------------------------------------------
  useEffect(() => {
    socket.emit("SendTyping", {
      recieverId,
      conversationId: CurrConversation?._id,
      istyping: message ? true : false,
    });
  }, [message, CurrConversation?._id]);

  // Handle User Effect Functions ------------------------------  -----------------------------
  useMemo(() => {
    (User || message) && GetAllMyConversation();
    (CurrConversation?._id || ArrivalMessage) && AllMessages();
    (CurrConversation?._id || (CurrConversation?._id && ArrivalMessage)) &&
      MarkasRead();
    recieverId && GetReciever();
  }, [User, CurrConversation?._id, recieverId, ArrivalMessage, message]);

  useEffect(() => {
    ScrollToMessage.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  }, [Messages]);

  // Handle Emojies in Input Feild -    --------------------------------------------------------
  const EmojiClick = (e, obj) => {
    const emoji = obj.emoji;
    setMessage((prev) => (prev ? prev + emoji : emoji));
  };

  // Update Location ----------------------------------------------------------------------------
  useEffect(() => {
    setCLocation(location.pathname);
  }, [location]);

  // Handle Chat Search ---------------     --------------------------------------------------

  const HandleSearch = (e) => {
    var value = e.target.value.toLowerCase().replace(" ", "");
    const AllConversations = $(".Fd_name");
    $.map(AllConversations, (item) => {
      if (item.innerText.toLowerCase().replace(" ", "").includes(value)) {
        $(item).fadeIn();
      } else {
        $(item).fadeOut();
      }
    });
  };

  return (
    <div className="main_chat_container">
      <div className="inner_chat_container">
        <Link to="/" className="back_btn_chat">
          <i className="fa-solid fa-chevron-left"></i>
        </Link>
        <div className="left_chat_bar">
          <div className="left_chat_inner">
            <div className="chat_search_user">
              <div className="left_chat_search_bar">
                <input
                  type="text"
                  placeholder="Search name"
                  onChange={(e) => HandleSearch(e)}
                />
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
            </div>
            <div className="allconversations_left_chat">
              {AllConversations?.map((item) => {
                return (
                  <Conversation key={item?._id} item={item} Typing={Typing} />
                );
              })}
            </div>
          </div>
        </div>
        <div className="right_chat_bar">
          {CurrConversation ? (
            <div className="right_chat_inner_container">
              <div className="chat_container_heading_right">
                <div className="current_chat_user_right">
                  <div className="right_chat_user_img">
                    <img src={Reciever?.ProfilePic} alt="" />
                  </div>
                  <div className="right_chat_user_info">
                    <h2>
                      {Reciever?.username
                        ? Reciever?.username
                        : Reciever?.name + " " + Reciever?.surname}
                    </h2>
                    {Typing?.conversationId === CurrConversation?._id &&
                    Typing?.istyping ? (
                      <p>Typing ...</p>
                    ) : (
                      isOnline && <p>Online</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="main_chat_container_messages">
                <div className="chat_messages_container">
                  {Messages?.map((item) => {
                    return (
                      <div key={item?._id} ref={ScrollToMessage}>
                        <Message
                          item={item}
                          own={item?.senderId === User?._id}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="chat_send_box">
                  {CurrConversation?.isClosed ? (
                    <div className="conversation_closed">
                      <h2>This Conversation is Currently Closed</h2>
                    </div>
                  ) : (
                    <div className="chat_send_box_inner">
                      <div className="chat_send_message_input">
                        <div className="emoji_picker">
                          {isEmoji && (
                            <div className="emoji_picker_container">
                              <Picker onEmojiClick={EmojiClick} />
                            </div>
                          )}
                          <i
                            className="fa-solid fa-face-smile"
                            onClick={() => setisEmoji(!isEmoji)}
                          ></i>
                        </div>
                        <textarea
                          ref={MessageRef}
                          placeholder="Type a message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                        ></textarea>
                      </div>
                      <div className="send_message_btn">
                        <button
                          disabled={!message && true}
                          onClick={SendMessage}
                        >
                          <i className="fa-solid fa-paper-plane"></i>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="no_conversation">
              <div className="inner_no_cnversation">
                <img src={RobotImg} alt="" />
                <h2>Select a conversation to chat</h2>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
