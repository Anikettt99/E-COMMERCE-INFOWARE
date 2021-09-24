const express = require("express");
const app = express();
const bodyParser= require("body-parser");
const cors = require('cors');
const mongoose = require('mongoose');
const authJwt = require('./helpers/jwt');
const error_handeler = require('./helpers/error-handler');
require('dotenv/config');

const ownerRouter = require("./routes/owner");
const productRouter = require("./routes/product");
const userRouter = require("./routes/user");
const orderRouter = require("./routes/order");

app.use(cors());
app.options('*' , cors());


app.use(bodyParser.json());
app.use(authJwt());
app.use(error_handeler);

app.use('/owner' , ownerRouter);
app.use('/product' , productRouter);
app.use('/user' , userRouter);
app.use('/order' , orderRouter);


mongoose.connect(
    process.env.MONGO_URI,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    }
).then(() =>{
    console.log("Database Connection ready");
    app.listen(3000 , ()=>{
        console.log("App Listening on port 3000")
    });
})
.catch((err)=>{
    console.log(err);
})



