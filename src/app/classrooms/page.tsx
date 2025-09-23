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
      <div className="flex flex-col justify-center align-items-center">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 px-3 py-2 border rounded"
        />

        <div>
          {filteredClassrooms.map((classroom) => (
            <div className="flex flex-row mb-2" key={classroom.classroomid}>
              <div className="flex flex-row gap-5">
                <div>รหัส {classroom.classroomid} </div>
              </div>

              {currentClassroom?.classroomid === classroom.classroomid ? (
                <>
                  <div className="flex flex-row gap-5">
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
                      className="px-2 py-1 border rounded"
                    />
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
                      className="px-2 py-1 border rounded"
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
                      className="px-2 py-1 border rounded"
                    />
                  </div>
                  <Button onClick={() => handleCancelEdit()}>Cancel</Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      handleUpdateClassroom(currentClassroom);
                    }}
                  >
                    Update
                  </Button>
                  <Button
                    type="primary"
                    danger
                    onClick={() => {
                      handleDeleteClassroom(parseInt(classroom.classroomid));
                    }}
                  >
                    Delete
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex flex-row gap-5">
                    <div>ปีการศึกษา: {classroom.academicyear}</div>
                    <div>เลขที่ห้อง: {classroom.classroom}</div>
                    <div>ชื่อห้อง: {classroom.room_name}</div>
                    <div>
                      ครูประจำชั้น: {classroom.homeroom_teacher || "ไม่ระบุ"}
                    </div>
                    {/* <div>จำนวนนักเรียน: {classroom.classroom?.length || 0}</div> */}
                  </div>
                  <Link href={"/classrooms/" + classroom.classroomid}>
                    <Button>View</Button>
                  </Link>

                  <Button
                    type="primary"
                    onClick={() => {
                      setCurrentClassroom(classroom);
                    }}
                  >
                    Edit
                  </Button>
                </>
              )}
            </div>
          ))}
          <div className="mt-4 flex flex-row gap-2">
            <input
              type="number"
              placeholder="Academic Year"
              value={newClassroom.academicyear}
              onChange={(e) =>
                setNewClassroom({
                  ...newClassroom,
                  academicyear:
                    parseInt(e.target.value) || new Date().getFullYear() + 543,
                })
              }
              className="px-2 py-1 border rounded"
            />
            <div>เลขที่ห้อง</div>
            <select
              value={newClassroom.classroom}
              onChange={(e) =>
                setNewClassroom({
                  ...newClassroom,
                  classroom: parseInt(e.target.value),
                })
              }
              className="px-2 py-1 border rounded"
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
            <div>ชื่อห้อง</div>
            <select
              value={newClassroom.room_name}
              onChange={(e) =>
                setNewClassroom({
                  ...newClassroom,
                  room_name: parseInt(e.target.value),
                })
              }
              className="px-2 py-1 border rounded"
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
              className="px-2 py-1 border rounded"
            />
            <Button
              onClick={() => handleAddClassroom(newClassroom)}
              disabled={!newClassroom.homeroom_teacher}
            >
              Add
            </Button>
          </div>
          {addingClassroom && <p>Adding classroom...</p>}
        </div>
      </div>
    </>
  );
}
