import Login from "../src/components/auth/Login"
import Signup from "./components/auth/Signup";
import  { MyContextProvider } from "./components/context/MyContext";
import ChatPage from "./pages/ChatPage";
import { ToastContainer } from 'react-toastify';
import { Route, Routes } from "react-router-dom";
import React from 'react';

const App = () => {
    
  return ( 
    <MyContextProvider>
      <ToastContainer/>
    <div className="App" style={{backgroundColor: '#d9eeef'}}> 
    <Routes>
     {/* <Route path="/"/> */}
     <Route path="/" Component={Login}/>
     <Route path="/signup" Component={Signup}/>
     <Route path="/chats" Component={ChatPage}/>
     </Routes>
      {/* <ChatPage /> */}
    </div>
    </MyContextProvider>
  );
};
export default App; 
