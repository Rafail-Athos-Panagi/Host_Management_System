import { Card } from "react-bootstrap";


export default function RecipeList({ val, key }) {

  return (
    <>
      <Card key={key} style={{ width: "15rem" }}>
        <Card.Img
          variant="top"
          src={require("../../assets/uploads/" + val.image)}
          style={{
            maxWidth: "200px",
            alignSelf: "center",
            padding: "10px",
          }}
          alt=""
        />
        <Card.Body className="default-cursor">
          <Card.Title>{val.recipeName}</Card.Title>
        </Card.Body>

      </Card>
    </>


  );
}

