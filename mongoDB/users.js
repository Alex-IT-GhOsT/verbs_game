import mongoose, { Schema } from "mongoose";

const UserSchema = new mongoose.Schema({
    name: String,
    password: String,
    email: String
})

const UserForm = mongoose.model('users', UserSchema);

export default UserForm;