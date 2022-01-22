import mongoose from 'mongoose'

const verificationSchema = new mongoose.Schema(
    {
        otp: {
            type: String,
            required: true,
        },
    }
);

const Verification = mongoose.model('Verification', verificationSchema);
export default Verification;