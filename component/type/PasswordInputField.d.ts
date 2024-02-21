import { TextInputProps } from "react-native";

interface PasswordInputFieldProps {
  placeHolder: string;
  isValid: boolean;
  textInputConfig?: TextInputProps;
  value?: string;
  customError?: string;
}

export default PasswordInputFieldProps;
