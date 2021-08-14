const mongoose = required('mongoose')
const AdminSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    role: {
        default: 'admin' 
    },
    password:{
        type:String,
        required:true
    },
    created_at:{type:date,default:Date.now()},
})

module.exports = mongoose.model("Admin",AdminSchema)
