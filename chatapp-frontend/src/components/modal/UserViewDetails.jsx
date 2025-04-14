import React, { useState } from 'react';
import { FaRegWindowClose, FaRegEdit } from 'react-icons/fa';
import { IoMdPersonAdd } from "react-icons/io";
import UserCard from '../UserCard';
import { IoIosRemoveCircleOutline } from "react-icons/io";
import axios from 'axios';
import { toast } from 'react-toastify';
import SearchUser from './AddUserForGroup';
import { host } from '../../utils/host';

const UserViewDetails = ({ currentUser, closeModal }) => {
  const [members, setMembers] = useState(currentUser?.memberDetails || []);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddMembersModalOpen, setIsAddMembersModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState(currentUser?.groupName || "");

  const handleEditGroupName = async () => {
    try {
      const response = await axios.post(
        `${host}/api/editGroupName/${currentUser.chatId}`,
        { name: newGroupName },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Group name updated successfully!", { position: "bottom-left" });
        closeModal();
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating group name:", error);
      toast.error("Failed to update group name.", { position: "bottom-left" });
    }
  };

  const handleRemoveMember = async (contact) => {
    try {
      const removeMember = await axios.post(
        `${host}/api/removeGroupMembers/${currentUser.chatId}`,
        { members: contact._id },
        { withCredentials: true }
      );

      if (removeMember.status === 200) {
        toast.success("Member Removed!", { position: "bottom-left" });
        setMembers(prevMembers => prevMembers.filter(member => member._id !== contact._id));
      }
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("An error occurred while removing the member.", { position: "bottom-left" });
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        {currentUser?.groupChat && members.length > 0 && (
          <>
            <FaRegEdit
              size={"35px"}
              style={{ cursor: 'pointer', borderRadius: "5px", marginRight: "25px", float: "right" }}
              onClick={() => setIsEditModalOpen(true)}
            />
            <IoMdPersonAdd
              size={"35px"}
              style={{ cursor: 'pointer', borderRadius: "5px", marginRight: "25px", float: "right" }}
              onClick={() => setIsAddMembersModalOpen(true)}
            />
          </>
        )}
        <p style={{ marginTop: "10px", marginRight: "10px", float: "right" }}>
          {currentUser?.groupName}
        </p>

        <FaRegWindowClose
          size={"35px"}
          onClick={() => {
            closeModal();
            window.location.reload();
          }}
          style={{ cursor: 'pointer', borderRadius: "5px" }}
        />

        {currentUser?.groupChat === false ? (
          <UserCard
            style={{ marginLeft: '25px', display: "flex", alignItems: 'center' }}
            username={currentUser?.username}
            avatar={currentUser?.avatar}
            message={currentUser?.bio}
          />
        ) : (
          members.length > 0 ? (
            members.map((contact) => (
              <div key={contact._id} style={{ marginLeft: '45px', display: "flex", alignItems: 'center', gap: "5px" }}>
                <UserCard
                  username={contact.username}
                  avatar={contact.avatar}
                  message={contact.bio}
                />
                <IoIosRemoveCircleOutline
                  size={"35px"}
                  onClick={() => handleRemoveMember(contact)}
                  style={{ color: 'green', cursor: 'pointer' }}
                />
              </div>
            ))
          ) : (
            <p>No member details available.</p>
          )
        )}

        {isEditModalOpen && (
          <div className="edit-modal">
            <div className="edit-modal-content">
              <h3>Edit Group Name</h3>
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Enter new group name"
                style={{ padding: "10px", width: "100%", border: "2px solid black", borderRadius: "8px" }}
              />
              <button
                onClick={handleEditGroupName}
                style={{ backgroundColor: "#9fb1d5", padding: "10px 20px", marginTop: "10px", borderRadius: "8px" }}
              >
                Save
              </button>
              <button
                onClick={() => setIsEditModalOpen(false)}
                style={{ backgroundColor: "#9fb1d5", padding: "10px 20px", marginTop: "10px", marginLeft: "10px", borderRadius: "8px" }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {isAddMembersModalOpen && (
          <SearchUser
            closeModal={() => setIsAddMembersModalOpen(false)}
            currentUser={currentUser}
          />
        )}
      </div>
    </div>
  );
};

export default UserViewDetails;
