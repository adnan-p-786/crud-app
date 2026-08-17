import mongoose, { Schema, models } from "mongoose";

const departmentSchema = new Schema({
    department_name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        unique: true,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
)

const User = models.User || mongoose.model("Department", departmentSchema);

export default User;