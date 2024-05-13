export const getTimeDifference = (lastLogin: string, isEnglishEnabled: any) => {
  if (!lastLogin) {
    return "No recent login";
  }

  const lastLoginDate = new Date(lastLogin);
  const now = new Date();
  const timeDiff = now.getTime() - lastLoginDate.getTime();

  const minutesDiff = timeDiff / (1000 * 60);
  const hoursDiff = minutesDiff / 60;

  if (hoursDiff > 24) {
    return isEnglishEnabled ? "More than a day" : "Trên 1 ngày";
  } else if (hoursDiff < 1) {
    return isEnglishEnabled
      ? `${minutesDiff.toFixed(0)} minutes ago`
      : `${minutesDiff.toFixed(0)} phút trước`;
  } else {
    return isEnglishEnabled
      ? `${hoursDiff.toFixed(0)} minutes ago`
      : `${hoursDiff.toFixed(0)} giờ trước`;
  }
};
