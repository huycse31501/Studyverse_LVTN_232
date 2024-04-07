export type ConvertSubjectToIdType = {
  [key: string]: number;
};

export const convertSubjectToId: ConvertSubjectToIdType  = {
    'Toán': 1,
    'Ngữ văn': 2,
    'Anh văn': 3,
    'Lý': 4,
    'Hóa học': 5,
    'Sinh học': 6,
    'Lịch sử': 7,
    'Địa lý': 8,
    'Âm nhạc': 9,
    'GDCD': 10,
    'Thể dục': 11,
    'GDQP': 12,
    'Hằng ngày': 13, 
    'Kiểm tra': 14
};
  
export function convertSubjectsToIds(subjects: string[]): number[] {
  return subjects.map((subject) => convertSubjectToId[subject]);
}