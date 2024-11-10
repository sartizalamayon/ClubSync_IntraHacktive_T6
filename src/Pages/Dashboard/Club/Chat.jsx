import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { BiSend } from "react-icons/bi";
import { FaVideo } from "react-icons/fa";
import { MdNotificationsActive } from "react-icons/md";
import { AuthContext } from "../../../Context/AuthProvider";
import useCurrUser from "../../../hooks/useCurrUser";

const Chat = () => {
  const { user } = useContext(AuthContext);
  const [messages, setMessage] = useState([]);
  const [text, setText] = useState('');
  const chatContainerRef = useRef(null);
  const [currUser] = useCurrUser();

  const username = user?.email.split("@")[0];
  const uppercaseUsername = username.toUpperCase();

  const handleSendMessage = () => {
    const messageInfo = {
      senderEmail: user?.email,
      receiverEmail: "oca@bracu.ac.bd",
      content: text,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("en-US", { hour12: true })
    };
    
    axios.post("http://localhost:3000/send-message", messageInfo).then((res) => {
      setMessage((prevMessages) => [...prevMessages, messageInfo]);
      setText('');
    });
  };

  useEffect(() => {
    
    axios.get(`http://localhost:3000/get-messages/${user?.email}`)
      .then((res) => {
        setMessage(res.data);
        
      });
  }, [user?.email]);

  // Scroll to the bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div>
      {/* header */}
      <div className="navbar p-0 mt-[-20px]">
        <div className="flex-1">
          <a className="text-3xl font-bold text-[#303972] ">Chat</a>
        </div>
        <div className="flex-none gap-2">
          
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src={currUser?.photo_url}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* chat */}
      <div className="mt-3 bg-white p-10 rounded-2xl h-full">
        {/* chat top */}
        <div className="navbar bg-white">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="avatar">
                <div className="mask mask-squircle h-12 w-12">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW710hPlb48q-g88rWvxavK9XmOeFOXU1ZMA&s"
                    alt="Avatar Tailwind CSS Component"
                  />
                </div>
              </div>
              <div>
                <div className="font-bold">OCA</div>
                <div className="text-sm opacity-50">BRAC University</div>
              </div>
            </div>
          </div>
          <div className="flex-none">
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
              >
                <div className="indicator">
                  <FaVideo />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="divider"></div>
        {/* chat bubble */}
        <div ref={chatContainerRef} className="overflow-scroll h-[220px]">
          {messages?.map((msg, index) =>
            msg.senderEmail === "oca@bracu.ac.bd" ? (
              // oca
              <div key={index} className="chat chat-start">
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS chat bubble component"
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW710hPlb48q-g88rWvxavK9XmOeFOXU1ZMA&s"
                    />
                  </div>
                </div>
                <div className="chat-header ">OCA</div>
                <div className="chat-bubble bg-[#F5F5F5] text-lg text-[#303972]">
                  {msg.content}
                </div>
                <div className="chat-footer opacity-100">
                  <time className="text-xs opacity-50">{msg.time} | {msg.date}</time>
                </div>
              </div>
            ) : (
              // club
              <div key={index} className="chat chat-end">
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS chat bubble component"
                      src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    />
                  </div>
                </div>
                <div className="chat-header">{uppercaseUsername}</div>
                <div className="chat-bubble bg-[#4D44B5] text-white text-lg">
                  {msg.content}
                </div>
                <div className="chat-footer opacity-100">
                  <time className="text-xs opacity-50">{msg.time} | {msg.date}</time>
                </div>
              </div>
            )
          )}
        </div>
        <div className="divider"></div>
        {/* input for message */}
        <div className="join w-full">
          <input
            onChange={(e) => setText(e.target.value)}
            value={text}
            className="input input-bordered join-item text-[14px] font-normal text-black w-[100%] rounded-2xl bg-white"
            placeholder="Write your message..."
          />
          <button onClick={handleSendMessage} className="btn join-item rounded-r-full text-white bg-[#4D44B5]">
            Send <BiSend />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
