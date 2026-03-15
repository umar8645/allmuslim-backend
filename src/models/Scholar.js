import mongoose from "mongoose"

const ScholarSchema = new mongoose.Schema({

name:String,
bio:String,
country:String,
verified:{
type:Boolean,
default:false
},

youtubeChannel:String

})

export default mongoose.model("Scholar",ScholarSchema)