import React, { useState, useEffect, useContext } from "react";
import "./contacts.css";
import axios from "axios";
import UserCard from "./UserCard";
import Modal from "./modal/SearchUserModal";
import { HashLoader } from "react-spinners";
import { TiGroupOutline } from "react-icons/ti";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import GroupModal from "./modal/GroupModal";
import MyContext from "./context/MyContext";
import { host } from "../utils/host";

const Contacts = ({ setUserView }) => {
  const [showModal, setModal] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModalGroup, setModalGroup] = useState(false);
  const { user } = useContext(MyContext);
  const [selectedChat, setSelectedChat] = useState(null); 

  useEffect(() => {
    // const token = localStorage.getItem("token");
    const fetchData = async () => {
      try {
        const getData = await axios.get(
          `${host}/api/getConversation`,
          { withCredentials: true }
        );
        setData(getData.data.message);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleClick = (displayUser, chatId) => {
    displayUser.chatId = chatId;
    setUserView(displayUser);
    setSelectedChat(chatId); // Set the selected chat
  };

  if (loading)
    return (
      <div className="contacts-container">
        <HashLoader className="loader" color="#0000" size={40} />
      </div>
    );

  return (
    <div className="contacts-container">
      <div className="contact-heading">
        <h1>Chats</h1>
        <AiOutlineUsergroupAdd
          size={"30px"}
          style={{ cursor: "pointer" }}
          onClick={() => setModal(true)}
        />
        <span className="createChat">Create Chat</span>
        <div className="groupIconDiv">
          <div
            className="create-group-btn"
            style={{ cursor: "pointer" }}
            onClick={() => setModalGroup(true)}
          >
            <TiGroupOutline size={"30px"} />
          </div>
          <span>Create Group</span>
        </div>
        <input type="text" placeholder="search" />
      </div>

      {showModal && <Modal closeModal={() => setModal(false)} />}
      {showModalGroup && <GroupModal closeModal={() => setModalGroup(false)} />}

      {data.length === 0 ? (
        <h3 style={{ marginTop: "20rem", textAlign: "center" }}>
          Create the chat!
        </h3>
      ) : (
        data.map((contact) => {
          const isGroupChat = contact.groupChat;

          const displayUser = isGroupChat
            ? {
                username: contact.name,
                avatar: contact.groupAvatar,
                bio: "Group Chat",
                memberDetails: contact.memberDetails,
                groupChat: true,
              }
            : {
                ...(user?._id === contact.memberDetails[0]._id
                  ? contact.messageUser
                  : contact.memberDetails[0]),
                groupChat: false,
              };

          return (
            <div
              onClick={() => handleClick(displayUser, contact?._id)}
              key={contact?._id}
              className={`contact-item ${
                selectedChat === contact?._id ? "selected" : ""
              }`} 
            >
              <UserCard
                username={displayUser?.username || contact.name}
                avatar={displayUser?.avatar || contact.groupAvatar}
                message={displayUser?.bio || contact.createdAt}
              />
            </div>
          );
        })
      )}
    </div>
  );
};

export default Contacts;
