require('./dbconfig/userDb');
require('dotenv').config();
const cors = require('cors');
const fileUpload = require('express-fileupload')
const express = require('express');
const morgan = require("morgan");
const router = require("./routes/userRoute");
const PORT = process.env.PORT

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"], // Add the allowed methods here
}))
// Handle preflight requests
app.options("*", (req, res) => {
    res.status(200).send();
});
app.use(fileUpload({ 
    useTempFiles: true
}))
app.use(morgan("dev"));
app.use("/api", router);
// app.use("/api", wallet);


app.get('/', (req, res)=>{
res.send('Welcome to my Platform, Expect to see more...!!!')
})


app.listen(PORT, ()=>{
    console.log('Server is connected on Port: ' + PORT)
})


