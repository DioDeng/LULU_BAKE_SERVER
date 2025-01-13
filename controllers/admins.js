const bcrypt = require("bcryptjs");
const validator = require("validator");
const resSuccess = require("../service/resSuccess");
const appError = require("../service/appError");
const { generateSendJWT } = require("../middleware/auth");
const Admin = require("../models/Admin");

const admins = {
  // 註冊
  async signUp(req, res, next) {
    const { email, password, phone } = req.body;

    // 欄位未填寫正確
    if ( !email || !password || !phone) {
      return next(appError(400, "欄位未填寫正確！", next));
    }

    // 確認密碼
    // if (password !== confirmPassword) {
    //   return next(appError(400, "密碼不一致！", next));
    // }

    // 密碼需為 6 個字元以上
    if (!validator.isLength(password, { min: 6 })) {
      return next(appError(400, "密碼需為 8 個字元以上！", next));
    }

    // 確定 Email 正確性
    if (!validator.isEmail(email)) {
      return next(appError(400, "Email 格式不正確！", next));
    }
    
    // 驗證 Email 是否已被使用
    const checkEmailUnique = await Admin.findOne({ email });
    // 不開放註冊
    if (checkEmailUnique || !checkEmailUnique) {
      return next(appError(400, "此 Email 已被使用！", next));
    }

    // 驗證手機格式
    const phoneNumber = /^(09)[0-9]{8}$/;
    if(!phoneNumber.test(phone)) {
      return next(appError(400, "手機 格式不正確！", next));
    }

    // 驗證 phone 是否已被使用
    const checkPhoneUnique = await Admin.findOne({ phone });
    if(checkPhoneUnique) {
      return next(appError(400, "此 手機號碼 已被使用！", next));
    }

    // 將密碼加密
    const newPassword = await bcrypt.hash(password, 12);
    
    const newUser = await Admin.create({
      email,
      phone,
      password: newPassword,
    });
    generateSendJWT(res, 201, newUser);
  },
  // 登入
  async signIn(req, res, next) {
    const { email, password } = req.body;

    // 欄位未填寫正確
    if (!email || !password) {
      return next(appError(400, "欄位未填寫正確！", next));
    }

    // 取出 user 資料庫的指定資料
    const user = await Admin.findOne({ email }).select("+password");

    // 看此 Email 是否存在
    if (!user) {
      return next(appError(400, "此 user 不存在", next));
    }

    // 比對密碼是否相符
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return next(appError(400, "密碼錯誤！", next));
    }

    generateSendJWT(res, 200, user);
  },
  // 重設密碼
  async updatePassword(req, res, next) {
    const { password, confirmPassword } = req.body;

    // 欄位未填寫正確
    if (!password || !confirmPassword) {
        return next(appError(400, "欄位未填寫正確！", next));
      }
  
    // 密碼與確認密碼不符合
    if (password !== confirmPassword) {
        return next(appError(400, "密碼不一致！", next));
      }
    // 將密碼加密
    const newPassword = await bcrypt.hash(password, 12);

    // 更新資料庫中密碼
    const newUser = await Admin.findByIdAndUpdate(req.user._id, {
        password: newPassword,
      });
  
      generateSendJWT(res, 200, newUser);
  },
};

module.exports = admins;