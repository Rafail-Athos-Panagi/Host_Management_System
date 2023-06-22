import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import PeopleIcon from "@mui/icons-material/People";
import './CardUI.css'

const CardUI = (props) => {
  return (
    <Col xs={1} md={2} lg={3}>
      <Card className="title" style={{ width: "20rem" }}>
        <Card.Body>
          <Card.Title>{props.title}</Card.Title>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default CardUI;
