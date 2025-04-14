const {addMessage, getSingleMessages} = require("../controller/message.controller");
const {addUser, getUser, getUserById} = require("../controller/user.controller");
const { createGroup, editGroupName, getPersonChats, getAllChats,
    getSingleChat, accessChat, addGroupMembers, removeGroupMembers, getAllConversation, leaveMember} = require("../controller/chat.controller");
const {login,logOut} = require("../controller/user.controller");
const { isAuthenticated } = require("../midleware/auth");
const router = require("express").Router();
//message 
router.post("/addMessage",isAuthenticated,addMessage);
router.get("/getSingleMessages/:id",isAuthenticated,getSingleMessages);
//chat 
router.post("/addchat",isAuthenticated,accessChat);
router.post("/createGroup",isAuthenticated,createGroup);
router.post("/editGroupName/:id",isAuthenticated,editGroupName);
router.post("/removeGroupMembers/:id",isAuthenticated,removeGroupMembers);
router.post("/addGroupMembers/:id",isAuthenticated,addGroupMembers);
router.post("/leavegroup/:id",isAuthenticated,leaveMember);
router.get("/getChat",isAuthenticated,getPersonChats);
router.get("/getSingleChat/:id",isAuthenticated,getSingleChat);
router.get("/getAllChat",isAuthenticated,getAllChats);
router.get("/getConversation",isAuthenticated,getAllConversation);

//user 
router.get("/getUser",isAuthenticated,getUser);
router.get("/getUser/:id",isAuthenticated,getUserById);
router.post("/login",login);
router.post("/adduser",addUser);
router.post("/logout",isAuthenticated,logOut);

module.exports = router;