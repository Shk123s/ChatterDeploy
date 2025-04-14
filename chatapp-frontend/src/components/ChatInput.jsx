import React, { useMemo, useState, useRef, useEffect } from "react";
import { IoMdSend } from "react-icons/io";
import "./chatinput.css";
import { io } from "socket.io-client";
import axios from "axios";
import { toast } from "react-toastify";
import { host } from "../utils/host";

const ChatInput = ({ messageAll, setMessageAll, userView }) => {

  const socket = useMemo(
    () => io(host, { withCredentials: true }),
    []
  );
  useEffect(() => {
    if (userView?.chatId) {
      console.log(`Joining chat room: ${userView.chatId}`);
      socket.emit("join chat", userView.chatId);
    }
    socket.on("message received", (data) => {
      console.log("New message received:", data);
      setMessageAll((prev) => ({
        ...prev,
        messages: [...(prev.messages || []), data],
      }));
    });

    // Cleanup
    return () => {
      socket.off("message received");
    };
  }, [userView, socket, setMessageAll]);

  const message = useRef();

  useEffect(() => {
    if (!userView) return;
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${host}/api/getSingleMessages/${userView.chatId}`,
          { withCredentials: true }
        );
    
        setMessageAll((prev) => ({
          ...prev,
          messages: Array.isArray(response.data.data) ? response.data.data : [],
        }));
      } catch (error) {
        console.error(error);
        toast.warn("An Error Occurred. Please try again.", {
          position: "bottom-left",
        });
      }
    };
    fetchData();
  }, [userView, setMessageAll]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.current.value || !userView?.chatId) return;

    try {
      const senderIdResponse = await axios.post(
        `${host}/api/addMessage`,
        {
          message: message.current.value.trim(),
          messageType: "text",
          chatId: userView.chatId,
        },
        { withCredentials: true }
      );
      socket.emit("new message", {
        sender: { _id: senderIdResponse?.data?.data[0]?.sender?._id },
        message: message.current.value.trim(),
        chatId: userView.chatId,
      });
      setMessageAll((prev) => ({
        ...prev,
        messages: [
          ...(prev.messages || []),
          { message: message.current.value.trim() },
        ],
      }));
      message.current.value = "";
    } catch (error) {
      console.error("Error sending message:", error);
      toast.warn("An Error Occurred. Please try again.", {
        position: "bottom-left",
      });
    }
  };


  return (
    <>
      {/* {socketID} */}
      <form>
        <div className="message-input">
          <input type="text" placeholder="Enter message" ref={message} />
          <IoMdSend size={"35px"} onClick={handleSubmit} />
        </div>
      </form>
    </>
  );
};

export default ChatInput;
