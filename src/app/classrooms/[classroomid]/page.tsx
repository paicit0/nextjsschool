// classrooms/[classroomid]/page.tsx
"use client";
import React from "react";
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
import { PlusOutlined } from "@ant-design/icons";

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
    setAddStudentId("");
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
      <div className="min-h-screen bg-gradient-to-br from-black-50 to-white-100 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-sm font-medium opacity-90">
                      รหัส: {classroomIdNum}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold">
                    เลขที่ห้อง: {classroom?.classroom}
                  </h1>
                  <h2 className="text-xl font-medium opacity-90">
                    ชื่อห้อง: {classroom?.room_name}
                  </h2>
                </div>
                <div className="text-right">
                  <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2 backdrop-blur-sm">
                    <div className="text-sm opacity-90 text-black">
                      จำนวนนักเรียน
                    </div>
                    <div className="text-2xl font-bold text-black">
                      {students.length}
                    </div>
                  </div>
                </div>
              </div>

              {classroom?.homeroom_teacher && (
                <div className="mt-4 flex items-center space-x-2 bg-white bg-opacity-10 rounded-lg px-4 py-2 backdrop-blur-sm">
                  <span className="font-medium text-black">
                    ครูประจำชั้น: {classroom?.homeroom_teacher}
                  </span>
                </div>
              )}
            </div>

            <div className="p-8">
              {/* Students List */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  รายชื่อนักเรียนในห้อง
                </h3>

                {students.length > 0 ? (
                  <div className="space-y-4">
                    {students.map((student: any) => (
                      <div
                        className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
                        key={student.studentid}
                      >
                        {currentStudentId === student.studentid ? (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                                รหัส: {student.studentid}
                              </div>
                              <div className="flex items-center space-x-3 text-gray-700">
                                <span className="font-semibold">
                                  {student.firstname}
                                </span>
                                <span className="font-semibold">
                                  {student.lastname}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3">
                              <Button
                                danger
                                onClick={() => {
                                  handleDeleteStudentFromClassroom(
                                    student.studentid,
                                    classroomIdNum.toString()
                                  );
                                  setCurrentStudentId(null);
                                }}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                              >
                                <span>Remove from Class</span>
                              </Button>
                              <Button
                                onClick={() => setCurrentStudentId(null)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200 flex items-center space-x-2"
                              >
                                <span>Cancel</span>
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                                รหัส: {student.studentid}
                              </div>
                              <div className="flex items-center space-x-3">
                                <span className="text-lg font-semibold text-gray-800">
                                  {student.firstname}
                                </span>
                                <span className="text-lg font-semibold text-gray-800">
                                  {student.lastname}
                                </span>
                              </div>
                            </div>

                            <Button
                              onClick={() =>
                                setCurrentStudentId(student.studentid)
                              }
                              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 flex items-center space-x-2"
                            >
                              <span>Manage</span>
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                    <h3 className="text-lg font-medium text-gray-500 mb-2">
                      No students found
                    </h3>
                    <p className="text-gray-400">Add students to get started</p>
                  </div>
                )}
              </div>

              {/* Add Student Section */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-dashed border-green-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  Add Student to Classroom
                </h3>

                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Enter Student ID"
                      id="studentid"
                      value={addStudentId}
                      onChange={(e) => setAddStudentId(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-700 placeholder-gray-400"
                    />
                  </div>

                  <Button
                    type="primary"
                    color="green"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      handleAddStudentToClassroom(addStudentId, classroomIdNum);
                    }}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 flex items-center space-x-2 font-medium whitespace-nowrap"
                  >
                    <span>Add Student</span>
                  </Button>
                  {addingStudentToClassroom && (
                    <p className="text-sm text-gray-500">Adding student...</p>
                  )}
                  {deletingStudentFromClassroom && (
                    <p className="text-sm text-gray-500">Removing student...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
