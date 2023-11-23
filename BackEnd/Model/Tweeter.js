

const mongoose = require("mongoose");
const TwitterSchema = mongoose.Schema({
    title : {
        type : String,
        required : true 
    },
    body : {
        type : String,
        required : true 
    },
    category : {
        type : String,
        required : true 
    }

})

const TwiterModel = mongoose.model("twiter", TwitterSchema);
module.exports = {
    TwiterModel
}


