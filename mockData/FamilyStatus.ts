import { FamilyStatus } from "../component/dashboard/FamilyStatus";

const avatar1 = require("../assets/images/dashboard/avatar-1.png");
const avatar2 = require("../assets/images/dashboard/avatar-2.png");
const avatar3 = require("../assets/images/dashboard/avatar-3.png");

export const userStatusData: FamilyStatus[] = [
  {
    name: "Mai Anh",
    status: "Đang học anh văn",
    avatarUri: avatar1,
    currentStatus: "onl",
  },
  {
    name: "Bố Panda",
    status: "Đang họp",
    avatarUri: avatar2,
    lastOnline: "15 phút trước",
    currentStatus: "busy",
  },
  {
    name: "Anh cá sấu",
    status: "Đang học bơi",
    avatarUri: avatar3,
    lastOnline: "30 phút trước",
    currentStatus: "busy",
  },
];
