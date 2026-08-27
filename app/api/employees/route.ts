import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Employees from "@/app/modules/employees/schema";

export async function GET() {
  try {
    await connectDB();

    const employees = await Employees.find().sort({
      createdAt: -1,
    });

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