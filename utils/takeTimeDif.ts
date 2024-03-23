export const getTimeDifference = (lastLogin: string) => {
    if (!lastLogin) {
      return "No recent login";
    }
  
    const lastLoginDate = new Date(lastLogin);
    const now = new Date();
    const timeDiff = now.getTime() - lastLoginDate.getTime();
  
    const minutesDiff = timeDiff / (1000 * 60);
    const hoursDiff = minutesDiff / 60;
  
    if (hoursDiff > 24) {
      return "Trên 1 ngày";
    } else if (hoursDiff < 1) {
      return `${minutesDiff.toFixed(0)} phút trước`;
    } else {
      return `${hoursDiff.toFixed(0)} giờ trước`;
    }
  };