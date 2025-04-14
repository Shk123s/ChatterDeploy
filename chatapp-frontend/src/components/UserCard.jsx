import React from "react";
import "./contacts.css";
const UserCard = ({ username, avatar, message, time }) => {
  return (
    <div className="usercard-container">
      <div className="usercard-avatar">
        <img src={avatar} />
      </div>
      <div className="usercard-details">
        <p>
          <strong>{username}</strong>
        </p>
        <span>{message}</span>
      </div>
      <div className="usercard-message-timing">
        <span>{time}</span>
      </div>
    </div>
  );
};

export default UserCard;
