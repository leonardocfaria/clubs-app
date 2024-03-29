const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a Name'],
    },
    email: {
        type: String,
        required: [true, 'Please add a email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
    },
    isAdmin: {
        type: Boolean,
        required: [false],
    },
},
{
    timestamps: true
}
)

module.exports = mongoose.model('User', userSchema)