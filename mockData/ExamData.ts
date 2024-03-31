import { ExamProps } from "../component/examRelated/examList";

export const examList: ExamProps[] = [
  {
    name: "Ôn tập tiếng Anh",
    dateStart: "29/03/2024",
    timeStart: "09:42",
    tags: ["Anh văn", "Daily"],
    status: "completed",
    result: "8/10",
  },
  {
    name: "Ôn tập Hóa học",
    dateStart: "29/03/2024",
    timeStart: "08:44",
    tags: ["Toán", "Exam"],
    status: "failed",
    result: "3/10",
  },
  {
    name: "Ôn tập Ngữ văn",
    dateStart: "29/03/20244",
    timeStart: "08:44",
    tags: ["Ngữ văn", "Exam", "Exam"],
    status: "grading",
    result: undefined,
  },
  {
    name: "Ôn tập Toán",
    dateStart: "29/03/2024",
    timeStart: undefined,
    tags: ["Lịch sử", "Daily"],
    status: "pending",
    result: undefined,
  },
];
