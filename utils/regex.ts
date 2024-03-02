const regexVault = {
  phoneNumberValidate: /^0[35789]\d{8}$/,
  DOBValidate: /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[012])\/\d{4}$/,
  emailValidate:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  firstNameValidate: /^[A-Za-z]{2,20}$/,
  lastNameValidate: /^[A-Za-z]{2,20}$/,
  fullNameValidate: /^[A-Za-z]{8,20}$/,
  passwordValidate: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,20}$/,
};

export default regexVault;
