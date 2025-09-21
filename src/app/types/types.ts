export type Student = {
  studentid: string;
  prefixid: number;
  firstname: string;
  lastname: string;
  genderid: string;
  gradelevelid: number;
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