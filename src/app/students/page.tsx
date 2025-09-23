// students/page.tsx
"use client";
import { useState, useEffect } from "react";
import { Button } from "antd";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  ADD_STUDENT,
  DELETE_STUDENT,
  GET_STUDENTS,
  UPDATE_STUDENT,
} from "../graphql/queries";
import { Student, GetStudentsResponse } from "../types/types";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";

export default function Students() {
  const [search, setSearch] = useState("");
  const [newStudent, setNewStudent] = useState<{
    prefixid?: number;
    firstname: string;
    lastname: string;
    genderid: number;
    gradelevelid: number;
  }>({
    firstname: "",
    lastname: "",
    prefixid: 1,
    genderid: 1,
    gradelevelid: 1,
  });
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);

  const { loading, error, data } = useQuery<GetStudentsResponse>(GET_STUDENTS);
  const [createStudent, { loading: addingStudent }] = useMutation(ADD_STUDENT, {
    refetchQueries: [GET_STUDENTS],
    onError: (error) => {
      console.error("Error adding student:", error);
    },
  });

  const [deleteStudent, { loading: deletingStudent }] = useMutation(
    DELETE_STUDENT,
    {
      refetchQueries: [GET_STUDENTS],
      onError: (error) => {
        console.error("Error deleting student:", error);
      },
    }
  );
  const [updateStudent, { loading: updatingStudent }] = useMutation(
    UPDATE_STUDENT,
    {
      refetchQueries: [GET_STUDENTS],
      onError: (error) => {
        console.error("Error updating student:", error);
      },
    }
  );

  useEffect(() => {
    if (data?.findAllStudents) {
      const students = data.findAllStudents;
      console.log("Fetched students:", students);

      if (search) {
        const filtered = students.filter(
          (student) =>
            student.studentid.toString().startsWith(search) ||
            (student.prefix?.prefixname ?? "").startsWith(search) ||
            student.firstname.toLowerCase().includes(search.toLowerCase()) ||
            student.lastname.toLowerCase().includes(search.toLowerCase()) ||
            (student.gender?.gendername ?? "").startsWith(search) ||
            (student.gradelevel?.levelname ?? "").startsWith(search)
        );
        setFilteredStudents(filtered);
      } else {
        setFilteredStudents(students);
      }
    }
  }, [data, search]);

  useEffect(() => {
    console.log("currentstudent:", currentStudent);
  }, [currentStudent]);

  const handleAddStudent = ({
    prefixid,
    firstname,
    lastname,
    genderid,
    gradelevelid,
  }: {
    prefixid?: number;
    firstname?: string;
    lastname?: string;
    genderid?: number;
    gradelevelid?: number;
  }) => {
    console.log("Adding student:", { firstname, lastname });
    createStudent({
      variables: {
        createStudentInput: {
          prefixid,
          firstname,
          lastname,
          genderid,
          gradelevelid,
        },
      },
    });
    setNewStudent({
      prefixid: 1,
      firstname: "",
      lastname: "",
      genderid: 1,
      gradelevelid: 1,
    });
  };

  const handleDeleteStudent = (studentId: number) => {
    deleteStudent({
      variables: { studentid: studentId },
    });
  };

  const handleUpdateStudent = (student: Student) => {
    console.log("Updating student:", student);
    updateStudent({
      variables: {
        updateStudentInput: {
          studentid: parseInt(student.studentid),
          prefixid: student.prefixid,
          firstname: student.firstname,
          lastname: student.lastname,
          genderid: student.genderid,
          gradelevelid: student.gradelevelid,
          classroomid: student.classroomid,
        },
      },
    });
    setCurrentStudent(null);
  };

  const handleCancelEdit = () => {
    setCurrentStudent(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data || !data.findAllStudents) {
    return <p>No student data found.</p>;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Student Management
            </h1>

            {/* Search Bar */}
            <div className="mb-8 flex justify-center">
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder="Search students..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-3 pl-12 text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
                <div className="absolute inset-y-0 left-2 flex items-center pl-3 pointer-events-none text-gray-400">
                  <SearchOutlined />
                </div>
              </div>
            </div>

            {/* Students List */}
            <div className="space-y-4 mb-8">
              {filteredStudents.map((student) => (
                <div
                  className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition duration-200"
                  key={student.studentid}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 text-blue-800 px-2 py-2 rounded-full text-sm whitespace-nowrap">
                        รหัส: {student.studentid}
                      </div>

                      {currentStudent?.studentid === student.studentid ? (
                        <div className="flex flex-wrap items-center gap-3">
                          <select
                            id="prefix"
                            name="prefixid"
                            value={currentStudent.prefixid}
                            onChange={(e) => {
                              const updatedStudent = {
                                ...currentStudent,
                                prefixid: parseInt(e.target.value),
                              };
                              setCurrentStudent(updatedStudent);
                            }}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                          >
                            <option value="1">ด.ช.</option>
                            <option value="2">ด.ญ.</option>
                            <option value="3">นาย</option>
                            <option value="4">นางสาว</option>
                          </select>

                          <input
                            type="text"
                            value={currentStudent.firstname}
                            onChange={(e) => {
                              const updatedStudent = {
                                ...currentStudent,
                                firstname: e.target.value,
                              };
                              setCurrentStudent(updatedStudent);
                            }}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-0 flex-1"
                          />

                          <input
                            type="text"
                            value={currentStudent.lastname}
                            onChange={(e) => {
                              const updatedStudent = {
                                ...currentStudent,
                                lastname: e.target.value,
                              };
                              setCurrentStudent(updatedStudent);
                            }}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-0 flex-1"
                          />

                          <select
                            id="gender"
                            name="genderid"
                            value={currentStudent.genderid}
                            onChange={(e) => {
                              const updatedStudent = {
                                ...currentStudent,
                                genderid: parseInt(e.target.value),
                              };
                              setCurrentStudent(updatedStudent);
                            }}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                          >
                            <option value="1">ชาย</option>
                            <option value="2">หญิง</option>
                          </select>

                          <select
                            id="grade"
                            name="gradelevelid"
                            value={currentStudent.gradelevelid}
                            onChange={(e) => {
                              const updatedStudent = {
                                ...currentStudent,
                                gradelevelid: parseInt(e.target.value),
                              };
                              setCurrentStudent(updatedStudent);
                            }}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                          >
                            <option value="1">ป.1</option>
                            <option value="2">ป.2</option>
                            <option value="3">ป.3</option>
                            <option value="4">ป.4</option>
                            <option value="5">ป.5</option>
                            <option value="6">ป.6</option>
                            <option value="7">ม.1</option>
                            <option value="8">ม.2</option>
                            <option value="9">ม.3</option>
                          </select>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center gap-4 text-gray-700">
                          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                            {student.prefix?.prefixname ?? "null"}
                          </span>
                          <span className="font-semibold text-lg">
                            {student.firstname}
                          </span>
                          <span className="font-semibold text-lg">
                            {student.lastname}
                          </span>
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                            {student.gender?.gendername ?? "null"}
                          </span>
                          <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                            {student.gradelevel?.levelname ?? "null"}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-3">
                      {currentStudent?.studentid === student.studentid ? (
                        <div className="flex items-center space-x-3">
                          <Button
                            type="primary"
                            onClick={() => {
                              handleUpdateStudent(currentStudent);
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                          >
                            Update
                          </Button>
                          <Button
                            type="primary"
                            danger
                            onClick={() => {
                              handleDeleteStudent(parseInt(student.studentid));
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
                          >
                            Delete
                          </Button>
                          <Button
                            onClick={() => handleCancelEdit()}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          type="primary"
                          onClick={() => {
                            setCurrentStudent(student);
                          }}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 flex items-center space-x-2"
                        >
                          <span>Edit</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Student Section */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border-2 border-dashed border-gray-300">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                Add New Student
              </h2>

              <div className="flex flex-wrap items-center gap-4">
                <select
                  id="prefix"
                  name="prefixid"
                  value={newStudent.prefixid}
                  onChange={(e) => {
                    setNewStudent({
                      ...newStudent,
                      prefixid: parseInt(e.target.value),
                    });
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                >
                  <option value="1">ด.ช.</option>
                  <option value="2">ด.ญ.</option>
                  <option value="3">นาย</option>
                  <option value="4">นางสาว</option>
                </select>

                <input
                  type="text"
                  placeholder="First Name"
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, firstname: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white flex-1 min-w-32"
                />

                <input
                  type="text"
                  placeholder="Last Name"
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, lastname: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white flex-1 min-w-32"
                />

                <select
                  id="gender"
                  name="genderid"
                  value={newStudent.genderid}
                  onChange={(e) => {
                    setNewStudent({
                      ...newStudent,
                      genderid: parseInt(e.target.value),
                    });
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                >
                  <option value="1">ชาย</option>
                  <option value="2">หญิง</option>
                </select>

                <select
                  id="grade"
                  name="gradelevelid"
                  value={newStudent.gradelevelid}
                  onChange={(e) => {
                    setNewStudent({
                      ...newStudent,
                      gradelevelid: parseInt(e.target.value),
                    });
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                >
                  <option value="1">ป.1</option>
                  <option value="2">ป.2</option>
                  <option value="3">ป.3</option>
                  <option value="4">ป.4</option>
                  <option value="5">ป.5</option>
                  <option value="6">ป.6</option>
                  <option value="7">ม.1</option>
                  <option value="8">ม.2</option>
                  <option value="9">ม.3</option>
                </select>

                <Button
                  type="primary"
                  color="green"
                  icon={<PlusOutlined />}
                  onClick={() => handleAddStudent(newStudent)}
                  disabled={!newStudent.firstname || !newStudent.lastname || addingStudent}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 flex items-center space-x-2 font-medium"
                >
                  <div>Add Student</div>
                </Button>
              </div>

              {addingStudent && (
                <div className="mt-4 flex items-center text-blue-600">
                  Adding student...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
