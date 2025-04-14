import React, { useContext, useEffect, useRef } from "react";
import "./messages.css";
import MyContext from "./context/MyContext";

export const Messages = ({ messageAll }) => {
  const scrollRef = useRef();
  const { user } = useContext(MyContext);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageAll]);

  return (
    <div className="main-message-container">
      {messageAll.messages?.map((item, index) => {
        if (!item?.message) return null; // Skip rendering if message is empty

        return (
          <div
            ref={scrollRef}
            key={item._id || index}
            className={`message ${
              item.senderId === user._id ? "sended" : "recieved"
            }`}
          >
            <div className="content">{item.message}</div>
          </div>
        );
      })}
    </div>
  );
};