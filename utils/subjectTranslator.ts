const subjectTranslations: { [key: string]: string } = {
  "Toán": "Math",
  "Lý": "Physics",
  "Hóa học": "Chemistry",
  "Ngữ văn": "Literature",
  "Anh văn": "English",
  "Sinh học": "Biology",
};

export function translateSubject(subject: string): string {
  return subjectTranslations[subject] || subject;
}
