import React, { useContext, useEffect, useState } from 'react'
import Box from "@mui/material/Box";
import InputText from "../UI/Input/InputText";
import Button from "@mui/material/Button";
import useInput from '../../hooks/use-input';
import {
  validPositiveFloat,
  notEmpty,
  validPhoneNumber,
  validPostal_Zip_Code,
  onlyLetters,
  validEmail
} from "../../Regex/Regex";
import logging from '../../hooks/logging-hook';
import Username from '../../hooks/user-context';
import Swal from 'sweetalert2';
import InputSelect from '../UI/Input/InputSelect';



export default function EditStaff({ refresh, handleClose, editValues }) {

  const [openModal, setOpenModal] = useState(false);
  const [modalInformation, setModalInformation] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const { username } = useContext(Username);

  const isValidEmail = (value) => validEmail.test(value);
  const isNotEmpty = (value) => notEmpty.test(value);
  const isPositiveNumber = (value) => validPositiveFloat.test(value);
  const validPN = (value) => validPhoneNumber.test(value);
  const validPostalCode = (value) => validPostal_Zip_Code.test(value);
  const isNotLetter = (value) => onlyLetters.test(value);

  useEffect(() => {
    async function fetchStaffInfo() {
      try {
        const request = {
          method: "post",
          credentials: "include",
          mode: "cors", redirect: "follow",

          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            select: "staffDateOfBirth,staffIDNumber,staffSocialSecurityNumber,staffStreetNumber,staffStreetName,staffCity,staffPostalCode,endDate",
            from: "staff",
            where: `staffID=${editValues[0]}`
          }),
        };

        const res = await fetch(`/api/select`, request);
        const data = await res.json()

        if (data.sqlMessage) {
          console.log(data.sqlMessage);
        }
        else {
          resetDateOfBirth(data[0].staffDateOfBirth.substring(0, 10));
          resetIdentidyCard(data[0].staffIDNumber);
          resetSocialSN(data[0].staffSocialSecurityNumber);
          resetStreetNumber(data[0].staffStreetNumber);
          resetStreetName(data[0].staffStreetName);
          resetCity(data[0].staffCity);
          resetPostalCode(data[0].staffPostalCode);
          resetTerminationDate(data[0].endDate.substring(0, 10));
        }
      }
      catch (error) {
        console.error(error)
      }
    }

    fetchStaffInfo();
  }, [])

  const {
    value: firstNameValue,
    isValid: firstNameIsValid,
    hasError: firstNameHasError,
    valueChangeHandler: firstNameChangeHandler,
    inputBlurHandler: firstNameBlurHandler,
  } = useInput(isNotEmpty && isNotLetter, editValues[1]);

  const {
    value: lastNameValue,
    isValid: lastNameIsValid,
    hasError: lastNameHasError,
    valueChangeHandler: lastNameChangeHandler,
    inputBlurHandler: lastNameBlurHandler,
  } = useInput(isNotEmpty && isNotLetter, editValues[2]);

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
  } = useInput(isNotEmpty, editValues[5].substring(0, 10));

  const {
    value: terminationDateValue,
    isValid: terminationDateIsValid,
    hasError: terminationDateHasError,
    valueChangeHandler: terminationDateChangeHandler,
    inputBlurHandler: terminationDateBlurHandler,
    reset: resetTerminationDate,
  } = useInput(isNotEmpty);

  const {
    value: staffEmailValue,
    isValid: staffEmailIsValid,
    hasError: staffEmailHasError,
    valueChangeHandler: staffEmailChangeHandler,
    inputBlurHandler: staffEmailBlurHandler,
  } = useInput(isValidEmail, editValues[3]);

  const {
    value: phoneNumberValue,
    isValid: phoneNumberIsValid,
    hasError: phoneNumberHasError,
    valueChangeHandler: phoneNumberChangeHandler,
    inputBlurHandler: phoneNumberBlurHandler,
  } = useInput(isNotEmpty, editValues[4]);

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
    if (!formIsValid) {
      return;
    }
    Swal.fire({
      title: 'Are you sure you want to save changes?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        updateDatabase();
        Swal.fire({
          title: 'Edited staff successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      }
    });
  };

  const updateDatabase = async () => {
    if (terminationDateValue.length > 0) {
      try {
        const request = {
          method: "post",
          credentials: "include",
          mode: "cors", redirect: "follow",

          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            table: "staff",
            columns: `staffName="${firstNameValue}",staffSurname="${lastNameValue}",staffPhoneNumber=${phoneNumberValue},staffEmail="${staffEmailValue}",staffDateOfBirth="${dateOfBirthValue}",staffIDNumber=${identidyCardValue},staffSocialSecurityNumber="${SocialSNValue}",staffStreetNumber="${streetNumberValue}",staffStreetName="${streetNameValue}",staffCity="${cityValue}",staffPostalCode=${postalCodeValue},startDate="${startDateValue}",endDate="${terminationDateValue}"`,
            where: `staffID=${editValues[0]}`
          }),
        };

        const res = await fetch(`/api/update`, request);
        const data = await res.json()

        if (data.sqlMessage) {
          console.log(data.sqlMessage);
        }
      }
      catch (error) {
        console.error(error)
      }
    }
    else {
      try {
        const request = {
          method: "post",
          credentials: "include",
          mode: "cors", redirect: "follow",

          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            table: "staff",
            columns: `staffName="${firstNameValue}",staffSurname="${lastNameValue}",staffPhoneNumber=${phoneNumberValue},staffEmail="${staffEmailValue}",staffDateOfBirth="${dateOfBirthValue}",staffIDNumber=${identidyCardValue},staffSocialSecurityNumber="${SocialSNValue}",staffStreetNumber="${streetNumberValue}",staffStreetName="${streetNameValue}",staffCity="${cityValue}",staffPostalCode=${postalCodeValue},startDate="${startDateValue}"`,
            where: `staffID=${editValues[0]}`
          }),
        };

        const res = await fetch(`/api/update`, request);
        const data = await res.json()

        if (data.sqlMessage) {
          setErrorMessage(data.sqlMessage);
          return;
        } else {
          logging(`${username}`, "Update", `${editValues[0]}`, "staff", `Edited staff member: ${firstNameValue} ${lastNameValue}`);
        }
      }
      catch (error) {
        console.error(error)
      }
    }

    handleClose();
  }

  const resetOpenModal = () => {
    setOpenModal(false);
  };

  async function handleDelete(props) {
    async function deleteFromDatabase() {
      try {
        const request = {
          method: "post",
          credentials: "include",
          mode: "cors", redirect: "follow",

          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            table: "staff",
            columns: `deleted=true`,
            where: `staffID=${editValues[0]}`
          }),
        };

        const res = await fetch(`/api/update`, request);
        const data = await res.json()

        if (data.sqlMessage) {
          console.log(data.sqlMessage);
        } else {
          logging(`${username}`, "Delete", `${editValues[0]}`, "staff", `Deleted staff: ${firstNameValue + " " + lastNameValue}`);
        }
      }
      catch (error) {
        console.error(error)
      }
    }
    await Swal.fire({
      title: 'Are you sure you want to delete this staff member?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteFromDatabase();
        Swal.fire({
          title: 'Staff member deleted successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          handleClose();
          refresh();
        });
      }
    });


  }

  return (
    <Box component="form" sx={{
      '& .MuiTextField-root': { m: 1 },
    }}
      noValidate
      autoComplete="off"
      onSubmit={formSubmissionHandler}>

      <h2 style={{ marginBottom: "20px" }}>Edit staff member</h2>
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
            required={false}
            type="date"
            id="staffTerminationDate"
            label="Termination Date"
            onChange={terminationDateChangeHandler}
            onBlur={terminationDateBlurHandler}
            hasError={terminationDateHasError}
            value={terminationDateValue} />
        </div>
        <div style={{ display: "flex" }}>
          <InputText
            required={true}
            type="number"
            id="staffPhoneNumber"
            label="Phone Number"
            onChange={phoneNumberChangeHandler}
            onBlur={phoneNumberBlurHandler}
            hasError={phoneNumberHasError}
            value={phoneNumberValue} />

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
      <p style={{ color: "red", fontSize: "22px" }}>{errorMessage}</p>
      <div style={{ display: "flex", marginTop: "10px" }}>
        <div style={{ width: "50%" }}>
          <Button variant="contained" color="error" onClick={() => handleDelete()}>Delete staff member</Button>
        </div>

        <div style={{ width: "50%", justifyContent: "right", display: "flex" }}>
          <Button sx={{ marginRight: 5 }} variant="outlined" color="error" onClick={() => handleClose()}>Cancel</Button>
          <Button type="submit" variant="contained" color="success" disabled={!formIsValid}>Save Changes</Button>
        </div>
      </div>
    </Box>
  )
}
