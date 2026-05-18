import mongoose from 'mongoose';
const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    token: { type: String } // Store token here
});

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
