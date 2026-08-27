"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Employee {
  _id: string;
  name: string;
  email: string;
  phone_number: string;
  job_title: string;
  departmentId: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}


const Page = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEmployees = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/employees");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch employees");
      }

      setEmployees(data.employees);
    } catch (error) {
      console.error(error);
      setError("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="w-full p-6">
      <h1 className="mb-6 text-xl font-bold">
        EMPLOYEES
      </h1>

      {loading && (
        <p className="text-muted-foreground">
          Loading employees...
        </p>
      )}

      {error && (
        <p className="text-red-500">
          {error}
        </p>
      )}

      {!loading && !error && (
        <Table>
          <TableHeader>
            <TableRow className="text-lg font-bold">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {employees.length > 0 ? (
              employees.map((employee) => (
                <TableRow key={employee._id}>
                  <TableCell>
                    {employee.name}
                  </TableCell>

                  <TableCell>
                    {employee.email}
                  </TableCell>

                  <TableCell>
                    {employee.phone_number}
                  </TableCell>

                  <TableCell>
                    {employee.job_title}
                  </TableCell>

                  <TableCell>
                    {employee.departmentId}
                  </TableCell>

                  <TableCell>
                    {employee.status ? (
                      <span className="text-green-600">
                        Active
                      </span>
                    ) : (
                      <span className="text-red-600">
                        Inactive
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center"
                >
                  No employees found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

export default Page