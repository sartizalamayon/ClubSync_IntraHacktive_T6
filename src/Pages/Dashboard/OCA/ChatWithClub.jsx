import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { BiSend } from "react-icons/bi";
import { FaVideo } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../Context/AuthProvider";

const ChatWithClub = () => {
  const { setLoading, loading } = useContext(AuthContext);
  const { email } = useParams();
  const [clubInfo, setClubInfo] = useState([]);
  const [messages, setMessage] = useState([]);
  const username = email.split("@")[0];
  const uppercaseUsername = username.toUpperCase();
  const club = clubInfo.find(club => club.email == email);
  
  // fetch chat messages from API
  useEffect(() => {
    axios.get(`http://localhost:3000/get-messages/${email}`).then((res) => {
      setMessage(res.data);
    });
    axios.get("http://localhost:3000/get-club-list").then((res) => {
        setClubInfo(res.data);
      });
  }, [email, setLoading]);
  return (
    <div>
      <div className=" bg-white p-8 rounded-2xl h-full">
        {/* chat top */}
        <div className="navbar bg-base-100">
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
                <div className="font-bold">{uppercaseUsername}</div>
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
                  {/* <span className="badge badge-sm indicator-item">8</span> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="divider"></div>
        {/* chat buttle */}
        <div className="overflow-scroll h-[200px]">
          {messages?.map((msg, index) =>
            msg.senderEmail == "oca@bracu.ac.bd" ? (
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
                <div className="chat-header">OCA</div>
                <div className="chat-bubble bg-[#F5F5F5] text-lg text-[#303972]">
                  {msg.content}
                </div>
                <div className="chat-footer opacity-50">
                  <time className="text-xs opacity-50">{msg.time}</time>
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
                <div className="chat-footer opacity-50">
                  <time className="text-xs opacity-50">{msg.time}</time>
                </div>
              </div>
            )
          )}
        </div>
        {/* end chat bubbl */}
        <div className="divider"></div>
        {/* input for message */}
        <div className="join w-full">
          <input
            className="input input-bordered join-item text-[14px] font-normal text-[#A098AE] w-[100%] rounded-2xl"
            placeholder="Write your message..."
          />
          <button className="btn join-item rounded-r-full text-white bg-[#4D44B5]">
            Send <BiSend />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWithClub;
