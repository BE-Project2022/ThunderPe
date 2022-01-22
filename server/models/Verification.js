import mongoose from 'mongoose'

const verificationSchema = new mongoose.Schema(
    {
        otp: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Verification = mongoose.model('Verification', verificationSchema);
export default Verification;