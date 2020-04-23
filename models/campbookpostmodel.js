const express         = require("express"),
      mongoose        = require("mongoose");



const campbookSchema = new mongoose.Schema({
    title: String,
    siteName:String,
    geoAddress: String,
    rating: Number,
    campnote: String,
    avgRating: Number,
    images:[{
        publicIds:String,
        imageUrl:String,
    }],
    comment: [{
        type:mongoose.Schema.Types.ObjectId,
        ref: "comment",
    }],
    postOwnerId:String,
    postOwnerName: String,
},{
    timestamps:{currentTime: () => new Date()}
}) 

module.exports = mongoose.model("campbookpost", campbookSchema);