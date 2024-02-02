import { TextInputProps } from "react-native";

interface TextInputFieldProps {
  placeHolder: string;
  required?: boolean;
  isValid: boolean;
  textInputConfig?: TextInputProps;
  value?: string;
}

export default TextInputFieldProps;
