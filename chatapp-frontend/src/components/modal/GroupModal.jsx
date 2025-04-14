import './groupModal.css';
import React, { useState } from 'react';
import { FaRegWindowClose } from "react-icons/fa";
import { TbUserSearch } from "react-icons/tb";
import UserCard from '../UserCard';
import { HashLoader } from 'react-spinners';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoMdPersonAdd } from "react-icons/io";
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { host } from '../../utils/host';

const GroupModal = ({ closeModal }) => { 
  const [load, setLoader] = useState(false);
  const [userData, setUserData] = useState([]); 
  const [error, setError] = useState(null);
  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState([]);

  const fetchUser = async (query) => {
    setLoader(true);
    setError(null);

    try {
      const response = await axios.get(`${host}/api/getUser`, {
        withCredentials: true,
        params: { user: query }
      });
      setUserData(response.data.message || []); 
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("User not found.");
    } finally {
      setLoader(false);
    }
  };

  const handleAddMember = (contact) => {
    setMembers((prev) => {
      if (prev.find((member) => member._id === contact._id)) {
        return prev.filter((member) => member._id !== contact._id);
      }
      return [...prev, contact];
    });
  };

  const handleCreateGroup = async () => {
    if (groupName.trim() === '') {
      toast.error("Group name is required!",{
        position: "bottom-left",
    });
      return;
    }
    if (members.length < 3) {
      toast.error("A group must have at least 3 members.",{
        position: "bottom-left",
    });
      return;
    }

    try {
      const response = await axios.post(`${host}/api/createGroup`, {
        name: groupName,
        members: members.map((member) => member._id)
      }, {
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success("Group created successfully!",{
            position: "bottom-left",
        });
        closeModal();
      }
    } catch (error) {
      toast.error("An error occurred while creating the group.",{
        position: "bottom-left",
    });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const inputValue = e.target.elements.username.value.trim();
    if (inputValue) {
      fetchUser(inputValue);
    }
  };

  return (
    <div className="modal">
      <ToastContainer />
      <div className="modal-content">
        <FaRegWindowClose type="button" size={"35px"} onClick={closeModal} style={{ cursor: 'pointer', borderRadius: "5px" }} />
        <form onSubmit={handleSubmit}>
          <div className="message-input">
            <input type="text" name="username" placeholder="Enter user name" />
            <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <TbUserSearch size={"35px"} style={{ marginBottom: "10px", marginLeft: "2px"}} />
            </button>
          </div>
        </form>
        
        <div className="message-input">
          <input
            type="text"
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
              <button onClick={handleCreateGroup} className="create-group-button">Create Group</button>
        </div>
        
        <div className="onlineUser">
          {load ? (
            <div className="loader">
              <HashLoader color="#000000" size={40} />
            </div>
          ) : (
            error ? (
              <p className="error">{error}</p>
            ) : ( 
              userData.map((contact) => (
                <div key={contact._id} style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                  <UserCard
                    username={contact?.username}
                    avatar={contact?.avatar}
                    message={contact?.bio}
                  />
                  <IoMdAddCircleOutline
                    size={"35px"}
                    onClick={() => handleAddMember(contact)}
                    style={{ color: members.find((member) => member._id === contact._id) ? 'green' : 'grey', cursor: 'pointer' }}
                  />
                </div>
              ))
            )
          )}
        </div>

    
      </div>
    </div>
  );
};

export default GroupModal;
