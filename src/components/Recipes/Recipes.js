import React from "react";
import { useState, useEffect } from "react";
import ModalButton from "../UI/Modal/ModalButton";
import { Card } from "react-bootstrap";
import "./Recipes.css";
import { TextField } from "@mui/material";
import AddRecipe from "./AddRecipe";
import EditRecipe from "./EditRecipe"
import Modal from "../UI/Modal/Modal";
import Loading from "../UI/Loading/Loading";
import Manual from "../Settings/Manual";

export default function Recipes() {
  //const types = [...new Set(menu.map((s) => s.type))];
  const [search, setSearch] = useState('');
  const [closeModal, setCloseModal] = useState(false);
  const [recipeList, setRecipeList] = useState([]);
  const [rows, setRows] = useState([]);
  const [rowEdit, setRowEdit] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  function refreshTable() {
    setIsLoading(true);
    const request = {
      method: "post",
      credentials: "include",
      mode: "cors",
      redirect: "follow",
      
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        select: "recipeID,recipeImage,recipeName,recipeDescription",
        from: "recipes",
        where: "deleted=false"
      })
    };
    fetch(`/api/select`, request)
      .then(function (res) {
        res.json().then(function (data) {
          data.sqlMessage ? console.log(data.sqlMessage) : setRecipeList(data);
          setIsLoading(false);
        })
      })
  }

  useEffect(() => {
    refreshTable();
  }, []);

  useEffect(() => {
    const filteredRows = recipeList.filter((row) => {
      return row.recipeName.toLowerCase().includes(search.toLowerCase());
    });
    setRows(filteredRows);
  }, [recipeList, search]);

  function handleDoubleClick(event, row) {
    if (event.detail === 2) {
      setRowEdit(row);
      setIsOpen(true);
    }
  }

  return (
    <div className="recipes">
      <div className="box">
        <p className="title">Recipe List</p>
        <div className="ps-4"><Manual title="Recipe Manual" pageNumber={41}/></div>
        <div className="interior">
          <div style={{ display: "flex" }}>
            <div className="leftside">
              <TextField
                id="outlined-basic"
                label="Search recipes"
                variant="outlined"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            


            <div className="rightside">
              <ModalButton
                name="Add new recipe"
                close={closeModal}
                isClosed={() => setCloseModal(false)}
              >
                <AddRecipe handleClose={() => {setCloseModal(true); refreshTable();}} refresh={()=>refreshTable()} />
              </ModalButton>
            </div>
          </div>
          <hr/>
          <div className="contents">
            {isLoading && <Loading />}
            {!isLoading && <>
              {rows.length === 0 &&
                <p>No recipes found</p>}
              {rows.length > 0 &&
              rows.map((val, key) => {
                
                return (
                  <Card key={key} className="unselectable" style={{ width: "15rem" }} onClick={e => handleDoubleClick(e, key)}>
                    <Card.Img
                      variant="top"
                      src={"/recipes/" + encodeURI(val.recipeImage)}
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src="/recipes/default.jpg";
                      }}
                    
                      style={{
                        maxWidth: "100%",
                        alignSelf: "center",
                      }}
                      alt=""
                    />
                    <Card.Body className="default-cursor">
                      <Card.Title>{val.recipeName}</Card.Title>
                    </Card.Body>
                  </Card>

                );
              })}
            </>}
            <Modal handleClose={() => setIsOpen(false)}
              isOpen={isOpen}>
              <EditRecipe handleClose={() => { setIsOpen(false); setTimeout(()=>{refreshTable();},500); }} editValues={recipeList[rowEdit]} refresh={() => refreshTable()} />
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}
