const mongoose = require('mongoose');

const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
)

mongoose.connect(DB)
.then(()=> {
    console.log("連接資料庫")
}).catch((err) => {
    console.log(err);
  });
