SELECT
  gradelevel.levelname,
  student.classroomid,
  gender.gendername,
  COUNT(student.studentid) AS total_students
FROM
  student
INNER JOIN
  gradelevel ON student.gradelevelid = gradelevel.gradelevelid
INNER JOIN
  gender ON student.genderid = gender.genderid
GROUP BY
  gradelevel.levelname,
  student.classroomid,
  gender.gendername
ORDER BY
  gradelevel.levelname,
  student.classroomid,
  gender.gendername;