const regexVault = {
  phoneNumberValidate: /((09|03|07|08|05)+([0-9]{8})\b)/g,
  DOBValidate: /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[012])\/\d{4}$/,
  emailValidate:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  firstNameValidate: /^[A-Za-z]{1,20}$/,
  lastNameValidate: /^[A-Za-z]{1,20}$/,
  passwordValidate: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,20}$/,
};

export default regexVault;
