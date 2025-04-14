import React, { useContext, useEffect, useState } from "react";
import { CiVideoOn } from "react-icons/ci";
import { IoCallOutline } from "react-icons/io5";
import { IoSearchSharp } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import { GrView } from "react-icons/gr";
import "./chatbox.css";
import UserViewDetails from "./modal/UserViewDetails";
import axios from "axios";
import { toast } from "react-toastify";
import MyContext from "./context/MyContext";
import { host } from "../utils/host";

export const ChatHeader = ({currentUser}) => { 
  const [UserViewDetailsModal, setUserViewDetailsModal] = useState(false);
  const { user } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
if (loading) return <div className="contacts-container">Loading...</div>; 

 const leaveGroup = async () => {
  try {
    const response = await axios.post(
      `${host}/api/leavegroup/${currentUser.chatId}`,
      {memberId:user._id},
      {withCredentials:true});
      if (response.status === 200) {
        toast.success("You left the group!", { position: "bottom-left" });
        window.location.reload();
      }
  } catch (error) { 
    if (error.status === 400) {
      toast.warn("Admin cannot left the group.", { position: "bottom-left" });
    }
    console.log(error)
  }
 }
 useEffect(()=>{

 },[currentUser]);

  return (
    <div className="chat-header-container">
      <div className="chat-avatar-name">
        <img src={currentUser?.avatar || currentUser?.groupAvatar} />
        <div className="header-name">
          <p>{currentUser?.username || currentUser?.name}</p>
          <span>Online</span>
        </div>
      </div>
      <div className="call-search-maincontainer">
      {currentUser?.memberDetails?.length > 0 && (
          <BiLogOut onClick={leaveGroup} size={"40px"} />
        )}
      { UserViewDetailsModal && <UserViewDetails currentUser={currentUser} closeModal={()=> setUserViewDetailsModal(false)}/> }  
        <GrView  size={'30px'}   onClick={ ()=>setUserViewDetailsModal(true)}/>
      </div>
    </div>
  );
};

        {/* <div className="call-container">

         <div className="video-call">
            <CiVideoOn size={"35px"} />
          </div>
          <div className="call">
            <IoCallOutline size={"28px"} />
          </div> 
        </div> */}