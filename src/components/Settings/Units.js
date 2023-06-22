import React, { useState, useEffect } from 'react';
import InputText from '../UI/Input/InputText';
import Button from "@mui/material/Button";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import useInput from '../../hooks/use-input';
import {
  notEmpty,

} from "../../Regex/Regex";

export default function Units() {

  const isNotEmpty = (value) => notEmpty.test(value);
  const [units, setUnits] = useState([]);



  const {
    value: unitTypeValue,
    valueChangeHandler: unitTypeChangeHandler,
    reset: resetUnitType,
  } = useInput(isNotEmpty);

  useEffect(() => {
    async function UnitsFetcher() {
      try {
        const request = {
          method: "post",
          credentials: "include",
          mode: "cors", redirect: "follow",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            select: "unitType",
            from: "unitsVariables"
          }),
        };

        const res = await fetch(`/api/select`, request);
        const data = await res.json()

        if (data.sqlMessage) {
          console.log(data.sqlMessage);
        }
        else {
          setUnits(data);
        }
      }
      catch (error) {
        console.error(error)
      }
    }

    UnitsFetcher();
  }, []);


  const unitTypeSetter = async (event) => {
    event.preventDefault();
    if (unitTypeValue.trim() !== '') {
      try {
        const request = {
          method: "post",
          credentials: "include",
          mode: "cors", redirect: "follow",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            table: "unitsVariables(unitType)",
            values: `("${unitTypeValue}")`
          }),
        };

        const res = await fetch(`/api/insert`, request);
        const data = await res.json()

        if (data.sqlMessage) {
          console.log(data.sqlMessage);
        }
        else {
          setUnits([...units, { unitType: unitTypeValue }]);
          resetUnitType("");
        }
      }
      catch (error) {
        console.error(error)
      }
    }
  };

  return (
    <div>
      <br></br>
      <br></br>
      <form onSubmit={unitTypeSetter}>
        <h4>Set your Unit Types here</h4>
        <InputText
          label="Unit Type"
          type="text"
          required={false}
          id="unitTypeSettings"
          value={unitTypeValue}
          onChange={unitTypeChangeHandler}
        />
        <br></br>
        <Button type="submit" variant="contained" color="success" disabled={false}>Add Unit Type</Button>
      </form>
      <br></br>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Your Current Unit Types</Typography>
        </AccordionSummary>
        <hr/>
        <AccordionDetails>
          {units.map((data,key) => {
            return <ul key={key}>{data.unitType}</ul>
          })}
        </AccordionDetails>
      </Accordion>

    </div>
  )
}