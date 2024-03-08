import { EventListProps, EventProps } from "../component/shared/RemindEvent";

const mockEventReminder: EventProps[] = [
  {
    time: "08:00",
    name: "Họp phụ huynh cho Bin",
    status: "complete",
  },
  {
    time: "12:00",
    name: "Dẫn Su đi khám răng",
    status: "complete",
  },
  {
    time: "14:00",
    name: "Họp nhóm tại thư viện",
    status: "incomplete",
  },
  {
    time: "18:00",
    name: "Lớp yoga buổi tối",
    status: "pending",
  },
  {
    time: "23:00",
    name: "Lớp yoga buổi tối",
    status: "pending",
  },
];

export default mockEventReminder;
