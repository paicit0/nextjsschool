// classrooms/[classroomid]/page.tsx
"use client";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  GET_CLASSROOM_STUDENTS,
  ADD_STUDENT_TO_CLASSROOM,
  DELETE_STUDENT_FROM_CLASSROOM,
} from "../../graphql/queries";
import { useParams } from "next/navigation";
import { ClassroomData, Student } from "../../types/types";
import { Button } from "antd";
import { useEffect, useState } from "react";

export default function Classroom() {
  const [addStudentId, setAddStudentId] = useState("");
  const params = useParams();
  const classroomid = params.classroomid;
  const classroomIdNum = Number(classroomid);
  const [currentStudentId, setCurrentStudentId] = useState<number | null>(null);

  const { loading, error, data } = useQuery<ClassroomData>(
    GET_CLASSROOM_STUDENTS,
    {
      variables: { id: classroomIdNum },
    }
  );

  const [addStudentToClassroom, { loading: addingStudentToClassroom }] =
    useMutation(ADD_STUDENT_TO_CLASSROOM, {
      refetchQueries: [GET_CLASSROOM_STUDENTS],
      onError: (error) => {
        console.error("Error adding student to classroom:", error);
      },
    });

  const [
    deleteStudentFromClassroom,
    { loading: deletingStudentFromClassroom },
  ] = useMutation(DELETE_STUDENT_FROM_CLASSROOM, {
    refetchQueries: [GET_CLASSROOM_STUDENTS],
    onError: (error) => {
      console.error("Error deleting student from classroom:", error);
    },
  });

  useEffect(() => {
    console.log("GraphQL data:", data);
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const classroom = data?.findClassroom;
  const students = classroom?.students || [];

  const handleAddStudentToClassroom = (
    studentid: string,
    classroomid: number
  ) => {
    console.log("Adding student to classroom:", { studentid, classroomid });
    addStudentToClassroom({
      variables: {
        studentid: Number(studentid),
        classroomid: Number(classroomid),
      },
    });
  };

  const handleDeleteStudentFromClassroom = (
    studentid: string,
    classroomid: string
  ) => {
    console.log("Deleting student from classroom:", { studentid, classroomid });
    deleteStudentFromClassroom({
      variables: {
        studentid: Number(studentid),
        classroomid: Number(classroomid),
      },
    });
  };

  return (
    <>
      <div>ClassroomId: {classroomIdNum}</div>
      <div>

        <h2>เลขห้อง: {classroom?.classroom}</h2>
        <h2>ชื่อห้อง: {classroom?.room_name}</h2>
        <p>Teacher: {classroom?.homeroom_teacher}</p>
        <h3>Student count: {students.length}</h3>
        {students.length > 0 ? (
          <ul>
            {students.map((student: any) =>
              currentStudentId === student.studentid ? (
                <div className="flex flex-row" key={student.studentid}>
                  <li>
                    StudentID: {student.studentid} First Name:{" "}
                    {student.firstname}
                    Last Name: {student.lastname}
                    Classroom:{student.classroomid}
                  </li>
                  <Button onClick={() => setCurrentStudentId(null)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() =>
                      handleDeleteStudentFromClassroom(
                        student.studentid,
                        classroomIdNum.toString()
                      )
                    }
                  >
                    Delete
                  </Button>
                </div>
              ) : (
                <div className="flex flex-row" key={student.studentid}>
                  <li>
                    StudentID: {student.studentid} First Name:
                    {student.firstname}
                    Last Name: {student.lastname}
                  </li>
                  <Button
                    onClick={() => setCurrentStudentId(student.studentid)}
                  >
                    Edit
                  </Button>
                </div>
              )
            )}
          </ul>
        ) : (
          <p>No students found</p>
        )}

        <input
          type="text"
          placeholder="Student ID"
          id="studentid"
          value={addStudentId}
          onChange={(e) => setAddStudentId(e.target.value)}
        />
        <Button
          onClick={() => {
            handleAddStudentToClassroom(addStudentId, classroomIdNum);
          }}
        >
          Add Student
        </Button>
      </div>
    </>
  );
}
