
const chatModel = require("../model/chat.model");
const ObjectId = require("mongoose").Types.ObjectId;
exports.accessChat = async (req, res) => {
  try {
    const { name, groupChat, creator, members,userId } = req.body;
   
    var chatData = { name : "sender",
      creator :req.user._id,
      members : [userId] } 

      var  findPipeline = [
        {
          $addFields: {
            member: { $arrayElemAt: ["$members", 0] }
          }
        },
        {
          $addFields: {
            member: { $toObjectId: "$member" }
          }
        },
        {
          $match: {
            groupChat: false,
            creator: req.user._id,
            member: new ObjectId(userId)
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "creator",
            foreignField: "_id",
            as: "result"
          }
        },
        {
          $addFields: {
            user: { $arrayElemAt: ["$result", 0] }
          }
        },
          {
          $lookup: {
            from: "users",
            localField: "member",
            foreignField: "_id",
            as: "oppUser"
          }
        },
        {
          $addFields: {
            oppUser: { $arrayElemAt: ["$oppUser", 0] }
          }
        },
        {
          $addFields: {
           _id:"$_id",
            name:"$name",
            groupChat:"$groupChat",
            user:"$user",
            member:"$oppUser"
          }
        },
        {
          $project: {
            _id:1,
            name:1,
            groupChat:1,
            creator:"$user",
            member:1
          }
        }
      ];

      const fetchChat = await chatModel.aggregate(findPipeline); 

     if(fetchChat.length > 0){
      return res.status(404).send({message:"Chat already exists",data:fetchChat});
    } 
    else {
      const createChat = await chatModel.create({
        ...chatData
      });
      const findCreatedChat = await chatModel.aggregate(findPipeline);
      return res.status(200).send({message:"Chat added.",data:findCreatedChat});
    
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

exports.createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;

    if (members.length < 2) {
      res.send({ message: "please add more member." });
    }
    
    const createGroup = await chatModel.create({ 
      name:name,
      groupChat:true,
      creator:req.user._id,
      members:members
     });

     const groupPipeline = [
      {
        $match: {
          _id: createGroup._id
        }
      },
      {
        $addFields: {
          members: {
            $map: {
              input: "$members",
              as: "member",
              in: { $toObjectId: "$$member" }
            }
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "creator",
          foreignField: "_id",
          as: "creatorDetails"
        }
      },
      {
        $addFields: {
          creator: {
            $arrayElemAt: ["$creatorDetails", 0]
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "members",
          foreignField: "_id",
          as: "membersDetails"
        }
      },
      
      {
        $project: {
         
          _id: 1,
          name: 1,
          groupChat: 1,
          creator: 1,
          members: "$membersDetails",
          createdAt: 1,
          updatedAt: 1
        }
      }
    ]
   
    const createGroupDetails = await chatModel.aggregate(groupPipeline);

    if (!createGroupDetails)
      return res
        .status(400)
        .send({ message: "Error occured while adding group " });

    res.status(200).send({ message: "Group created. ",data:createGroupDetails });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};
exports.getAllConversation = async(req,res) =>  
{  
  const defaultGroupAvatar = "https://cdn.iconscout.com/icon/free/png-512/free-group-icon-download-in-svg-png-gif-file-formats--team-communication-compney-employee-font-awesome-pack-user-interface-icons-46244.png?f=webp&w=256"
  try {
    const userId = req.user._id.toString();
    
    const findConversation = await chatModel.aggregate(
      [
        {
            $match: {
                $or: [
                    { members: { $in: [userId] } },
                    { creator: req.user._id }
                ],
                isDeleted: false,
                isActive: true
            }
        },
        {
            $addFields: {
                firstMember: { $arrayElemAt: ["$members", 0] }
            }
        },
        {
            $addFields: {
                firstMemberId: { $toObjectId: "$firstMember" }
            }
        },
        {
            $lookup: {
                from: "users",
                let: { memberId: "$creator" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$_id", "$$memberId"] }
                        }
                    },
                    {
                        $project: {
                            username: 1,
                            avatar: 1,
                            bio: 1,
                            createdAt: 1
                        }
                    }
                ],
                as: "messageUser"
            }
        },
        {
            $addFields: {
                messageUser: { $arrayElemAt: ["$messageUser", 0] }
            }
        },
        {
            $addFields: {
                messageUser: {
                    $cond: {
                        if: { $eq: ["$groupChat", true] },
                        then: "$$REMOVE",
                        else: "$messageUser"
                    }
                },
                groupAvatar: {
                    $cond: {
                        if: { $eq: ["$groupChat", true] },
                        then: defaultGroupAvatar,
                        else: "$$REMOVE"
                    }
                }
            }
        },
        {
            $lookup: {
                from: "users",
                let: { memberIds: "$members" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $in: ["$_id", {
                                    $map: { input: "$$memberIds", as: "memberId", in: { $toObjectId: "$$memberId" } }
                                }]
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            username: 1,
                            bio: 1,
                            avatar: 1
                        }
                    }
                ],
                as: "memberDetails"
            }
        },
        {
            $addFields: {
                currentUserId: userId
            }
        },
        {
            $addFields: {
                otherUser: {
                    $cond: {
                        if: { $eq: ["$groupChat", false] },
                        then: {
                            $arrayElemAt: [
                                {
                                    $filter: {
                                        input: "$memberDetails",
                                        as: "member",
                                        cond: { $ne: ["$$member._id", { $toObjectId: "$currentUserId" }] }
                                    }
                                },
                                0
                            ]
                        },
                        else: "$$REMOVE"
                    }
                },
                messagesForUser: {
                    $cond: {
                        if: { $eq: ["$currentUserId", "$creator"] },
                        then: "sent",
                        else: "received"
                    }
                }
            }
        },
        {
            $project: {
                groupChat: 1,
                name: 1,
                members: 1,
                memberDetails: 1,
                messageUser: 1,
                groupAvatar: 1,
                otherUser: 1,  
                messagesForUser: 1
            }
        }
    ]
    
      
    );
    
   
    res.status(200).send({ message: findConversation });
    
  } catch (error) {
    console.log(error);
    res.status(500).send({message:"Internal server error."});
  }
}

// exports.createChat = async (req, res) => {
//   try {
//     const { name, creator, members } = req.body;

//     req.body.groupChat = false;

//     if (members.length > 1) {
//       res.send({ message: "chat requires only one member ." });
//     }

//     const createChat = await chatModel.create({ ...req.body });

//     if (!createChat)
//       return res
//         .status(400)
//         .send({ message: "Error occured while adding message " });

//     res.status(200).send({ message: "chat created. " });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ message: "Internal server error" });
//   }
// };

exports.getPersonChats = async (req, res) => {
  try {
    const getPersonChats = [
      {
        $addFields: {
          member: { $arrayElemAt: ["$members", 0] }
        }
      },
      {
        $addFields: {
          member: { $toObjectId: "$member" }
        }
      },
      {
        $match: {
          groupChat: false,
          $or: [
            { creator: req.user._id },  
            { member: req.user._id }  
          ]
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "creator",
          foreignField: "_id",
          as: "result"
        }
      },
      {
        $addFields: {
          user: { $arrayElemAt: ["$result", 0] }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "member",
          foreignField: "_id",
          as: "oppUser"
        }
      },
      {
        $addFields: {
          oppUser: { $arrayElemAt: ["$oppUser", 0] }
        }
      },
      {
        $addFields: {
          _id: "$_id",
          name: "$name",
          groupChat: "$groupChat",
          user: "$user",
          member: "$oppUser"
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          groupChat: 1,
          creator: "$user",
          member: 1
        }
      }
    ];

    const getChats = await chatModel.aggregate(getPersonChats);
    res.status(200).send({ data: getChats });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal in getPersonChats server error" });
  }
};

exports.getSingleChat = async (req, res) =>{
  try {
    const id = req.params.id;
    
    const getSingleChatWithMembers = await chatModel.aggregate([
      { $match: { _id: new ObjectId(id) } },
      {
        $addFields: {
          members: {
            $map: {
              input: "$members",
              as: "memberId",
              in: { $toObjectId: "$$memberId" }
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',           
          localField: 'members',   
          foreignField: '_id',     
          as: 'memberDetails'    
        }
      }
    ]);
  
    res.status(200).send({ data: getSingleChatWithMembers });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'An error occurred while fetching chat details.' });
  }
  
}
exports.editGroupName = async (req,res) =>{
  try {
    const { id} = req.params;
   const {name } = req.body
    const findId = await chatModel.findByIdAndUpdate( id,                      
    { $set: { name: name } },    
    { new: true }  );
   res.status(200).send({message:"Group name edited.",data:findId});
  } catch (error) {
    console.log(error);
    res.status(500).send({message:"Error occured please try again."})
  }
}

exports.addGroupMembers = async (req,res)=> {
  try { 

    const {id } = req.params;
    const {members } = req.body ;

    const findId = await chatModel.findByIdAndUpdate(
      id,                             
      { $push: { members: members } },  
      { new: true }                   
    );

     res.status(200).send({message:"Member added to the group.",data:findId});
    
  } catch (error) {
    console.log(error);
    res.status(500).send({message:"Internal server Error"});
  }
}
exports.removeGroupMembers = async (req,res)=> {  
  try { 

    const {id } = req.params;
    const {members } = req.body ;
    const findIdAdmin = await chatModel.findOne({_id: id,creator:req.user._id});
    
    if(!findIdAdmin){
      return res.status(400).send({message:"Not an Admin."})
    }

    const findId = await chatModel.findByIdAndUpdate(
      id,                             
      { $pull: { members: members } },  
      { new: true }                   
    );
     return res.status(200).send({message:"Member Removed to the group.",data:findId});
    
  } catch (error) {
    console.log(error);
    res.status(500).send({message:"Internal server Error"});
  }
}

//for dashboards
exports.getAllChats = async (req,res) =>{
  try { 
    const pipeline = [

      {
        $lookup: {
          from: "users",
          let: { id: "$creator" },
          pipeline: [
            {
              $match: {
                $and: [
                  {
                    $expr: {
                      $eq: ["$_id", "$$id"]
                    }
                  },
                  {
                    $expr: {
                      $eq: ["$isActive", true]
                    }
                  }
                ]
              }
            }
          ],
          as: "user"
        }
      },
      {
        $addFields: {
          user: { $arrayElemAt: ["$user", 0] }
        }
      },
      {
        $addFields: {
          userId: "$user._id",
          username: "$user.username"
        }
      },
      {
        $project: {
          user: 0,
          createdAt: 0,
          updatedAt: 0,
          isActive: 0,
          __v: 0
        }
      }
       
    ];
    const getChats = await chatModel.aggregate(pipeline);

    return res.status(200).send({message:"chat fetch",data:getChats});

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal in getAllChats server error" });
  }
}

exports.leaveMember = async(req,res)=>{
  try {
    const { id } = req.params;
    const {memberId} = req.body;
   

    const findAdmin = await chatModel.findById(id);
    
    if(findAdmin.creator.toString() === memberId) {
      return res.status(400).send({message:"Admin cannot left the group."});

    }

    const memberRemove = await chatModel.findByIdAndUpdate(
       id,
      {$pull:{members:memberId}},
      {new:true}
    );
    
    res.status(200).send({message:"Member left the group."});

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal in leave member server error" });
  }
}