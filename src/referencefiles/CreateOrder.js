import React, { useState } from "react";
import "./CreateOrder.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FormControl, FormGroup, FormLabel } from "react-bootstrap";

const suppliersData = [
  { name: "", items: [] },
  {
    name: "Frozen Foods inc.",
    items: ["Beef Patty, ", "Chicken Patty, ", "Chicken Thigh "],
  },
  {
    name: "Thomas Bakeries",
    items: ["Burger Bun, ", "Bread"],
  },
  {
    name: "Maria's Fresh Market",
    items: ["Tomatoes, ", "Lettuce, ", "Onions, "],
  },
];

function CreateOrder() {
  const [selection, setSelection] = useState("");
  return (
    <div className="CreateOrder">
      <div className="Box">
        <div className="Contents">
          <div style={{ size: "10", color: "red" }}>
            * All fields are required.
          </div>

          <Form>
            <div id="row">
              <div id="column">
                <FormGroup size="lg" controlId="name">
                  <Form.Label>Supplier: </Form.Label>
                  <Form.Select
                    id="Select"
                    value={selection}
                    onChange={(e) => setSelection(e.target.value)}
                  >
                    {suppliersData.map((val, key) => {
                      return <option>{val.name}</option>;
                    })}
                  </Form.Select>
                  <Form.Label>
                    {suppliersData.map((val, key) => {
                      if (val.name === selection) {
                        return val.items;
                      }
                    })}
                  </Form.Label>
                </FormGroup>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <Button block size="lg" type="submit" style={{ padding: "15px" }}>
                Confirm Details
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default CreateOrder;
