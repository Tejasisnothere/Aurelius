import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: {},
    password: {},
});

export default mongoose.model("Admin", adminSchema)