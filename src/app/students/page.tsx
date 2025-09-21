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
  const { loading, error, data } = useQuery<GetStudentsResponse>(GET_STUDENTS);
  const [newStudent, setNewStudent] = useState({
    firstname: "",
    lastname: "",
  });
  const [createStudent, { loading: addingStudent }] = useMutation(ADD_STUDENT, {
    refetchQueries: [GET_STUDENTS],
  });

  const [deleteStudent, { loading: deletingStudent }] = useMutation(
    DELETE_STUDENT,
    {
      refetchQueries: [GET_STUDENTS],
    }
  );
  const [updateStudent, { loading: updatingStudent }] = useMutation(
    UPDATE_STUDENT,
    {
      refetchQueries: [GET_STUDENTS],
    }
  );

  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);

  useEffect(() => {
    if (data?.findAllStudents) {
      const students = data.findAllStudents;

      if (search) {
        const filtered = students.filter(
          (student) =>
            student.firstname.toLowerCase().includes(search.toLowerCase()) ||
            student.lastname.toLowerCase().includes(search.toLowerCase()) ||
            student.studentid.startsWith(search) ||
            (student.gradelevelid ?? "").toString().startsWith(search)
        );
        setFilteredStudents(filtered);
      } else {
        setFilteredStudents(students);
      }
    }
  }, [data, search]);

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
        <Button
          type="primary"
          onClick={() => {
            editMode ? setEditMode(false) : setEditMode(true);
          }}
        >
          Edit
        </Button>
        <div>
          {filteredStudents.map((student) => (
            <div className="flex flex-row" key={student.studentid}>
              <div className="flex flex-row gap-5">
                <div>{student.studentid}</div>
                {editMode ? (
                  <div className="flex flex-row gap-5">
                    <input type="text" value={student.prefixid} />
                    <input type="text" value={student.firstname} />
                    <input type="text" value={student.lastname} />
                    <input type="text" value={student.genderid} />
                    <input type="text" value={student.gradelevelid} />
                  </div>
                ) : (
                  <div className="flex flex-row gap-5">
                    <div>{student.prefix?.prefixname ?? "null"}</div>
                    <div>{student.firstname}</div>
                    <div>{student.lastname}</div>
                    <div>{student.gender?.gendername ?? "null"}</div>
                    <div>{student.gradelevel?.levelname ?? "null"}</div>
                  </div>
                )}
              </div>
              {editMode && (
                <div className="flex flex-row gap-5">
                  <Button type="primary">Edit</Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      handleDeleteStudent(parseFloat(student.studentid));
                    }}
                  >
                    Delete
                  </Button>
                </div>
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
