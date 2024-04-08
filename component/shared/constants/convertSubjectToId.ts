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


export type ConvertIdToSubjectType = {
  [key: number]: string;
};

export const convertIdToSubject: ConvertIdToSubjectType = {
  1: 'Toán',
  2: 'Ngữ văn',
  3: 'Anh văn',
  4: 'Lý',
  5: 'Hóa học',
  6: 'Sinh học',
  7: 'Lịch sử',
  8: 'Địa lý',
  9: 'Âm nhạc',
  10: 'GDCD',
  11: 'Thể dục',
  12: 'GDQP',
  13: 'Hằng ngày',
  14: 'Kiểm tra'
};
export function convertSubjectsToIds(subjects: string[]): number[] {
  return subjects.map((subject) => convertSubjectToId[subject]);
}

export function convertIdsToSubjects(ids: number[]): string[] {
  return ids.map((id) => convertIdToSubject[id]);
}