const parseStringToDate = (dateStr: string): Date => {
  // Bạn cần thay đổi logic phân tích cú pháp này sao cho phù hợp với định dạng ngày tháng của bạn
  const parts = dateStr.split("/");
  const year = parseInt(parts[2], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[0], 10);
  const parsedDate = new Date(year, month, day);
  return parsedDate;
};

export default parseStringToDate;
