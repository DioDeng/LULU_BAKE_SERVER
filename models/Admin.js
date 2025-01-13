const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    password: {
        type: String,
        require: [true, '請輸入 Password'],
        select: false
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        require: [true, '請輸入 Email']
    },
    phone: {
        type: String,
        unique: true,
        require: [true, '請輸入 Phone']
    },
    createTime: {
        type: Date,
        default: Date.now,
        select: false
    }
}, { versionKey: false})

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;