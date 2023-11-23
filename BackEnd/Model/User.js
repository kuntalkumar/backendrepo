

const mongoose = require("mongoose");
const CustmerShcema = mongoose.Schema({
    name : {
        type : String,
        required : true 
    },
    email : {
        type : String,
        required : true 
    },
    password : {
        type : String,
        required : true 
    }
    ,
    gender : {
        type : String,
        required : true 
    },
    country : {
        type : String,
        required : true 
    }
})

const CustmerModels = mongoose.model("customer", CustmerShcema);
module.exports = {
    CustmerModels
}


// name, email, password, gender, country.