const express = require("express")
const app = express();
const path = require("path")
const morgan = require('morgan');
const mongoose = require("mongoose");

const PORT = 5000;


app.use(express.json({limit:'3mb'}))
app.use(express.urlencoded({extended:true,limit:'3mb'}))


app.set('views',path.join(__dirname,'views'))
app.set("views engine",'ejs')


mongoose.connect('',{
    useUnifiedTopology:true,
    useFindAndModify:true,
    useCreateIndex:true,
    useNewUrlParser:true
})
.then(()=>console.log("connected"))
.catch((err)=>console.err('not connected'))


const router = require('./routes')

app.get('/',(req,res)=>{
    res.send("hello i am aman dubey")
})



app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`)
})




