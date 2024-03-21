import EventInfo from "../component/type/EventInfo";

const eventSampleData: EventInfo[] = [
  {
    timeStart: "8:00",
    timeEnd: "9:00",
    task: ["Họp phụ huynh Bin", "Dẫn Su đi chơi"],
  },

  {
    timeStart: "8:30",
    timeEnd: "9:30",
    task: ["Họp phụ huynh Bin"],
  },
  {
    timeStart: "12:00",
    timeEnd: "14:00",
    task: ["Dẫn Su đi khám răng"],
    images: [
      "https://img.freepik.com/free-vector/cute-rabbit-with-duck-working-laptop-cartoon-illustration_56104-471.jpg",
      "https://img.freepik.com/free-photo/cute-ai-generated-cartoon-bunny_23-2150288870.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdkYe42R9zF530Q3WcApmRDpP6YfQ6Ykexa3clwEWlIw&s",
      "https://img.freepik.com/free-vector/cute-crocodile-waving-hand-cartoon-vector-icon-illustration-animal-nature-icon-concept-isolated_138676-6015.jpg?size=626&ext=jpg",
      "https://via.placeholder.com/150",
      "https://via.placeholder.com/150",
    ],
  },
  {
    timeStart: "16:00",
    timeEnd: "18:00",
    task: ["Họp nhóm tại thư viện"],
  },
  {
    timeStart: "23:00",
    timeEnd: "24:00",
    task: ["Lớp yoga buổi tối", "Ăn tối"],
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdkYe42R9zF530Q3WcApmRDpP6YfQ6Ykexa3clwEWlIw&s",
    ],
  },
];

export default eventSampleData;
