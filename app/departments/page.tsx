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

  // =========================
  // FORM STATES
  // =========================

  const [departmentName, setDepartmentName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(false);

  // =========================
  // DIALOG
  // =========================

  const [open, setOpen] = useState(false);

  // =========================
  // CREATE / UPDATE STATE
  // =========================

  const [saving, setSaving] = useState(false);

  // null = create mode
  // id   = edit mode
  const [editingId, setEditingId] = useState<string | null>(null);

  // =========================
  // DELETE STATE
  // =========================

  const [deletingId, setDeletingId] = useState<string | null>(null);

  // =========================
  // GET DEPARTMENTS
  // =========================

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

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load departments"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // OPEN CREATE DIALOG
  // =========================

  const handleAddDepartment = () => {
    setEditingId(null);

    setDepartmentName("");
    setCode("");
    setDescription("");
    setStatus(false);

    setError("");
    setOpen(true);
  };

  // =========================
  // OPEN EDIT DIALOG
  // =========================

  const handleEditDepartment = (
    department: Department
  ) => {
    setEditingId(department._id);

    setDepartmentName(
      department.department_name
    );

    setCode(department.code);

    setDescription(
      department.description
    );

    setStatus(department.status);

    setError("");
    setOpen(true);
  };

  // =========================
  // CREATE / UPDATE
  // =========================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const isEditing = editingId !== null;

      const url = isEditing
        ? `/api/departments/${editingId}`
        : "/api/departments";

      const method = isEditing
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
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
        throw new Error(
          data.message ||
            (isEditing
              ? "Failed to update department"
              : "Failed to create department")
        );
      }

      if (isEditing) {
        // Update department in table
        setDepartments((prev) =>
          prev.map((department) =>
            department._id === editingId
              ? data.department
              : department
          )
        );
      } else {
        // Add new department
        setDepartments((prev) => [
          data.department,
          ...prev,
        ]);
      }

      // Clear form
      setDepartmentName("");
      setCode("");
      setDescription("");
      setStatus(false);

      setEditingId(null);

      // Close dialog
      setOpen(false);

    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // DELETE DEPARTMENT
  // =========================

  const deleteDepartment = async (
    id: string
  ) => {
    try {
      setDeletingId(id);
      setError("");

      const response = await fetch(
        `/api/departments/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete department"
        );
      }

      // Remove from table
      setDepartments((prev) =>
        prev.filter(
          (department) =>
            department._id !== id
        )
      );

    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete department"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =========================
  // FETCH ON PAGE LOAD
  // =========================

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div className="w-full p-6">

      {/* ================= HEADER ================= */}

      <div className="mb-6 flex items-center justify-between">

        <h1 className="text-xl font-bold">
          DEPARTMENTS
        </h1>

        {/* ================= ADD / EDIT DIALOG ================= */}

        <Dialog
          open={open}
          onOpenChange={setOpen}
        >

          {/* ADD BUTTON */}

          <DialogTrigger >
            <Button onClick={handleAddDepartment}>
              Add Department
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-lg">

            <DialogHeader>

              <DialogTitle>
                {editingId
                  ? "Edit Department"
                  : "Add Department"}
              </DialogTitle>

            </DialogHeader>

            <form
              onSubmit={handleSubmit}
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
                    setDepartmentName(
                      e.target.value
                    )
                  }
                  required
                />

              </div>

              {/* Department Code */}

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

                <Input
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
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
                    setStatus(
                      e.target.checked
                    )
                  }
                />

                <Label>
                  Active
                </Label>

              </div>

              {/* SUBMIT */}

              <Button
                type="submit"
                className="w-full"
                disabled={saving}
              >

                {saving
                  ? editingId
                    ? "Updating..."
                    : "Creating..."
                  : editingId
                  ? "Update Department"
                  : "Create Department"}

              </Button>

            </form>

          </DialogContent>

        </Dialog>

      </div>

      {/* ================= ERROR ================= */}

      {error && (
        <p className="mb-4 text-red-500">
          {error}
        </p>
      )}

      {/* ================= LOADING ================= */}

      {loading ? (

        <p className="text-muted-foreground">
          Loading departments...
        </p>

      ) : (

        /* ================= TABLE ================= */

        <Table>

          <TableHeader>

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

              departments.map(
                (department) => (

                  <TableRow
                    key={department._id}
                  >

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

                        {/* EDIT */}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleEditDepartment(
                              department
                            )
                          }
                        >
                          Edit
                        </Button>

                        {/* DELETE */}

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            deleteDepartment(
                              department._id
                            )
                          }
                          disabled={
                            deletingId ===
                            department._id
                          }
                        >

                          {deletingId ===
                          department._id
                            ? "Deleting..."
                            : "Delete"}

                        </Button>

                      </div>

                    </TableCell>

                  </TableRow>

                )
              )

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