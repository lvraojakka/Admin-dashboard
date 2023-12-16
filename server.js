const express = require('express');
const mongoose = require("mongoose")
const app = express(); 
app.use(express.json());
const PORT = 3000;
const routes = require('./router');
const conn_str = 'mongodb+srv://lvraojakka:loka.1011@lokeshdb.wufungp.mongodb.net/dashboard?retryWrites=true&w=majority';


app.use('/api', routes)









mongoose.connect(conn_str, console.log("mongodb is connected")); 

app.listen(PORT, (error) =>{ 
    if(!error) 
        console.log("Server is Successfully Running, and App is listening on port "+ PORT) 
    else 
        console.log("Error occurred, server can't start", error); 
    } 
); 