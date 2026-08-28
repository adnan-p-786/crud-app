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

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


// =========================
// EMPLOYEE INTERFACE
// =========================

interface Employee {
    _id: string;
    name: string;
    email: string;
    phone_number: number;
    job_title: string;

    departmentId: {
        _id: string;
        department_name: string;
    };

    status: boolean;
    createdAt: string;
    updatedAt: string;
}


// =========================
// DEPARTMENT INTERFACE
// =========================

interface Department {
    _id: string;
    department_name: string;
}


// =========================
// PAGE
// =========================

const Page = () => {

    // =========================
    // EMPLOYEES
    // =========================

    const [employees, setEmployees] =
        useState<Employee[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =========================
    // DEPARTMENTS
    // =========================

    const [departments, setDepartments] =
        useState<Department[]>([]);

    const [departmentLoading, setDepartmentLoading] =
        useState(false);


    // =========================
    // FORM STATES
    // =========================

    const [name, setName] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [phoneNumber, setPhoneNumber] =
        useState("");

    const [jobTitle, setJobTitle] =
        useState("");

    const [departmentId, setDepartmentId] =
        useState("");

    const [status, setStatus] =
        useState(false);


    // =========================
    // EDIT STATE
    // =========================

    const [editingEmployeeId, setEditingEmployeeId] =
        useState<string | null>(null);


    // =========================
    // DIALOG
    // =========================

    const [open, setOpen] =
        useState(false);


    // =========================
    // SAVING
    // =========================

    const [saving, setSaving] =
        useState(false);


    // =========================
    // GET EMPLOYEES
    // =========================

    const fetchEmployees = async () => {

        try {

            setLoading(true);

            setError("");

            const response = await fetch(
                "/api/employees"
            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to fetch employees"
                );

            }

            setEmployees(
                data.employees || []
            );

        } catch (error) {

            console.error(
                "Fetch employees error:",
                error
            );

            setError(
                "Failed to load employees"
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================
    // GET DEPARTMENTS
    // =========================

    const fetchDepartments = async () => {

        try {

            setDepartmentLoading(true);

            const response = await fetch(
                "/api/departments"
            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to fetch departments"
                );

            }

            setDepartments(
                data.departments || []
            );

        } catch (error) {

            console.error(
                "Fetch departments error:",
                error
            );

        } finally {

            setDepartmentLoading(false);

        }

    };


    // =========================
    // RESET FORM
    // =========================

    const resetForm = () => {

        setName("");

        setEmail("");

        setPhoneNumber("");

        setJobTitle("");

        setDepartmentId("");

        setStatus(false);

        setEditingEmployeeId(null);

    };


    // =========================
    // EDIT EMPLOYEE
    // =========================

    const handleEditEmployee = (
        employee: Employee
    ) => {

        setEditingEmployeeId(
            employee._id
        );

        setName(
            employee.name
        );

        setEmail(
            employee.email
        );

        setPhoneNumber(
            String(employee.phone_number)
        );

        setJobTitle(
            employee.job_title
        );

        setDepartmentId(
            employee.departmentId?._id || ""
        );

        setStatus(
            employee.status
        );

        setOpen(true);

    };


    // =========================
    // CREATE / UPDATE EMPLOYEE
    // =========================

    const handleSubmitEmployee = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        try {

            setSaving(true);

            const isEditing =
                editingEmployeeId !== null;


            const url = isEditing
                ? `/api/employees/${editingEmployeeId}`
                : "/api/employees";


            const method = isEditing
                ? "PUT"
                : "POST";


            const response = await fetch(
                url,
                {
                    method,

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({

                        name,

                        email,

                        phone_number:
                            Number(phoneNumber),

                        job_title:
                            jobTitle,

                        departmentId,

                        status,

                    }),
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Failed to save employee"
                );

                return;

            }


            // Refresh employee list
            await fetchEmployees();


            // Reset form
            resetForm();


            // Close dialog
            setOpen(false);


        } catch (error) {

            console.error(
                "Save employee error:",
                error
            );

            alert(
                "Something went wrong"
            );

        } finally {

            setSaving(false);

        }

    };


    // =========================
    // DELETE EMPLOYEE
    // =========================

    const handleDeleteEmployee = async (
        id: string
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this employee?"
            );


        if (!confirmed) {
            return;
        }


        try {

            const response = await fetch(
                `/api/employees/${id}`,
                {
                    method: "DELETE",
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Failed to delete employee"
                );

                return;

            }


            // Remove employee from table
            setEmployees(
                (prevEmployees) =>
                    prevEmployees.filter(
                        (employee) =>
                            employee._id !== id
                    )
            );


            alert(
                data.message ||
                "Employee deleted successfully"
            );


        } catch (error) {

            console.error(
                "Delete employee error:",
                error
            );

            alert(
                "Something went wrong while deleting employee"
            );

        }

    };


    // =========================
    // ADD EMPLOYEE
    // =========================

    const handleAddEmployee = () => {

        resetForm();

        setOpen(true);

    };


    // =========================
    // LOAD DATA
    // =========================

    useEffect(() => {

        fetchEmployees();

        fetchDepartments();

    }, []);


    // =========================
    // UI
    // =========================

    return (

        <div className="w-full p-6">


            {/* =========================
                HEADER
            ========================= */}

            <div className="mb-6 flex items-center justify-between">


                <h1 className="text-xl font-bold">
                    EMPLOYEES
                </h1>


                {/* =========================
                    ADD / EDIT DIALOG
                ========================= */}

                <Dialog
                    open={open}
                    onOpenChange={setOpen}
                >

                    <DialogTrigger >

                        <Button
                            onClick={
                                handleAddEmployee
                            }
                        >
                            Add Employee
                        </Button>

                    </DialogTrigger>


                    <DialogContent className="max-w-lg">


                        <DialogHeader>

                            <DialogTitle>

                                {editingEmployeeId
                                    ? "Edit Employee"
                                    : "Add Employee"}

                            </DialogTitle>

                        </DialogHeader>


                        <form
                            onSubmit={
                                handleSubmitEmployee
                            }
                            className="space-y-4"
                        >


                            {/* NAME */}

                            <div className="space-y-2">

                                <Label>
                                    Name
                                </Label>

                                <Input
                                    placeholder="Enter employee name"
                                    value={name}
                                    onChange={(e) =>
                                        setName(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>


                            {/* EMAIL */}

                            <div className="space-y-2">

                                <Label>
                                    Email
                                </Label>

                                <Input
                                    type="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>


                            {/* PHONE */}

                            <div className="space-y-2">

                                <Label>
                                    Phone Number
                                </Label>

                                <Input
                                    type="tel"
                                    placeholder="Enter phone number"
                                    value={
                                        phoneNumber
                                    }
                                    onChange={(e) =>
                                        setPhoneNumber(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>


                            {/* JOB TITLE */}

                            <div className="space-y-2">

                                <Label>
                                    Job Title
                                </Label>

                                <Input
                                    placeholder="Enter job title"
                                    value={jobTitle}
                                    onChange={(e) =>
                                        setJobTitle(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>


                            {/* DEPARTMENT */}

                            <div className="space-y-2">

                                <Label>
                                    Department
                                </Label>


                                <Select
                                    value={
                                        departmentId
                                    }
                                    onValueChange={(value) =>
                                        setDepartmentId(value ?? "")
                                    }
                                >

                                    <SelectTrigger className="w-full">

                                        <SelectValue
                                            placeholder={
                                                departmentLoading
                                                    ? "Loading departments..."
                                                    : "Select Department"
                                            }
                                        />

                                    </SelectTrigger>


                                    <SelectContent>

                                        {departments.length >
                                        0 ? (

                                            departments.map(
                                                (
                                                    department
                                                ) => (

                                                    <SelectItem
                                                        key={
                                                            department._id
                                                        }
                                                        value={
                                                            department._id
                                                        }
                                                    >

                                                        {
                                                            department.department_name
                                                        }

                                                    </SelectItem>

                                                )
                                            )

                                        ) : (

                                            <SelectItem
                                                value="no-department"
                                                disabled
                                            >
                                                No departments found
                                            </SelectItem>

                                        )}

                                    </SelectContent>

                                </Select>

                            </div>


                            {/* STATUS */}

                            <div className="flex items-center gap-2">

                                <input
                                    type="checkbox"
                                    checked={status}
                                    onChange={(e) =>
                                        setStatus(
                                            e.target.checked
                                        )
                                    }
                                    className="h-4 w-4"
                                />

                                <Label>
                                    Active
                                </Label>

                            </div>


                            {/* SUBMIT */}

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={
                                    saving ||
                                    departmentLoading
                                }
                            >

                                {saving

                                    ? editingEmployeeId
                                        ? "Updating..."
                                        : "Creating..."

                                    : editingEmployeeId
                                        ? "Update Employee"
                                        : "Create Employee"}

                            </Button>


                        </form>

                    </DialogContent>

                </Dialog>

            </div>


            {/* =========================
                ERROR
            ========================= */}

            {error && (

                <p className="mb-4 text-red-500">
                    {error}
                </p>

            )}


            {/* =========================
                LOADING
            ========================= */}

            {loading ? (

                <p className="text-muted-foreground">
                    Loading employees...
                </p>

            ) : (

                <Table>


                    {/* TABLE HEADER */}

                    <TableHeader>

                        <TableRow>

                            <TableHead>
                                Name
                            </TableHead>

                            <TableHead>
                                Email
                            </TableHead>

                            <TableHead>
                                Phone Number
                            </TableHead>

                            <TableHead>
                                Job Title
                            </TableHead>

                            <TableHead>
                                Department
                            </TableHead>

                            <TableHead>
                                Status
                            </TableHead>

                            <TableHead>
                                Action
                            </TableHead>

                        </TableRow>

                    </TableHeader>


                    {/* TABLE BODY */}

                    <TableBody>


                        {employees.length > 0 ? (

                            employees.map(
                                (employee) => (

                                    <TableRow
                                        key={
                                            employee._id
                                        }
                                    >


                                        {/* NAME */}

                                        <TableCell>
                                            {
                                                employee.name
                                            }
                                        </TableCell>


                                        {/* EMAIL */}

                                        <TableCell>
                                            {
                                                employee.email
                                            }
                                        </TableCell>


                                        {/* PHONE */}

                                        <TableCell>
                                            {
                                                employee.phone_number
                                            }
                                        </TableCell>


                                        {/* JOB TITLE */}

                                        <TableCell>
                                            {
                                                employee.job_title
                                            }
                                        </TableCell>


                                        {/* DEPARTMENT */}

                                        <TableCell>

                                            {
                                                employee
                                                    .departmentId
                                                    ?.department_name ||
                                                "N/A"
                                            }

                                        </TableCell>


                                        {/* STATUS */}

                                        <TableCell>

                                            {employee.status ? (

                                                <span className="font-medium text-green-600">
                                                    Active
                                                </span>

                                            ) : (

                                                <span className="font-medium text-red-600">
                                                    Inactive
                                                </span>

                                            )}

                                        </TableCell>


                                        {/* ACTION */}

                                        <TableCell>

                                            <div className="flex gap-2">


                                                {/* EDIT */}

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleEditEmployee(
                                                            employee
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
                                                        handleDeleteEmployee(
                                                            employee._id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </Button>


                                            </div>

                                        </TableCell>


                                    </TableRow>

                                )
                            )

                        ) : (

                            <TableRow>

                                <TableCell
                                    colSpan={7}
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

    );

};


export default Page;
