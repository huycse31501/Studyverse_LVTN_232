import { TextInputProps } from "react-native";

interface PasswordInputFieldProps {
  placeHolder: string;
  isValid: boolean;
  textInputConfig?: TextInputProps;
  value?: string;
}

export default PasswordInputFieldProps;
