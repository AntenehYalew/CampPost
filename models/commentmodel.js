
const express       = require("express"),
mongoose            = require("mongoose");

const commentSchema = new mongoose.Schema({
    commentAuthor:String,
    commentAuthorId:String,
    commentDetails:String,
    postRating:Number,
},{
    timestamps:{currentTime: () => new Date()}
})

module.exports = mongoose.model("comment", commentSchema)