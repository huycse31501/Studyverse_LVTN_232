import { TextInputProps } from "react-native";

interface DateInputFieldProps {
  placeHolder: string;
  required?: boolean;
  isValid: boolean;
  textInputConfig?: TextInputProps;
  dateStr?: string;
  signUpType: OptionType;
}

export default DateInputFieldProps;
