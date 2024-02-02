import { TextInputProps } from "react-native";

interface DateInputFieldProps {
  placeHolder: string;
  required?: boolean;
  isValid: boolean;
  textInputConfig?: TextInputProps;
    dateStr?: string;
}

export default DateInputFieldProps;
