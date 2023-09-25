const express = require("express")
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const Shop = require("../model/shop");
const Event = require("../model/event");
const {upload} = require("../multer")
const { isSeller, isAdmin, isAuthenticated } = require("../middleware/auth");
const fs = require("fs")


//thêm sự kiện
router.post("/create-event",upload.array("images"),catchAsyncErrors(async(req,res,next)=>{
    try{
        const shopId = req.body.shopId;
        const shop = await Shop.findById(shopId);
        if(!shop){
            return next(new ErrorHandler("Không tồn tai shop",400));
        }else{
            const files = req.files;
            const imageUrls = files.map((file)=>`${file.filename}`);
            const eventData = req.body;
            eventData.images = imageUrls;
            eventData.shop = shop;
            const product = await Event.create(eventData);
            res.status(201).json({
                success:true,
                product,
            });

        }
    }catch(error){
        return next(new ErrorHandler(error,400))
    }
}))
// Lấy tất cả sự kiện của shop
router.get("/get-all-events/:id",catchAsyncErrors(async(req,res,next)=>{
    try{
        const events = await Event.find({shopId:req.params.id});
        res.status(201).json({
            success:true,
            events,
        })
    }catch(error){
        return next(new ErrorHandler(error,400))
    }
}))
//Delete events của shop
router.delete("/delete-shop-event/:id",catchAsyncErrors(async(req,res,next)=>{
    try{
        const productId = req.params.id;
        
        const eventData = await Event.findById(productId);
        eventData.images.forEach((imageURL)=>{
            const filename = imageURL;
            const filePath=`uploads/${filename}`;
            fs.unlink(filePath,(err)=>{
                if(err){
                    console.log(err);
                }
            });
        });

        const event = await Event.findByIdAndDelete(productId);
        if(!event){
            return next(new ErrorHandler("Sự kiện không tìm thấy với id!",500));
        }
        res.status(201).json({
            success:true,
            message:"Xóa sự kiện thành công",
        })

    }catch(error){
        return next(new ErrorHandler(error,400))
    }
}))

// Lấy tất cả sự kiện
router.get("/get-all-events",catchAsyncErrors(async(req,res,next)=>{
    try{
        const events = await Event.find();
        res.status(201).json({
            success:true,
            events
        })
    }catch(error){
        return next(new ErrorHandler(error,400))
    }
}))

// Tất cả sự kiện ---  admin
router.get(
    "/admin-all-events",
    isAuthenticated,
    isAdmin("Admin"),
    catchAsyncErrors(async (req, res, next) => {
      try {
        const events = await Event.find().sort({
          createdAt: -1,
        });
        res.status(201).json({
          success: true,
          events,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    })
  );
  
module.exports = router;