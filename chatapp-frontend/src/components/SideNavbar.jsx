import React, { useContext, useState, useEffect } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './sideNavbar.css';
import MyContext from "./context/MyContext";
import { HashLoader } from 'react-spinners';
import Cookies from "js-cookie";
import { host } from "../utils/host";
export default function SideNavbar() {
  const [showModal,setModal] = useState(false)
  const [load, setLoader] = useState(false);
  const [userAvatar, setUserAvatar] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(MyContext);

  useEffect(() => {
    setUserAvatar(user?.avatar);
  }, [user]);

  const handleLogout = async () => {
    setLoader(true); 
    try {
      const response = await axios.post(`${host}/api/logout`, {}, { withCredentials: true });
      if (response.status === 200) {
        Cookies.remove('token');
        Cookies.remove('userDetails');
        localStorage.removeItem('token');
        localStorage.removeItem('userDetails');
        navigate('/');
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="container">
      <div onClick={handleLogout} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
        <BiLogOut size={'40px'} />
      </div>
      {/* {showModal && <Modal closeModal={() => setModal(false)} />} */}
      <div className="avatar">
        <IoSettingsOutline size={'30px'} />
        {load ? (
          <div className="loader"><HashLoader color="#000000" size={40} /></div>
        ) : (
          <img src={userAvatar} alt="avatar" />
        )}
      </div>
    </div>
  );
}
