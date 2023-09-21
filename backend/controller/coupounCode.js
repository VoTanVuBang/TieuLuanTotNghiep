const express = require("express")
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const Shop = require("../model/shop");
const CoupounCode = require("../model/coupounCode");
const {
    isSeller
} = require("../middleware/auth");
//thêm ma giam gia
router.post("/create-coupoun-code", isSeller, catchAsyncErrors(async (req, res, next) => {
    try {
        const isCoupounCodeExists = await CoupounCode.find({
            name: req.body.name
        })
        if (isCoupounCodeExists.length !== 0) {
            return next(new ErrorHandler("Mã khuyến mãi đã tồn tại", 400))
        }
        const coupounCode = await CoupounCode.create(req.body);
        res.status(201).json({
            success: true,
            coupounCode,
        })
    } catch (error) {
        return next(new ErrorHandler(error, 400))
    }
}))
//Lấy tất cả mã giảm giá
router.get(
    "/get-coupon/:id",
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
      try {
        const couponCodes = await CoupounCode.find({ shopId: req.seller.id });
        res.status(201).json({
          success: true,
          couponCodes,
        });
      } catch (error) {
        return next(new ErrorHandler(error, 400));
      }
    })
  );
//Xóa mã khuyến mãi
router.delete(
    "/delete-coupon/:id",
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
      try {
        const couponCode = await CoupounCode.findByIdAndDelete(req.params.id);
  
        if (!couponCode) {
          return next(new ErrorHandler("Coupon code dosen't exists!", 400));
        }
        res.status(201).json({
          success: true,
          message: "Mã khuyến mãi được xóa thành công!",
        });
      } catch (error) {
        return next(new ErrorHandler(error, 400));
      }
    })
  );

// Lấy mã khuyến mãi bằng tên
router.get("/get-coupon-value/:name",catchAsyncErrors(async(req,res,next)=>{
  try {
      const couponCode = await CoupounCode.findOne({name:req.params.name});
      
      res.status(200).json({
        success:true,
        couponCode,
      })
    
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
}))
module.exports = router