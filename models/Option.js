const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
    size: {
        type: String,
        required: [true, '請輸入 Size'],
    },
    price: {
        type: Number,
        required: [true, '請輸入 價格'],
    },
    stock: {
        type: Number,
        default: 10
    },
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: "product", // 可以使用refpath 多個model查找
      },
}, { versionKey: false })

const Option = mongoose.model('option', OptionSchema);

module.exports = Option;