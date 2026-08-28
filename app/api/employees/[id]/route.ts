import { connectDB } from "@/app/lib/mongodb";
import Employees from "@/app/modules/employees/schema";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;

        const body = await request.json();

        const {
            name,
            email,
            phone_number,
            job_title,
            departmentId,
            status,
        } = body;

        const updatedEmployee =
            await Employees.findByIdAndUpdate(
                id,
                {
                    name,
                    email,
                    phone_number,
                    job_title,
                    departmentId,
                    status,
                },
                {
                    new: true,
                    runValidators: true,
                }
            ).populate(
                "departmentId",
                "department_name"
            );

        if (!updatedEmployee) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Employee not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Employee updated successfully",
                employee: updatedEmployee,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error(
            "Update employee error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update employee",
            },
            { status: 500 }
        );
    }
}


export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const deletedEmployee =
      await Employees.findByIdAndDelete(id);

    if (!deletedEmployee) {
      return NextResponse.json(
        {
          success: false,
          message: "employee not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "employee deleted successfully",
        department: deletedEmployee,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error(
      "Delete employee error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete employee",
      },
      { status: 500 }
    );
  }
}