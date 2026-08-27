import { connectDB } from "@/app/lib/mongodb";
import Department from "@/app/modules/departments/shema";
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
      department_name,
      code,
      description,
      status,
    } = body;

    if (!department_name || !code || !description || status === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    const updatedDepartment = await Department.findByIdAndUpdate(
      id,
      {
        department_name,
        code,
        description,
        status,
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!updatedDepartment) {
      return NextResponse.json(
        {
          success: false,
          message: "Department not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Department updated successfully",
        department: updatedDepartment,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update department error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "Department code already in use",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update department",
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

    const deletedDepartment =
      await Department.findByIdAndDelete(id);

    if (!deletedDepartment) {
      return NextResponse.json(
        {
          success: false,
          message: "Department not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Department deleted successfully",
        department: deletedDepartment,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error(
      "Delete department error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete department",
      },
      { status: 500 }
    );
  }
}