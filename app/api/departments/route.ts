import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Department from "@/app/modules/departments/shema";

export async function GET() {
  try {
    await connectDB();

    const departments = await Department.find().sort({
      createdAt: -1,
    });

    return NextResponse.json(
      {
        success: true,
        departments,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get departments error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch departments",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      department_name,
      code,
      description,
      status,
    } = body;

    // Validation
    if (!department_name || !code || !description) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Department name, code and description are required",
        },
        { status: 400 }
      );
    }

    // Check duplicate code
    const existingDepartment = await Department.findOne({
      code,
    });

    if (existingDepartment) {
      return NextResponse.json(
        {
          success: false,
          message: "Department code already exists",
        },
        { status: 409 }
      );
    }

    const department = await Department.create({
      department_name,
      code,
      description,
      status: status ?? false,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Department created successfully",
        department,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create department error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create department",
      },
      { status: 500 }
    );
  }
}


