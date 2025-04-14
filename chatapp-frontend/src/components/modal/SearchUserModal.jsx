import './searchUser.css';
import React, { useState } from 'react';
import { FaRegWindowClose } from "react-icons/fa";
import { TbUserSearch } from "react-icons/tb";
import UserCard from '../UserCard';
import { HashLoader } from 'react-spinners';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import axios from 'axios';
import { host } from '../../utils/host';

const SearchUser = ({ closeModal }) => { 
  const [load, setLoader] = useState(false);
  const [userData, setUserData] = useState([]); 
  const [error, setError] = useState(null);    

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const inputValue = e.target.elements.username.value.trim();
    if (inputValue) {
      fetchUser(inputValue);
    }
  };

  const handleClick = async (contact) => {
    try {
      const response = await axios.post(`${host}/api/addChat`, {
        userId: contact._id,
      }, {
        withCredentials: true,
      });
  
      if (response.status === 200) {
        toast('🦄 Chat added successfully!', {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
          className: "Toastify__toast--custom-blue",       
          progressClassName: "Toastify__progress-bar--custom-black", 
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast('🦄 Chat already exists!', {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "coloured",
          transition: Bounce,
          className: "Toastify__toast--custom-blue",       
          progressClassName: "Toastify__progress-bar--custom-black", 
        });
      } else {
        toast('⚠️ An error occurred. Please try again later.', {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "coloured",
          transition: Bounce,
          className: "Toastify__toast--custom-blue",       
          progressClassName: "Toastify__progress-bar--custom-black", 
        });
      }
    }
  };
  

  return (
    <div className="modal">
         <ToastContainer  style={{ zIndex: 1000000 }}/>
      <div className="modal-content">
        <FaRegWindowClose type="button" size={"35px"} onClick={closeModal} style={{ cursor: 'pointer', borderRadius: "5px" }} />
        <form onSubmit={handleSubmit}>
          <div className="message-input">
            <input type="text" name="username" placeholder="Enter name" />
            <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <TbUserSearch size={"35px"} style={{ marginBottom: "10px", marginLeft: "2px" }} />
            </button>
          </div>
        </form>
        <div className='onlineUser'>
          {load ? (
            <div className="loader">
              <HashLoader color="#000000" size={40} />
            </div>
          ) : (
            error ? (
              <p className="error">{error}</p>
            ) : ( 
              userData.map((contact) => (
                <div onClick={() => handleClick(contact)} key={contact._id} style={{ marginRight: '10px' }}>
                  <UserCard
                    username={contact?.username}
                    avatar={contact?.avatar}
                    message={contact?.bio}
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

export default SearchUser;