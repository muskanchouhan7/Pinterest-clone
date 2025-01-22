const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true, // Removes extra spaces
    },
    description: {
        type: String,

    },
    image:{
        type:String,
    }, 
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    // createdAt: {
    //     type: Date,
    //     default: Date.now, // Automatically sets the current date and time
    // },
    // likes: {
    //     type: Array,
    //     default: [], // Default value for likes is 0
    //     // min: 0, // Ensure likes cannot be negative
    // },
});
// }, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Export the Post model
module.exports = mongoose.model('Post', postSchema);
