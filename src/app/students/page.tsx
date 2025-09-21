"use client";
import { useState, useEffect } from "react";
import { Button } from "antd";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";

const GET_STUDENTS = gql`
  query GetStudents {
    findAllStudents {
      studentid
      firstname
      lastname
      gradelevelid
    }
  }
`;

const ADD_STUDENT = gql`
  mutation CreateStudent($createStudentInput: CreateStudentInput!) {
    createStudent(createStudentInput: $createStudentInput) {
      firstname
      lastname
    }
  }
`;

const DELETE_STUDENT = gql`
  mutation DeleteStudent($studentid: Float!) {
    deleteStudent(studentid: $studentid)
  }
`;

const UPDATE_STUDENT = gql`

`;

type Student = {
  studentid: string;
  firstname: string;
  lastname: string;
  gradelevelid: number;
};

type GetStudentsResponse = {
  findAllStudents: Student[];
};

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
            student.gradelevelid.toString().startsWith(search)
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
                    <input type="text" value={student.firstname} />
                    <input type="text" value={student.lastname} />
                    <input type="text" value={student.gradelevelid} />
                  </div>
                ) : (
                  <div className="flex flex-row gap-5">
                    <div>{student.firstname}</div>
                    <div>{student.lastname}</div>
                    <div>{student.gradelevelid}</div>
                  </div>
                )}
              </div>
              {editMode && (
                <Button
                  type="primary"
                  onClick={() => {
                    handleDeleteStudent(parseFloat(student.studentid));
                  }}
                >
                  Delete
                </Button>
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
