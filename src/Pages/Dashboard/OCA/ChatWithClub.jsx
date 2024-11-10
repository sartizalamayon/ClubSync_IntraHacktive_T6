import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { BiSend } from "react-icons/bi";
import { FaVideo } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../Context/AuthProvider";

const ChatWithClub = () => {
  const { setLoading, loading } = useContext(AuthContext);
  const { email } = useParams();
  const [clubInfo, setClubInfo] = useState([]);
  const [messages, setMessage] = useState([]);
  const username = email?.split("@")[0];
  const uppercaseUsername = username?.toUpperCase();

  const club = clubInfo.find(club => club.email == email);
  const [text, setText] = useState('');


  // Reference for the chat container to scroll to the latest message
  const chatContainerRef = useRef(null);


  const handleSendMessage = () => {
    const messageInfo = {
      senderEmail: "oca@bracu.ac.bd",
      receiverEmail: email,
      content: text,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("en-US", { hour12: false }),
    };
    axios
      .post("http://localhost:3000/send-message", messageInfo)
      .then((res) => {
        setMessage([...messages, messageInfo]);
        setText("");
        console.log(res.data);
      });
  };

  // Scroll to the latest message when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

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
                <div className="font-bold text-gray-700">{uppercaseUsername}</div>
                <div className="text-sm opacity-50 text-gray-500">BRAC University</div>
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
        {/* chat bubble */}
        <div className="overflow-scroll h-[220px]" ref={chatContainerRef}>
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
                      src={club?.photo_url}
                    />
                  </div>
                </div>
                <div className="chat-header">{uppercaseUsername}</div>
                <div className="chat-bubble bg-[#4D44B5] text-white text-lg">
                  {msg.content}
                </div>
                <div className="chat-footer opacity-100">
                  <time className="text-xs opacity-50">{msg.time}</time>
                </div>
              </div>
            )
          )}
        </div>
        {/* end chat bubble */}
        <div className="divider"></div>
        {/* input for message */}
        <div className="join w-full">
          <input
            onChange={(e) => setText(e.target.value)}
            value={text}
            className="input input-bordered join-item text-[14px] font-normal text-[black] w-[100%] rounded-2xl bg-white"
            placeholder="Write your message..."
          />
          <button
            onClick={() => handleSendMessage()}
            type="submit"
            className="btn join-item rounded-r-full text-white bg-[#4D44B5]"
          >
            Send <BiSend />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWithClub;
