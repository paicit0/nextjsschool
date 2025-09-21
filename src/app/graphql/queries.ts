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
      firstname
      lastname
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
      firstname
      lastname
    }
  }
`;