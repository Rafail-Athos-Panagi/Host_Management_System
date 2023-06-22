import React, { useContext, useEffect, useState } from 'react';
import Box from "@mui/material/Box";
import InputText from "../UI/Input/InputText";
import Button from "@mui/material/Button";
import useInput from '../../hooks/use-input';
import ChildModal from '../UI/Modal/ChildModal';
import { validPositiveFloat, notEmpty, validPhoneNumber, validPostal_Zip_Code , onlyLetters,validEmail} from "../../Regex/Regex";
import logging from '../../hooks/logging-hook';
import Username from '../../hooks/user-context';
import Swal from 'sweetalert2';
import InputSelect from '../UI/Input/InputSelect';

export default function AddStaff({ handleClose }) {

  const [openModal, setOpenModal] = useState(false);
  const [modalInformation, setModalInformation] = useState([]);
  const { username } = useContext(Username);

  const isValidEmail = (value) => validEmail.test(value);
  const isNotEmpty = (value) => notEmpty.test(value);
  const isPositiveNumber = (value) => validPositiveFloat.test(value);
  const validPN = (value) => validPhoneNumber.test(value);
  const validPostalCode = (value) => validPostal_Zip_Code.test(value);
  const isNotLetter = (value) => onlyLetters.test(value);

  const {
    value: firstNameValue,
    isValid: firstNameIsValid,
    hasError: firstNameHasError,
    valueChangeHandler: firstNameChangeHandler,
    inputBlurHandler: firstNameBlurHandler,
    reset: resetFirstName,
  } = useInput(isNotEmpty && isNotLetter);

  const {
    value: lastNameValue,
    isValid: lastNameIsValid,
    hasError: lastNameHasError,
    valueChangeHandler: lastNameChangeHandler,
    inputBlurHandler: lastNameBlurHandler,
    reset: resetLastName,
  } = useInput(isNotEmpty && isNotLetter);

  const {
    value: dateOfBirthValue,
    isValid: dateOfBirthIsValid,
    hasError: dateOfBirthHasError,
    valueChangeHandler: dateOfBirthChangeHandler,
    inputBlurHandler: dateOfBirthBlurHandler,
    reset: resetDateOfBirth,
  } = useInput(isNotEmpty);

  const {
    value: identidyCardValue,
    isValid: identidyCardIsValid,
    hasError: identidyCardHasError,
    valueChangeHandler: identidyCardChangeHandler,
    inputBlurHandler: identidyCardBlurHandler,
    reset: resetIdentidyCard,
  } = useInput(isNotEmpty);

  const {
    value: SocialSNValue,
    isValid: SocialSNIsValid,
    hasError: SocialSNHasError,
    valueChangeHandler: SocialSNChangeHandler,
    inputBlurHandler: SocialSNBlurHandler,
    reset: resetSocialSN,
  } = useInput(isNotEmpty);

  const {
    value: streetNameValue,
    isValid: streetNameIsValid,
    hasError: streetNameHasError,
    valueChangeHandler: streetNameChangeHandler,
    inputBlurHandler: streetNameBlurHandler,
    reset: resetStreetName,
  } = useInput(isNotEmpty);

  const {
    value: streetNumberValue,
    isValid: streetNumberIsValid,
    hasError: streetNumberHasError,
    valueChangeHandler: streetNumberChangeHandler,
    inputBlurHandler: streetNumberBlurHandler,
    reset: resetStreetNumber,
  } = useInput(isPositiveNumber);

  const {
    value: cityValue,
    isValid: cityIsValid,
    hasError: cityHasError,
    valueChangeHandler: cityChangeHandler,
    inputBlurHandler: cityBlurHandler,
    reset: resetCity,
  } = useInput(isNotEmpty);

  const {
    value: startDateValue,
    isValid: startDataeIsValid,
    hasError: startDateHasError,
    valueChangeHandler: startDateChangeHandler,
    inputBlurHandler: startDateBlurHandler,
    reset: resetStartDate,
  } = useInput(isNotEmpty);

  const {
    value: staffEmailValue,
    isValid: staffEmailIsValid,
    hasError: staffEmailHasError,
    valueChangeHandler: staffEmailChangeHandler,
    inputBlurHandler: staffEmailBlurHandler,
    reset: resetStaffEmail,
  } = useInput(isValidEmail);

  const {
    value: phoneNumberValue,
    isValid: phoneNumberIsValid,
    hasError: phoneNumberHasError,
    valueChangeHandler: phoneNumberChangeHandler,
    inputBlurHandler: phoneNumberBlurHandler,
    reset: resetPhoneNumber,
  } = useInput(isNotEmpty);

  const {
    value: postalCodeValue,
    isValid: postalCodeIsValid,
    hasError: postalCodeHasError,
    valueChangeHandler: postalCodeChangeHandler,
    inputBlurHandler: postalCodeBlurHandler,
    reset: resetPostalCode,
  } = useInput(validPostalCode);

  useEffect(() => {
    const updatedModalInformation = {
      FirstName: firstNameValue,
      LastName: lastNameValue,
      DateOfBirth: dateOfBirthValue,
      ID: identidyCardValue,
      SocialSecurityNumber: SocialSNValue,
      StreetName: streetNameValue,
      StreetNumber: streetNumberValue,
      City: cityValue,
      PostalCode: postalCodeValue,
      StartDate: startDateValue,
      PhoneNumber: phoneNumberValue,
      Email: staffEmailValue
    }
    setModalInformation(updatedModalInformation);
  }, [firstNameValue, lastNameValue, dateOfBirthValue, identidyCardValue, SocialSNValue, streetNameValue, streetNumberValue, cityValue, postalCodeValue, startDateValue, phoneNumberValue, staffEmailValue]);


  let formIsValid;

  if (firstNameIsValid && lastNameIsValid && dateOfBirthIsValid && identidyCardIsValid && SocialSNIsValid && streetNameIsValid
    && streetNumberIsValid && cityIsValid && postalCodeIsValid && startDataeIsValid && phoneNumberIsValid && staffEmailIsValid) {
    formIsValid = true;
  }

  const formSubmissionHandler = async event => {
    event.preventDefault();
    Swal.fire({
      title: 'Are you sure you want to add this staff member?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        addToDatabase();
        
      }
    });
    if (!formIsValid) {
      return;
    }

  };
  const addToDatabase = async () => {
    try {
      const request = {
        method: "post",
        credentials: "include", 
        mode: "cors", redirect: "follow",

        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: "staff(staffName,staffSurname,staffPhoneNumber,staffEmail,staffDateOfBirth,staffIDNumber,staffSocialSecurityNumber,staffStreetNumber,staffStreetName,staffCity,staffPostalCode,startDate)",
          values: `("${firstNameValue}","${lastNameValue}",${phoneNumberValue},"${staffEmailValue}","${dateOfBirthValue}","${identidyCardValue}","${SocialSNValue}",${streetNumberValue},"${streetNameValue}","${cityValue}",${postalCodeValue},"${startDateValue}")`
        }),
      };
      const res = await fetch(`/api/insert`, request);
      const data = await res.json()

      if (data.sqlMessage){
        console.log(data.sqlMessage);
        Swal.fire({
          title: 'Error!',
          text: data.sqlMessage,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
      else{
        const request = {
          method: "post",
          credentials: "include", 
          mode: "cors", redirect: "follow",
  
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            table: "shift_scheduling (staffID, staffName, staffSurname)",
            values: `(${data.insertID},"${firstNameValue}","${lastNameValue}")`
          }),
        };
        await fetch(`/api/insert`, request);
  
        logging(`${username}`, "Insert", `${data.insertID}`, "staff",`Added new staff member: ${firstNameValue} ${lastNameValue}`);  
        Swal.fire({
          title: 'Staff member added successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        }); 
      }
    }
    catch (error) {
      console.error(error)
    }

    resetFirstName("");
    resetLastName("");
    resetDateOfBirth("");
    resetIdentidyCard("");
    resetSocialSN("");
    resetStreetName("");
    resetStreetNumber("");
    resetCity("");
    resetPostalCode("");
    resetStartDate("");
    resetPhoneNumber("");
    resetStaffEmail("");
    resetOpenModal();
  };

  const resetOpenModal = () => {
    setOpenModal(false);
  };

  return (
    <Box component="form" sx={{
      '& .MuiTextField-root': { m: 1 },
    }}
      noValidate
      autoComplete="off"
      onSubmit={formSubmissionHandler}>

      <h2 style={{ marginBottom: "20px" }}>Add new staff member</h2>
      <hr />
      <div style={{ scrollBehavior: "smooth", overflowY: "auto", maxHeight: "500px", paddingRight: "20px" }}>
        <div style={{ display: "flex" }}>
          <InputText
            required={true}
            id="staffFirstName"
            label="First name"
            onChange={firstNameChangeHandler}
            onBlur={firstNameBlurHandler}
            hasError={firstNameHasError}
            value={firstNameValue}
          />
          <InputText
            required={true}
            id="staffLastName"
            label="Last name"
            onChange={lastNameChangeHandler}
            onBlur={lastNameBlurHandler}
            hasError={lastNameHasError}
            value={lastNameValue}
          />
        </div>
        <div style={{ display: "flex" }}>
          <InputText
            required={true}
            type="date"
            id="staffDateOfBirth"
            label="Date of Birth"
            onChange={dateOfBirthChangeHandler}
            onBlur={dateOfBirthBlurHandler}
            hasError={dateOfBirthHasError}
            value={dateOfBirthValue}
          />
          <InputText
            required={true}
            type="number"
            id="staffPhoneNumber"
            label="Phone Number"
            onChange={phoneNumberChangeHandler}
            onBlur={phoneNumberBlurHandler}
            hasError={phoneNumberHasError}
            value={phoneNumberValue} />
        </div>
        <div style={{ display: "flex" }}>
          <InputText
            required={true}
            type="text"
            id="identityCard"
            label="ID/ARC/Passport Number"
            onChange={identidyCardChangeHandler}
            onBlur={identidyCardBlurHandler}
            hasError={identidyCardHasError}
            value={identidyCardValue}
          />
          <InputText
            required={true}
            type="text"
            id="socialSecurityNumber"
            label="Social Security Number"
            onChange={SocialSNChangeHandler}
            onBlur={SocialSNBlurHandler}
            hasError={SocialSNHasError}
            value={SocialSNValue}
          />
        </div >
        <div style={{ display: "flex" }}>
          <InputText
            required={true}
            type="text"
            id="staffStreetName"
            label="StreetName"
            onChange={streetNameChangeHandler}
            onBlur={streetNameBlurHandler}
            hasError={streetNameHasError}
            value={streetNameValue} />

          <InputText
            required={true}
            type="number"
            id="staffStreetNumber"
            label="Street Number"
            onChange={streetNumberChangeHandler}
            onBlur={streetNumberBlurHandler}
            hasError={streetNumberHasError}
            value={streetNumberValue} />
        </div>
        <div style={{ display: "flex" }}>
        <InputSelect
              required={true}
              id="city"
              label="City"
              selection={[
                { value: 'Limassol', label: 'Limassol' },
                { value: 'Larnaca', label: 'Larnaca' },
                { value: 'Nicosia', label: 'Nicosia' },
                { value: 'Paphos', label: 'Paphos' },
                { value: 'Kyrenia', label: 'Kyrenia' },
                { value: 'Famagusta', label: 'Famagusta' },
              ]}
              onChange={cityChangeHandler}
              onBlur={cityBlurHandler}
              hasError={cityHasError}
              value={cityValue}
            />

          <InputText
            required={true}
            type="number"
            id="staffPostalCode"
            label="Postal Code"
            onChange={postalCodeChangeHandler}
            onBlur={postalCodeBlurHandler}
            hasError={postalCodeHasError}
            value={postalCodeValue} />
        </div>

        <div style={{ display: "flex" }}>
          <InputText
            required={true}
            type="date"
            id="staffStartDate"
            label="Start Date"
            onChange={startDateChangeHandler}
            onBlur={startDateBlurHandler}
            hasError={startDateHasError}
            value={startDateValue} />
          <InputText
            required={true}
            type="text"
            id="staffEmail"
            label="Email"
            onChange={staffEmailChangeHandler}
            onBlur={staffEmailBlurHandler}
            hasError={staffEmailHasError}
            value={staffEmailValue} />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
        <Button sx={{ marginRight: 5 }} variant="outlined" color="error" onClick={() => handleClose()}>Cancel</Button>
        <Button type="submit" variant="contained" color="success" disabled={!formIsValid}>Add Staff Member</Button>
      </div>

      {openModal && <ChildModal shouldOpen={openModal} informationObject={modalInformation} databaseHandler={addToDatabase} resetOpenModal={resetOpenModal} message={"Are you sure you want to add this staff member"} />}
    </Box>
  )
}
