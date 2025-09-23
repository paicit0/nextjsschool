// classrooms/page.tsx
"use client";
import { useState, useEffect } from "react";
import { Button } from "antd";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  ADD_CLASSROOM,
  DELETE_CLASSROOM,
  GET_CLASSROOMS,
  UPDATE_CLASSROOM,
} from "../graphql/queries";
import { Classroom, GetClassroomsResponse } from "../types/types";
import Link from "next/link";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";

export default function Classrooms() {
  const [search, setSearch] = useState("");
  const [newClassroom, setNewClassroom] = useState<{
    academicyear: number;
    room_name: number;
    homeroom_teacher: string;
    classroom: number;
  }>({
    academicyear: new Date().getFullYear(),
    room_name: 1,
    homeroom_teacher: "",
    classroom: 0,
  });
  const [currentClassroom, setCurrentClassroom] = useState<Classroom | null>(
    null
  );
  const [filteredClassrooms, setFilteredClassrooms] = useState<Classroom[]>([]);

  const { loading, error, data } =
    useQuery<GetClassroomsResponse>(GET_CLASSROOMS);

  const [createClassroom, { loading: addingClassroom }] = useMutation(
    ADD_CLASSROOM,
    {
      refetchQueries: [GET_CLASSROOMS],
      onError: (error) => {
        console.error("Error adding classroom:", error);
      },
    }
  );

  const [deleteClassroom, { loading: deletingClassroom }] = useMutation(
    DELETE_CLASSROOM,
    {
      refetchQueries: [GET_CLASSROOMS],
      onError: (error) => {
        console.error("Error deleting classroom:", error);
      },
    }
  );
  const [updateClassroom, { loading: updatingClassroom }] = useMutation(
    UPDATE_CLASSROOM,
    {
      refetchQueries: [GET_CLASSROOMS],
      onError: (error) => {
        console.error("Error updating classroom:", error);
      },
    }
  );

  useEffect(() => {
    if (data?.findAllClassrooms) {
      const classrooms = data.findAllClassrooms;
      console.log("Fetched classrooms:", classrooms);

      if (search) {
        const filtered = classrooms.filter(
          (classroom) =>
            classroom.classroomid.toString().startsWith(search) ||
            classroom.classroom.toString().includes(search) ||
            classroom.academicyear.toString().includes(search) ||
            classroom.room_name.toString().includes(search) ||
            classroom.homeroom_teacher
              .toLowerCase()
              .includes(search.toLowerCase())
        );
        setFilteredClassrooms(filtered);
      } else {
        setFilteredClassrooms(classrooms);
      }
    }
  }, [data, search]);

  useEffect(() => {
    console.log("currentclassroom:", currentClassroom);
  }, [currentClassroom]);

  const handleAddClassroom = ({
    academicyear,
    room_name,
    homeroom_teacher,
    classroom,
  }: {
    academicyear: number;
    room_name: number;
    homeroom_teacher: string;
    classroom: number;
  }) => {
    console.log("Adding classroom:", {
      academicyear,
      room_name,
      homeroom_teacher,
      classroom,
    });
    createClassroom({
      variables: {
        createClassroomInput: {
          academicyear,
          room_name,
          homeroom_teacher,
          classroom,
        },
      },
    });
    setNewClassroom({
      academicyear: new Date().getFullYear(),
      room_name: 1,
      homeroom_teacher: "",
      classroom: 0,
    });
  };

  const handleDeleteClassroom = (classroomId: number) => {
    console.log("Deleting classroom with ID:", classroomId);
    deleteClassroom({
      variables: { classroomid: classroomId },
    });
  };

  const handleUpdateClassroom = (classroom: Classroom) => {
    console.log("Updating classroom:", classroom);
    updateClassroom({
      variables: {
        updateClassroomInput: {
          classroomid: parseInt(classroom.classroomid),
          academicyear: classroom.academicyear,
          classroom: classroom.classroom,
          room_name: classroom.room_name,
          homeroom_teacher: classroom.homeroom_teacher,
        },
      },
    });
    setCurrentClassroom(null);
  };

  const handleCancelEdit = () => {
    setCurrentClassroom(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data || !data.findAllClassrooms) {
    return <p>No classroom data found.</p>;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Classroom Management
            </h1>

            <div className="mb-8 flex justify-center">
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder="Search classrooms..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-3 pl-12  text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
                <div className="absolute inset-y-0 left-2 flex items-center pl-3 pointer-events-none text-gray-400">
                  <SearchOutlined />
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {filteredClassrooms.map((classroom) => (
                <div
                  className="flex flex-col md:flex-row items-center justify-between p-4 mb-4 bg-white rounded-lg shadow-md"
                  key={classroom.classroomid}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:gap-6 w-full md:w-auto mb-2 md:mb-0">
                    <div className="bg-blue-100 text-blue-800 px-2 py-2 rounded-full text-sm whitespace-nowrap">
                      รหัส {classroom.classroomid}
                    </div>
                    {currentClassroom?.classroomid === classroom.classroomid ? (
                      <div className="flex flex-col md:flex-row md:items-center md:gap-4 mt-2 md:mt-0 w-full">
                        <input
                          type="number"
                          value={currentClassroom.academicyear}
                          onChange={(e) => {
                            const updatedClassroom = {
                              ...currentClassroom,
                              academicyear: parseInt(e.target.value),
                            };
                            setCurrentClassroom(updatedClassroom);
                          }}
                          placeholder="Academic Year"
                          className="px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full md:w-auto"
                        />
                        <div className="text-sm text-gray-500 mt-2 md:mt-0">
                          เลขที่ห้อง:
                        </div>
                        <select
                          id="classroom"
                          name="classroom"
                          value={currentClassroom.classroom}
                          onChange={(e) => {
                            const updatedClassroom = {
                              ...currentClassroom,
                              classroom: parseInt(e.target.value),
                            };
                            setCurrentClassroom(updatedClassroom);
                          }}
                          className="px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full md:w-auto"
                        >
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="7">7</option>
                          <option value="8">8</option>
                          <option value="9">9</option>
                        </select>
                        <div className="text-sm text-gray-500 mt-2 md:mt-0">
                          ชื่อห้อง:
                        </div>
                        <select
                          id="room_name"
                          name="room_name"
                          value={currentClassroom.room_name}
                          onChange={(e) => {
                            const updatedClassroom = {
                              ...currentClassroom,
                              room_name: parseInt(e.target.value),
                            };
                            setCurrentClassroom(updatedClassroom);
                          }}
                          className="px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full md:w-auto"
                        >
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="7">7</option>
                          <option value="8">8</option>
                          <option value="9">9</option>
                        </select>
                        <input
                          type="text"
                          value={currentClassroom.homeroom_teacher}
                          onChange={(e) => {
                            const updatedClassroom = {
                              ...currentClassroom,
                              homeroom_teacher: e.target.value,
                            };
                            setCurrentClassroom(updatedClassroom);
                          }}
                          placeholder="Homeroom Teacher"
                          className="px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full md:w-auto"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col md:flex-row md:items-center md:gap-6 mt-2 md:mt-0 text-gray-600">
                        <div>
                          ปีการศึกษา:{" "}
                          <span className="font-medium">
                            {classroom.academicyear}
                          </span>
                        </div>
                        <div>
                          เลขที่ห้อง:{" "}
                          <span className="font-medium">
                            {classroom.classroom}
                          </span>
                        </div>
                        <div>
                          ชื่อห้อง:{" "}
                          <span className="font-medium">
                            {classroom.room_name}
                          </span>
                        </div>
                        <div>
                          ครูประจำชั้น:{" "}
                          <span className="font-medium">
                            {classroom.homeroom_teacher || "ไม่ระบุ"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-row gap-2 mt-4 md:mt-0">
                    {currentClassroom?.classroomid === classroom.classroomid ? (
                      <>
                        <Button
                          type="primary"
                          onClick={() => {
                            handleUpdateClassroom(currentClassroom);
                          }}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                        >
                          Update
                        </Button>
                        <Button
                          type="primary"
                          danger
                          onClick={() => {
                            handleDeleteClassroom(
                              parseInt(classroom.classroomid)
                            );
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                        >
                          Delete
                        </Button>
                        <Button
                          onClick={() => handleCancelEdit()}
                          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link href={"/classrooms/" + classroom.classroomid}>
                          <Button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                            View
                          </Button>
                        </Link>

                        <Button
                          type="primary"
                          onClick={() => {
                            setCurrentClassroom(classroom);
                          }}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
                        >
                          Edit
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border-2 border-dashed border-gray-300">
                <div className="flex flex-wrap items-center gap-4">
                  <input
                    type="number"
                    placeholder="Academic Year"
                    value={newClassroom.academicyear}
                    onChange={(e) =>
                      setNewClassroom({
                        ...newClassroom,
                        academicyear:
                          parseInt(e.target.value) ||
                          new Date().getFullYear() + 543,
                      })
                    }
                    className="px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full md:w-auto mb-2 md:mb-0"
                  />
                  <div className="text-sm text-gray-500">เลขที่ห้อง</div>
                  <select
                    value={newClassroom.classroom}
                    onChange={(e) =>
                      setNewClassroom({
                        ...newClassroom,
                        classroom: parseInt(e.target.value),
                      })
                    }
                    className="px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full md:w-auto mb-2 md:mb-0"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                  </select>
                  <div className="text-sm text-gray-500">ชื่อห้อง</div>
                  <select
                    value={newClassroom.room_name}
                    onChange={(e) =>
                      setNewClassroom({
                        ...newClassroom,
                        room_name: parseInt(e.target.value),
                      })
                    }
                    className="px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full md:w-auto mb-2 md:mb-0"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Homeroom Teacher"
                    value={newClassroom.homeroom_teacher}
                    onChange={(e) =>
                      setNewClassroom({
                        ...newClassroom,
                        homeroom_teacher: e.target.value,
                      })
                    }
                    className="px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full md:w-auto mb-2 md:mb-0"
                  />
                  <Button
                    type="primary"
                    color="green"
                    icon={<PlusOutlined />}
                    onClick={() => handleAddClassroom(newClassroom)}
                    disabled={!newClassroom.homeroom_teacher || addingClassroom}
                    className=" text-white font-bold py-2 px-4 rounded disabled:bg-gray-400 disabled:cursor-not-allowed w-full md:w-auto"
                  >
                    Add Classroom
                  </Button>
                </div>
              </div>
              {addingClassroom && (
                <p className="text-center mt-4 text-gray-500">
                  Adding classroom...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
