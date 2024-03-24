export const formatDateInUserInformation = (dateString: string) => {
  if (!dateString) {
    return "Ngày sinh chưa xác định";
  }
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
