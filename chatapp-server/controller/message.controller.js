const messageModel = require("../model/message.model");
const ObjectId = require("mongoose").Types.ObjectId;
exports.addMessage = async (req, res) => {
  try {
    const {  message, messageType, chatId } = req.body;
    req.body.senderId = req.user._id;
    const addmessage = await messageModel.create({ ...req.body });
   
    const messagePipeline = [ {
      $match: {
        _id:addmessage._id
      }
  },
    {
      $lookup: {
        from: "users",
        localField: "senderId",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $lookup: {
        from: "chats",
        localField: "chatId",
        foreignField: "_id",
        as: "chat"
      }
    },
    {
      $addFields: {
        sender: { $arrayElemAt: ["$user", 0] }
      }
    },
    {
      $addFields: {
        chat: { $arrayElemAt: ["$chat", 0] }
      }
    },
    {
      $project: {
        _id:1,
         sender:1,
        chat:1,
         message:1,
        messageType:1
      }
    }
     ]  
    const showMessage = await messageModel.aggregate(messagePipeline);

    if (!addmessage) return res.status(400).send({ message: "Error occured while adding message " });

    res.status(200).send({ message: "Message added. ", data:showMessage});
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};


exports.getSingleMessages = async (req,res) => {
  try {
      const Id = req.params.id;
      const singleMessagePipeline =  [
        {
          $match:{
            chatId:new ObjectId(Id)
          }
        },  {
          $lookup: {
            from: "chats",
            localField: "chatId",
            foreignField: "_id",
            as: "result"
          }
        },
        {
          $addFields: {
            result: {$arrayElemAt:['$result',0]}
          }
        }
      ]
      const showMessage = await messageModel.aggregate(singleMessagePipeline);

      res.status(200).send({ message: "Message get successfully.", data:showMessage});
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
}