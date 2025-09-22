// types.ts
export type Student = {
  studentid: string;
  prefixid: number;
  firstname: string;
  lastname: string;
  genderid: number;
  gradelevelid: number;
  classroomid: number;
  prefix: {
    prefixid: number;
    prefixname: string;
  };
  gender: {
    genderid: number;
    gendername: string;
  };
  gradelevel: {
    gradelevelid: number;
    levelname: string;
  };
};

export type GetStudentsResponse = {
  findAllStudents: Student[];
};

export type Classroom = {
  classroomid: string;
  academicyear: number;
  room_name: number;
  homeroom_teacher: string;
  classroom: Student[];
};

export type GetClassroomsResponse = {
  findAllClassrooms: Classroom[];
};
