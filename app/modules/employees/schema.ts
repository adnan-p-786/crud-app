import mongoose, { Schema, models } from "mongoose";

const employeeSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique:true,
        required: true,
    },
    phone_number: {
        type: Number,
        required: true,
    },
    job_title: {
        type: String,
        required: true,
    },
    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true,
    },
    status: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
})

const Employees = models.Employees || mongoose.model("Employees", employeeSchema);

export default Employees;