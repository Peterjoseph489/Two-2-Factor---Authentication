require('dotenv').config();
const mongoose = require('mongoose')
const password = process.env.DB_PASSWORD;
const username = process.env.DB_USERNAME;

const url = `mongodb+srv://${username}:${password}@cluster0.slt4wi9.mongodb.net/`

mongoose.connect(url).then(()=>{
    console.log('Database connected successfully')
}).catch(()=>{
    console.log('Database Disconnected.!!!')
});

