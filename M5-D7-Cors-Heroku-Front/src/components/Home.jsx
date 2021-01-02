import React from "react";
import {
  Jumbotron,
  Button,
  Container,
  Row,
  Col,
  Card,
  Dropdown,
  DropdownButton,
  InputGroup,
  FormControl,
} from "react-bootstrap";

// import fantasy from "../data/fantasy.json";
// import horror from "../data/horror.json";
// import history from "../data/history.json";
// import romance from "../data/romance.json";
// import scifi from "../data/scifi.json";

let bookCategories = ["fantasy", "horror", "history", "romance", "scifi"];
// let books = {
//   fantasy,
//   horror,
//   history,
//   romance,
//   scifi,
// };

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      books: [
        
      ],
      default: this.props.books,
      categorySelected: "fantasy",
      loading: true
    };
  }

  fetchBooks = async() => {
    try {
      const apiUrl = "http://localhost:3001"
      const responce = await fetch(`${apiUrl}/books`)
      const books = await responce.json()
      const history = books.filter(book => book.category === "history");
      const romance = books.filter(book => book.category === "romance");
      const scifi = books.filter(book => book.category === "scifi");
      const horror = books.filter(book => book.category === "horror");
      const fantasy = books.filter(book => book.category === "fantasy");
      const sortedBooks = [
        history,
        romance,
        scifi,
        horror,
        fantasy
      ]
      console.log(books.filter(book => book.category === "fantasy"))
      this.setState({
        books: [
          history,
          romance,
          scifi,
          horror,
          fantasy
        ],
        default: books.filter(book => book.category === "fantasy"),
        loading: false
      })
    } catch (e) {
      console.log(e)
      this.setState({
        loading: false
      })
    }
  }

  componentDidMount(){
    this.fetchBooks()
  }

  handleDropdownChange = (category) => {
    this.setState({
      default: this.state.books[0].slice(0, 12),
      categorySelected: category,
    });
  };

  handleSearchQuery = (searchQuery) => {
    let category = this.state.categorySelected;

    if (searchQuery) {
      let filteredBooks = this.state.books[category].filter((book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      this.setState({ default: filteredBooks.slice(0, 12) });
    } else {
      this.setState({ default: this.state.books[category].slice(0, 12) });
    }
  };

  render() {
    console.log("test", this.state.books)
    return (
      <div>
        <Jumbotron>
          <h1>{this.props.jumboTitle}</h1>
          <p>
            This is a simple hero unit, a simple jumbotron-style component for
            calling extra attention to featured content or information.
          </p>
          <p>
            <Button variant="primary">Learn more</Button>
          </p>
        </Jumbotron>
        {this.state.loading && <p>Loading...</p>}
        {!this.state.loading && (<Container>
          <InputGroup>
            <DropdownButton
              as={InputGroup.Prepend}
              id="dropdown-basic-button"
              className="mb-3"
              title={this.state.categorySelected}
            >
              {bookCategories.map((category, index) => {
                return (
                  <Dropdown.Item
                    href="#/action-1"
                    key={`dropdown-category-${index}`}
                    onClick={() => this.handleDropdownChange(category)}
                  >
                    {category}
                  </Dropdown.Item>
                );
              })}
            </DropdownButton>
            <FormControl
              placeholder="Search Books by Title"
              aria-label="Search"
              aria-describedby="basic-addon1"
              onChange={(e) => this.handleSearchQuery(e.target.value)}
            />
          </InputGroup>
          <Row>
            {this.state.default ? (
              this.state.default.map((book) => {
                return (
                  <Col xs={6} key={book.asin}>
                    <Card style={{ width: "18rem" }}>
                      <Card.Img variant="top" src={book.img} />
                      <Card.Body>
                        <Card.Title>{book.title}</Card.Title>
                        <Card.Text>€{book.price}</Card.Text>
                        <Button variant="primary">Go somewhere</Button>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })
            ) : (
              <div> nothing here </div>
            )}
          </Row>
        </Container>)}
      </div>
    );
  }
}

export default Home;
