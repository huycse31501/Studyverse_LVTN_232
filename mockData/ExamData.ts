import { ExamProps } from "../component/examRelated/examList";

export const examList: ExamProps[] = [
  {
    name: "Ôn tập tiếng Anh",
    dateStart: "29/03/2024",
    timeStart: "09:42",
    tags: ["Anh văn", "Hằng ngày"],
    status: "completed",
    result: "8/10",
  },
  {
    name: "Ôn tập Hóa học",
    dateStart: "29/03/2024",
    timeStart: "08:44",
    tags: ["Toán", "Kiểm tra"],
    status: "failed",
    result: "3/10",
  },
  {
    name: "Ôn tập Ngữ văn",
    dateStart: "29/03/2024",
    timeStart: "08:44",
    tags: ["Ngữ văn", "Kiểm tra", "Kiểm tra"],
    status: "grading",
    result: undefined,
  },
  {
    name: "Ôn tập Toán",
    dateStart: "29/03/2024",
    timeStart: undefined,
    tags: ["Lịch sử", "Hằng ngày"],
    status: "pending",
    result: undefined,
  },
];
