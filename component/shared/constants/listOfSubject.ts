import { ImageSourcePropType } from "react-native";

interface LogoMap {
  [key: string]: ImageSourcePropType;
}

const MathIcon = require("../../../assets/images/courseLogo/Math.png");
const PhysicsIcon = require("../../../assets/images/courseLogo/Physics.png");
const BiologyIcon = require("../../../assets/images/courseLogo/Biology.png");
const ChemistryIcon = require("../../../assets/images/courseLogo/Chemistry.png");
const EnglishIcon = require("../../../assets/images/courseLogo/English.png");
const LiteratureIcon = require("../../../assets/images/courseLogo/Literature.png");

export const listOfSubjectTags = {
  "1": "Toán",
  "2": "Lý",
  "3": "Hóa",
  "4": "Anh",
  "000": "Daily",
  "111": "Exam",
};

export const logoMap: LogoMap = {
  "Toán": MathIcon,
  "Lý": PhysicsIcon,
  "Hóa học": ChemistryIcon,
  "Ngữ văn": LiteratureIcon,
  "Anh văn": EnglishIcon,
  "Sinh học": BiologyIcon,
};
