import { User } from "../redux/types/actionTypes";

export const mapUserIdsToAvatarIds = (userArray: User[], idArray: number[]): number[] => {
    return idArray.map(id => {
      const user = userArray.find(user => user.userId === id.toString());
      
      if (user && user.avatarId && user.avatarId !== "null") {
        return parseInt(user.avatarId, 10);
      }
  
      return 0;
    });
  };
  