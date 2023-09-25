const Withdraw = require("../model/withdraw");
const Shop = require("../model/shop");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const express = require("express");
const { isSeller, isAuthenticated,isAdmin} = require("../middleware/auth");
const router = express.Router();
const sendMail = require("../utils/sendMail");

//Tạo yêu cầu rút tiền
router.post("/create-withdraw-request",isSeller,catchAsyncErrors(async(req,res,next)=>{
    try {
        const {amount}  =req.body;
        const data = {
            seller: req.seller,
            amount,
        }
        try {
            await sendMail({
              email: req.seller.email,
              subject: "Yêu cầu rút tiền",
              message: `Xin chào ${req.seller.name}, Yêu cầu rút ${amount}$ đang xử lý. Bạn sẽ nhận được phản hồi sau 3 tới 7 ngày tới...! `,
            });
            res.status(201).json({
              success: true,
            });
          } catch (error) {
            return next(new ErrorHandler(error.message, 500));
          }
        const withdraw = await Withdraw.create(data);

        const shop = await Shop.findById(req.seller._id);

        shop.availableBalance = shop.availableBalance - amount;
        
        await shop.save();

        res.status(201).json({
            success:true,
            withdraw
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}))

// Lấy tất cả yêu cầu rút tiền của shop - admin
router.get("/get-all-withdraw-request",isAuthenticated,isAdmin("Admin"),catchAsyncErrors(async(req,res,next)=>{
  try {
    const withdraws = await Withdraw.find().sort({ createdAt: -1 });
    res.status(201).json({
      success: true,
      withdraws,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
    
  }
}))

// Cập nhật trạng thái rút tiền - admin
router.put("/update-withdraw-request/:id",isAuthenticated,isAdmin("Admin"),catchAsyncErrors(async(req,res,next)=>{
  try {
    const {sellerId} = req.body;

    const withdraw = await Withdraw.findByIdAndUpdate(req.params.id,{
      status:"Chấp nhận",
      updatedAt: Date.now(),
    },
      { new: true }
    );

    const seller  = await Shop.findById(sellerId);
    const transection = {
      _id: withdraw._id,
      amount: withdraw.amount,
      updatedAt: withdraw.updatedAt,
      status: withdraw.status,
    };
    seller.transections = [...seller.transections, transection];
    await seller.save();

    try {
      await sendMail({
        email: seller.email,
        subject: "Xác nhận thanh toán",
        message: `Xin chào ${seller.name}, Yêu cầu thanh toán tài khoản ${withdraw.amount}$ đã được duyệt. Tiền sẽ được chuyển tới tài khoản ngân hàng của bạn từ 3 đến 7 ngày. Vui lòng kiểm tra lại tài khoản sau khi nhận được tiền!.`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
    res.status(201).json({
      success: true,
      withdraw,
    });
    
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}))
module.exports = router;