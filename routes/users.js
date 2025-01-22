const plm = require("passport-local-mongoose")
const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/pinterestclone");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        // trim: true,
    },
    password: {
        type: String,
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId, // Assuming posts will reference another collection
            ref: 'Post', // Name of the related collection
        },
    ],
    dp: {
        type: String, // URL of the profile picture
        // default: 'https://example.com/default-dp.png', // Provide a default DP if needed
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // match: [/^\S+@\S+\.\S+$/, 'Invalid email address'], // Regex for email validation
    },
    fullname: {
        type: String,
        required: true,
        // trim: true,
    },
  });
// } , { timestamps: true }); // Automatically adds createdAt and updatedAt fields

userSchema.plugin(plm); //This applies the Passport Local Mongoose plugin to the userSchema.  Passport Local Mongoose automatically handles: User creation and validation, Password hashing (e.g., bcrypt), Session management for login and logout.


// Export the User model
module.exports = mongoose.model('User', userSchema); //'User' is the name of the model.

