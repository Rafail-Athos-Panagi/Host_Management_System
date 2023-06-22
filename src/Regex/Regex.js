export const validEmail = new RegExp(
  "^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$"
);
export const validPhoneNumber = new RegExp("^9[97654][0-9]{6}$|^2[23456][0-9]{6}$");

export const validPostal_Zip_Code = new RegExp("^[1-9][0-9]{3}$");

export const validPrice = new RegExp("^[0-9]+|[0-9]+(.)[0-9]{1,4}$");

export const validDescription = new RegExp("^[^<>&]*$"); // Regular expression to disallow HTML tags

export const validPositiveFloat = new RegExp("^(?=.*[1-9])\\d*(?:\\.\\d+)?$"); // Has to be a positive number, can be float if needed

export const notEmpty = new RegExp(".+"); // cant be empty

export const onlyNumbers = new RegExp("^[\\d]*$|^$");

export const onlyLetters = new RegExp("^[a-zA-Z]+$");

export const validPositiveIntegerAllowedEmpty  = new RegExp("^[a-zA-Z1-9]*$|^$"); // Positive integer only but its allowed to be empty(can be used for non required fields)

