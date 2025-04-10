const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = 'mongodb+srv://juanestd:123456as@clonx.errke.mongodb.net/?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true';
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully to ClonX cluster");
  } catch (error) {
    console.error("MongoDB connection failed", error);
  }
};

module.exports = connectDB;
