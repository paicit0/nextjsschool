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

export default function Students() {
  const [editMode, setEditMode] = useState(false);
  const [search, setSearch] = useState("");
  const [newStudent, setNewStudent] = useState<{
    firstname: string;
    lastname: string;
  }>({
    firstname: "",
    lastname: "",
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
    firstname,
    lastname,
  }: {
    firstname: string;
    lastname: string;
  }) => {
    createStudent({
      variables: {
        createStudentInput: { firstname, lastname },
      },
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
    setEditMode(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data || !data.findAllStudents) {
    return <p>No student data found.</p>;
  }

  return (
    <>
      <div className="flex flex-col justify-center align-items-center">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div>
          {filteredStudents.map((student) => (
            <div className="flex flex-row" key={student.studentid}>
              <div className="flex flex-row gap-5">
                <div>{student.studentid}</div>
              </div>

              {currentStudent?.studentid === student.studentid ? (
                <>
                  <div className="flex flex-row gap-5">
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
                    <input
                      type="text"
                      value={currentStudent.classroomid}
                      onChange={(e) => {
                        const updatedStudent = {
                          ...currentStudent,
                          classroomid: parseInt(e.target.value),
                        };
                        setCurrentStudent(updatedStudent);
                      }}
                    />
                  </div>
                  <Button onClick={() => handleCancelEdit()}>Cancel</Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      handleUpdateStudent(currentStudent);
                    }}
                  >
                    Update
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      handleDeleteStudent(parseInt(student.studentid));
                    }}
                  >
                    Delete
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex flex-row gap-5">
                    <div>{student.prefix?.prefixname ?? "null"}</div>
                    <div>{student.firstname}</div>
                    <div>{student.lastname}</div>
                    <div>{student.gender?.gendername ?? "null"}</div>
                    <div>{student.gradelevel?.levelname ?? "null"}</div>
                    <div>{student.classroomid ?? "null"}</div>
                  </div>

                  <Button
                    type="primary"
                    onClick={() => {
                      setCurrentStudent(student);
                    }}
                  >
                    Edit
                  </Button>
                </>
              )}
            </div>
          ))}
          <div>
            <input
              type="text"
              placeholder="First Name"
              onChange={(e) =>
                setNewStudent({ ...newStudent, firstname: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Last Name"
              onChange={(e) =>
                setNewStudent({ ...newStudent, lastname: e.target.value })
              }
            />
            <Button onClick={() => handleAddStudent(newStudent)}>Add</Button>
          </div>
          {addingStudent && <p>Adding student...</p>}
        </div>
      </div>
    </>
  );
}
