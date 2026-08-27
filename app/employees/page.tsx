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
    phone_number: string;
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

    const [employees, setEmployees] = useState<Employee[]>([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =========================
    // DEPARTMENTS
    // =========================

    const [departments, setDepartments] = useState<Department[]>([]);

    const [departmentLoading, setDepartmentLoading] =
        useState(false);


    // =========================
    // FORM STATES
    // =========================

    const [name, setName] = useState("");

    const [email, setEmail] = useState("");

    const [phoneNumber, setPhoneNumber] = useState("");

    const [jobTitle, setJobTitle] = useState("");

    const [departmentId, setDepartmentId] = useState("");

    const [status, setStatus] = useState(false);


    // =========================
    // DIALOG
    // =========================

    const [open, setOpen] = useState(false);


    // =========================
    // SAVING
    // =========================

    const [saving, setSaving] = useState(false);


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
    // CREATE EMPLOYEE
    // =========================

    const handleCreateEmployee = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();


        try {

            setSaving(true);


            const response = await fetch(
                "/api/employees",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({

                        name,

                        email,

                        phone_number:
                            phoneNumber,

                        job_title:
                            jobTitle,

                        departmentId,

                        status,

                    }),
                }
            );


            const data = await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Failed to create employee"
                );

                return;

            }


            // =========================
            // REFRESH EMPLOYEE LIST
            // =========================

            await fetchEmployees();


            // =========================
            // RESET FORM
            // =========================

            setName("");

            setEmail("");

            setPhoneNumber("");

            setJobTitle("");

            setDepartmentId("");

            setStatus(false);


            // =========================
            // CLOSE DIALOG
            // =========================

            setOpen(false);


        } catch (error) {

            console.error(
                "Create employee error:",
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
                    ADD EMPLOYEE
                ========================= */}

                <Dialog
                    open={open}
                    onOpenChange={setOpen}
                >

                    <DialogTrigger>

                        <Button>
                            Add Employee
                        </Button>

                    </DialogTrigger>


                    <DialogContent className="max-w-lg">


                        <DialogHeader>

                            <DialogTitle>
                                Add Employee
                            </DialogTitle>

                        </DialogHeader>


                        <form
                            onSubmit={
                                handleCreateEmployee
                            }
                            className="space-y-4"
                        >


                            {/* =========================
                                NAME
                            ========================= */}

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


                            {/* =========================
                                EMAIL
                            ========================= */}

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


                            {/* =========================
                                PHONE
                            ========================= */}

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


                            {/* =========================
                                JOB TITLE
                            ========================= */}

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


                            {/* =========================
                                DEPARTMENT
                            ========================= */}

                            <div className="space-y-2">

                                <Label>
                                    Department
                                </Label>


                                <Select
                                    value={
                                        departmentId
                                    }
                                    onValueChange={
                                        (value) =>
                                            setDepartmentId(value ?? "")
                                    }
                                    required
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
                                                            department.department_name
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


                            {/* =========================
                                STATUS
                            ========================= */}

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


                            {/* =========================
                                SUBMIT
                            ========================= */}

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={
                                    saving ||
                                    departmentLoading
                                }
                            >

                                {saving
                                    ? "Creating..."
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


                    {/* =========================
                        TABLE HEADER
                    ========================= */}

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


                    {/* =========================
                        TABLE BODY
                    ========================= */}

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