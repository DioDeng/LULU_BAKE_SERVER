const validator = require("validator");
const resSuccess = require("../service/resSuccess");
const appError = require("../service/appError");
const Product = require("../models/Product");
const Option = require("../models/Option");

const products= {
    // 取得所有商品
    async getProducts(req, res, next) {
        // 排序
        const sort = req.query.sort == "asc" ? "-createTime" : "createTime";
        // 關鍵字搜尋
        const keyword =
        req.query.keyword !== 'undefined'
            ? { category: new RegExp(req.query.keyword) }
            : {};
        if(!req.user) {
            keyword['is_enable'] = true;
        };
        const products = await Product.find(keyword).populate({
            path: "options",
            select: "size price stock",
          }).sort(sort);

        resSuccess(res, 200, products);
    },
    // 取得單一產品
    async getProduct(req, res, next) {
        const { productId } = req.params;

        // 驗證商品是否存在
        const product = await Product.findById(productId).populate({
            path: "options",
            select: "size price stock",
          }).exec();
        if(!product) {
            return next(appError(400, "取得失敗，查無此商品 ID", next));
        }

        resSuccess(res, 200, product);
    },
    // 新增商品
    async createProduct(req, res, next) {
        const { title, category, comment, options, image, images, is_enable  } = req.body;

        if(!title || !category  || !comment || !options || !image ) {
            return next(appError(400, "欄位未填寫正確！", next));
        }

        // 先建立商品
        const newProduct = await Product.create(
            {
                title,
                category,
                comment,
                image,
                images,
                is_enable
            }
        );

        // 讓每個選項填入商品ＩＤ
        options.forEach((item)=> {
            item.productId = newProduct._id;
        })

        // 建立選項
        const newOption = await Option.insertMany(
            options
          );

        resSuccess(res, 200, newProduct);
    },
    // 修改產品
    async updateProduct(req, res, next) {
        const { productId } = req.params;
        const { title, category, comments, options, image, images, is_enable } = req.body;

        if(!title && !category && !comments  && !options && !image && !images) {
            return next(appError(400, "欄位未填寫正確", next));
        }

        const isExist = await Product.findById(productId).exec();

        if(!isExist) {
            return next(appError(400, "修改失敗，查無此商品 ID", next));
        }

        const optionList = await Option.find({productId: productId}).exec();

        let idList = [];
        options.forEach(e=> {
            if(e._id) {
                idList.push(e._id.toString())
            }
        })
        
        // 移除選項
        optionList.forEach(async item=> {
            if(idList.indexOf(item._id.toString()) === -1) {
                await Option.findByIdAndDelete(item._id)
            }
        });

        // 修改選項
        optionList.forEach(item=> {
            options.forEach(async e=> {
                if(e._id) {
                    if(item._id.toString() === e._id.toString()) {
                        await Option.findByIdAndUpdate(item._id, {size: e.size, price: e.price, stock: e.stock})
                    }
                }
            })
        });

        // 新增選項
        options.forEach(async item=> {
            if(!item._id) {
                item.productId = productId;
                await Option.create(item);
            }
        });


        const updateProduct = await Product.findByIdAndUpdate(
            productId,
            {
                title,
                category,
                comments,
                image,
                images,
                is_enable
            },
            {
                new: true,
                runValidators: true,
            }
            );

            resSuccess(res, 200, updateProduct);
    },
    // 刪除產品
    async deleteProduct(req, res, next) {
        const { productId } = req.params;

        // 驗證商品是否存在
        const isExist = await Product.findById(productId).exec();
        if(!isExist) {
            return next(appError(400, "刪除失敗，查無此商品 ID", next));
        }
        // 刪除 option model
        const delOption = await Option.deleteMany({productId});

        const delProduct = await Product.findByIdAndDelete(productId, {
            new: true,
          });

        resSuccess(res, 200, delProduct);
    }
}

module.exports = products;