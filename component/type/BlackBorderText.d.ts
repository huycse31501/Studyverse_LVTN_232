import { TextInputProps } from "react-native";

interface BlackBorderTextInputFieldProps {
  placeHolder: string;
  required?: boolean;
  isValid: boolean;
  textInputConfig?: TextInputProps;
  value?: string;
  customError?: string;
  isBlackPlaceHolder?: Boolean;
}

export default BlackBorderTextInputFieldProps;
