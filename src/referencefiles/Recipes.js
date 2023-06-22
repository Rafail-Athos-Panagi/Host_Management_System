import React from "react";
import "./Recipes.css";
import bbqbeast from "../assets/img/food/bbqbeast.jpg";
import pulledburger from "../assets/img/food/pulledburger.jpg";
import chickenwings from "../assets/img/food/chickenwings.jpg";

const recipesData = [
  {
    image: bbqbeast,
    name: "BBQ Beast",
    description: "This is a placeholder description",
    link: "/recipes/bbqburger",
  },
  {
    image: pulledburger,
    name: "Pulled Pork Burger",
    description: "This is a placeholder description",
    link: "/recipes/pulledburger",
  },
  {
    image: chickenwings,
    name: "Chicken Wings",
    description: "This is a placeholder description",
    link: "/recipes/chickenwings",
  },
  {
    image: bbqbeast,
    name: "BBQ Beast",
    description: "This is a placeholder description",
    link: "/recipes/bbqburger",
  },
  {
    image: pulledburger,
    name: "Pulled Pork Burger",
    description: "This is a placeholder description",
    link: "/recipes/pulledburger",
  },
  {
    image: chickenwings,
    name: "Chicken Wings",
    description: "This is a placeholder description",
    link: "/recipes/chickenwings",
  },
  {
    image: bbqbeast,
    name: "BBQ Beast",
    description: "This is a placeholder description",
    link: "/recipes/bbqburger",
  },
  {
    image: pulledburger,
    name: "Pulled Pork Burger",
    description: "This is a placeholder description",
    link: "/recipes/pulledburger",
  },
  {
    image: chickenwings,
    name: "Chicken Wings",
    description: "This is a placeholder description",
    link: "/recipes/chickenwings",
  },
];

const divStyle = (src) => ({
  backgroundImage: "url(" + src + ")",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
});

function handleAdd() {}

function Recipes() {
  return (
    <div className="Recipes">
      <div className="Box">
        <div id="Searchbox">
          <form>
            <label>Search recipe: </label>
            <input
              type="text"
              name="name"
              style={{ marginLeft: "5px", marginRight: "5px" }}
            />
            <input
              type="button"
              value="Search!"
              style={{ marginRight: "5px" }}
            />
            <input type="button" value="Add new recipe" onSubmit={handleAdd} />
          </form>
        </div>
        <div className="Contents">
          {recipesData.map((val, key) => {
            return (
              <div
                key={key}
                className="smallbox"
                onClick={() => {
                  window.location.pathname = val.link;
                }}
              >
                <div>
                  <img className="image" src={val.image} />
                </div>
                <div className="title">{val.name}</div>
                <div className="description">{val.description}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Recipes;
