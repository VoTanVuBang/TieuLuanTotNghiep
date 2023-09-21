const Conversation = require("../model/conversation");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const express = require("express");
const { isSeller } = require("../middleware/auth");
const router = express.Router();


//1.Tạo 1 cuộc trò chuyện
router.post("/create-new-conversation",catchAsyncErrors(async(req,res,next)=>{
    try {
        const {groupTitle,useId,sellerId} = req.body;
        const isConversationExist = await Conversation.findOne({groupTitle});
        if(isConversationExist){
            const conversation = isConversationExist
           res.status(201).json({
            success:true,
            conversation,
           })
        }else{
            const conversation = await Conversation.create({
                members: [useId,sellerId],
                groupTitle: groupTitle,
            });
    
            res.status(201).json({
                success: true,
                conversation,
            })
        }
    } catch (error) {
        return next(new ErrorHandler(error.response.message, 500));
    }
}));

//Tiếp theo: Lấy tin nhắn của seller
router.get("/get-all-conversation-seller/:id",isSeller, catchAsyncErrors(async(req,res,next)=>{
    try {

        const conversations = await Conversation.find({members:{
            $in: [req.params.id],
        }}).sort({ updatedAt: -1, createdAt: -1 });

        res.status(201).json({
            success:true,
            conversations
        })
        
    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
}))

module.exports = router