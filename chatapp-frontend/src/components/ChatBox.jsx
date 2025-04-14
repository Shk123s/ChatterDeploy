import React, { useState } from 'react';
import { ChatHeader } from './ChatHeader';
import ChatInput from './ChatInput';
import { Messages } from './Messages';
import { HashLoader } from 'react-spinners';
import PlanAddMessage from './PlanAddMessage';

const Chatbox = ({ userView }) => {
    const [load, setLoader] = useState(false);
    const [messageAll, setMessageAll] = useState([]);
    // console.log(userView.hasOwnProperty()) 
    //   console.log(Object.keys(userView).length === 0 ,"chatttttt")
    return (
        <div className="chat-box">
            {load ? (
                <div className="loader">
                    <HashLoader color="#0094ff" size={40} />
                </div>
            ) : (
                Object?.keys(userView)?.length === 0 ? (
                    <>
                       <PlanAddMessage />
                     
                    </>
                ) : (
                    <>   
                     <ChatHeader currentUser={userView} />
                      <Messages messageAll={messageAll} />
                      <ChatInput messageAll={messageAll} setMessageAll={setMessageAll} userView={userView} /> </>
                   
                )
            )}
        </div>
    );
};

export default Chatbox;
