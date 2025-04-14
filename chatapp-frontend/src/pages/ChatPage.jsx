import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideNavbar from "../components/SideNavbar";
import Contacts from "../components/Contacts";
import ChatBox from "../components/ChatBox";
import "./chatpage.css";
export default function ChatPage() {
  const [data, setData] = useState({});
  const navigate = useNavigate();
  // useEffect(() => {
    //   const token = localStorage.getItem("token");
    //   console.log(token)
    //   if (!token) {
  //     navigate('/');
  //   } 
  // }, []);
  return (
    <div className="chat-container">
      <SideNavbar />
      <Contacts setUserView={setData} userView={data} />
      <ChatBox userView={data} />
    </div>
  );
}
