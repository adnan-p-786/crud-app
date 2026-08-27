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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Department {
  _id: string;
  department_name: string;
  code: string;
  description: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

const Page = () => {
  const [departments, setDepartments] = useState<Department[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form states
  const [departmentName, setDepartmentName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(false);

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

// GET

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/departments");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch departments"
        );
      }

      setDepartments(data.departments);
    } catch (error) {
      console.error(error);
      setError("Failed to load departments");
    } finally {
      setLoading(false);
    }
  };


  // CREATE

  const handleCreateDepartment = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setSaving(true);

      const response = await fetch("/api/departments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          department_name: departmentName,
          code,
          description,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to create department");
        return;
      }

      setDepartments((prev) => [
        data.department,
        ...prev,
      ]);

      setDepartmentName("");
      setCode("");
      setDescription("");
      setStatus(false);

      setOpen(false);

      alert("Department created successfully");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div className="w-full p-6">

      {/* HEADER */}

      <div className="mb-6 flex items-center justify-between">

        <h1 className="text-xl font-bold">
          DEPARTMENTS
        </h1>

        {/* ADD DEPARTMENT */}

        <Dialog open={open} onOpenChange={setOpen}>

          <DialogTrigger className='border-2 p-2 rounded-2xl bg-gray-200 hover:cursor-pointer'>
            Add Department
          </DialogTrigger>

          <DialogContent>

            <DialogHeader>
              <DialogTitle>
                Add Department
              </DialogTitle>
            </DialogHeader>

            <form
              onSubmit={handleCreateDepartment}
              className="space-y-4"
            >

              {/* Department Name */}

              <div className="space-y-2">
                <Label>
                  Department Name
                </Label>

                <Input
                  placeholder="Enter department name"
                  value={departmentName}
                  onChange={(e) =>
                    setDepartmentName(e.target.value)
                  }
                  required
                />
              </div>

              {/* Code */}

              <div className="space-y-2">
                <Label>
                  Department Code
                </Label>

                <Input
                  placeholder="Enter department code"
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value)
                  }
                  required
                />
              </div>

              {/* Description */}

              <div className="space-y-2">
                <Label>
                  Description
                </Label>

                <Textarea
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  required
                />
              </div>

              {/* Status */}

              <div className="flex items-center gap-2">

                <input
                  type="checkbox"
                  checked={status}
                  onChange={(e) =>
                    setStatus(e.target.checked)
                  }
                />

                <Label>
                  Active
                </Label>

              </div>

              {/* Submit */}

              <Button
                type="submit"
                className="w-full"
                disabled={saving}
              >
                {saving
                  ? "Creating..."
                  : "Create Department"}
              </Button>

            </form>

          </DialogContent>

        </Dialog>

      </div>

      {/* ERROR */}

      {error && (
        <p className="mb-4 text-red-500">
          {error}
        </p>
      )}

      {/* LOADING */}

      {loading ? (
        <p className="text-muted-foreground">
          Loading departments...
        </p>
      ) : (

        <Table>

          <TableHeader className="text-lg">

            <TableRow>

              <TableHead>
                Department Name
              </TableHead>

              <TableHead>
                Department Code
              </TableHead>

              <TableHead>
                Description
              </TableHead>

              <TableHead>
                Status
              </TableHead>

              <TableHead>
                Action
              </TableHead>

            </TableRow>

          </TableHeader>

          <TableBody>

            {departments.length > 0 ? (

              departments.map((department) => (

                <TableRow key={department._id}>

                  <TableCell>
                    {department.department_name}
                  </TableCell>

                  <TableCell>
                    {department.code}
                  </TableCell>

                  <TableCell>
                    {department.description}
                  </TableCell>

                  <TableCell>

                    {department.status ? (

                      <span className="font-medium text-green-600">
                        Active
                      </span>

                    ) : (

                      <span className="font-medium text-red-600">
                        Inactive
                      </span>

                    )}

                  </TableCell>

                  <TableCell>

                    <div className="flex gap-2">

                      <Button
                        variant="outline"
                        size="sm"
                      >
                        Edit
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                      >
                        Delete
                      </Button>

                    </div>

                  </TableCell>

                </TableRow>

              ))

            ) : (

              <TableRow>

                <TableCell
                  colSpan={5}
                  className="text-center"
                >
                  No departments found
                </TableCell>

              </TableRow>

            )}

          </TableBody>

        </Table>

      )}

    </div>
  );
};

export default Page;