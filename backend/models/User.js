const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

UserSchema.pre("save", function (next) {
    if (!this.isModified("password")) {
        next;
    }
    this.password = bcrypt.hashSync(this.password, process.env.BCRYPT_SALT_ROUNDS);
    next;
});

UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model("user", UserSchema);
module.exports = User;
