const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const coupounCodeSchema  = new Schema({
    name:{
        type: String,
        required:[true,"Vui lòng nhập mã giảm giá nè!"],
        unique: true,
    },
    value:{
        type: Number,
        required: true,
    },
    minAmount:{
        type: Number,
    },
    maxAmount:{
        type: Number,
    },
    shopId:{
     type: String,
     required: true,
    },
    selectedProduct:{
     type: String,
    },
    createdAt:{
        type: Date,
        default: Date.now(),
    }
});

module.exports = mongoose.model("CoupounCode", coupounCodeSchema);