import { useState } from "react";

const useQuantityInput = (validateValue , initialValue,productName,quantitySetterInOrder) => {
  const [enteredValue, setEnteredValue] = useState(initialValue);
  const [isTouched, setIsTouched] = useState(false);

  const valueIsValid = validateValue(enteredValue);
  const hasError = !valueIsValid && isTouched;

  const valueChangeHandler = (event) => {
    setEnteredValue(event.target.value);
    quantitySetterInOrder(productName,event.target.value);
  };

  const inputBlurHandler = (event) => {
    setIsTouched(true);
  };


  return {
    value: enteredValue,
    isValid: valueIsValid,
    hasError: hasError,
    valueChangeHandler,
    inputBlurHandler,
  };
};

export default useQuantityInput;
