import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Employees from "@/app/modules/employees/schema";

export async function GET() {
  try {
    await connectDB();

    const employees = await Employees.find()
  .populate("departmentId", "department_name")
  .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        employees,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get employees error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch departments",
      },
      { status: 500 }
    );
  }
}


export async function POST(
    request: NextRequest
) {
    try {

        await connectDB();

        const body = await request.json();

        const {
            name,
            email,
            phone_number,
            job_title,
            departmentId,
            status,
        } = body;


        if (
            !name ||
            !email ||
            !phone_number ||
            !job_title ||
            !departmentId
        ) {

            return NextResponse.json(
                {
                    success: false,
                    message:
                        "All fields are required",
                },
                { status: 400 }
            );
        }


        const existingEmployee =
            await Employees.findOne({
                email,
            });


        if (existingEmployee) {

            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Employee with this email already exists",
                },
                { status: 409 }
            );
        }


        // CREATE
      

        const employee =
            await Employees.create({
                name,
                email,
                phone_number,
                job_title,
                departmentId,
                status: status ?? false,
            });

        await employee.populate(
            "departmentId",
            "department_name"
        );


        return NextResponse.json(
            {
                success: true,
                message:
                    "Employee created successfully",
                employee,
            },
            { status: 201 }
        );


    } catch (error) {

        console.error(
            "Create employee error:",
            error
        );


        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to create employee",
            },
            { status: 500 }
        );
    }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;

    const body = await request.json();

    const {
      name,
      email,
      phone_number,
      job_title,
      departmentId,
      status,
    } = body;

    if (
      !name ||
      !email ||
      !phone_number ||
      !job_title ||
      !departmentId
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    const existingEmployee = await Employees.findById(id);

    if (!existingEmployee) {
      return NextResponse.json(
        {
          success: false,
          message: "Employee not found",
        },
        { status: 404 }
      );
    }

    // if email is being changed, make sure it isn't taken by another employee
    if (email !== existingEmployee.email) {
      const emailTaken = await Employees.findOne({
        email,
        _id: { $ne: id },
      });

      if (emailTaken) {
        return NextResponse.json(
          {
            success: false,
            message: "Employee with this email already exists",
          },
          { status: 409 }
        );
      }
    }

    const updatedEmployee = await Employees.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phone_number,
        job_title,
        departmentId,
        status: status ?? existingEmployee.status,
      },
      { new: true, runValidators: true }
    ).populate("departmentId", "department_name");

    return NextResponse.json(
      {
        success: true,
        message: "Employee updated successfully",
        employee: updatedEmployee,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update employee error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update employee",
      },
      { status: 500 }
    );
  }
}