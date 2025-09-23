// queries.ts
import { gql } from "@apollo/client";

export const GET_STUDENTS = gql`
  query GetStudents {
    findAllStudents {
      studentid
      prefixid
      firstname
      lastname
      genderid
      gradelevelid
      classroomid
      prefix {
        prefixid
        prefixname
      }
      gender {
        genderid
        gendername
      }
      gradelevel {
        gradelevelid
        levelname
      }
    }
  }
`;

export const ADD_STUDENT = gql`
  mutation CreateStudent($createStudentInput: CreateStudentInput!) {
    createStudent(createStudentInput: $createStudentInput) {
      prefixid
      firstname
      lastname
      genderid
      gradelevelid
    }
  }
`;

export const DELETE_STUDENT = gql`
  mutation DeleteStudent($studentid: Float!) {
    deleteStudent(studentid: $studentid)
  }
`;

export const UPDATE_STUDENT = gql`
  mutation UpdateStudent($updateStudentInput: UpdateStudentInput!) {
    updateStudent(updateStudentInput: $updateStudentInput) {
      studentid
      prefixid
      firstname
      lastname
      genderid
      gradelevelid
      classroomid
    }
  }
`;

export const GET_CLASSROOMS = gql`
  query GetClassrooms {
    findAllClassrooms {
      classroomid
      academicyear
      room_name
      homeroom_teacher
      classroom
    }
  }
`;

export const ADD_CLASSROOM = gql`
  mutation CreateClassroom($createClassroomInput: CreateClassroomInput!) {
    createClassroom(createClassroomInput: $createClassroomInput) {
      academicyear
      room_name
      homeroom_teacher
      classroom
    }
  }
`;

export const DELETE_CLASSROOM = gql`
  mutation DeleteClassroom($classroomid: Float!) {
    deleteClassroom(classroomid: $classroomid)
  }
`;

export const UPDATE_CLASSROOM = gql`
  mutation UpdateClassroom($updateClassroomInput: UpdateClassroomInput!) {
    updateClassroom(updateClassroomInput: $updateClassroomInput) {
      classroomid
      academicyear
      room_name
      homeroom_teacher
      classroom
    }
  }
`;

export const GET_CLASSROOM_STUDENTS = gql`
  query GetClassroomAndStudents($id: Float!) {
    findClassroom(classroomid: $id) {
      classroomid
      academicyear
      classroom
      room_name
      homeroom_teacher
      students {
        studentid
        firstname
        lastname
        gradelevel {
          levelname
        }
      }
    }
  }
`;

export const ADD_STUDENT_TO_CLASSROOM = gql`
  mutation AddStudentToClassroom($studentid: Float!, $classroomid: Float!) {
    addStudentToClassroom(studentid: $studentid, classroomid: $classroomid) {
      student_classroom_id
      studentid
      classroomid
    }
  }
`;
export const DELETE_STUDENT_FROM_CLASSROOM = gql`
  mutation RemoveStudentFromClassroom(
    $studentid: Float!
    $classroomid: Float!
  ) {
    removeStudentFromClassroom(studentid: $studentid, classroomid: $classroomid)
  }
`;
