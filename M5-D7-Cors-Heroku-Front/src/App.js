import React from "react";
import NavBar from "./components/NavBar";
import Home from "./components/Home";

class App extends React.Component {
  state = {
    books: []
  }

  fetchBooks = async() => {
    try {
      const apiUrl = "http://localhost:3001"
      const responce = await fetch(`${apiUrl}/books`)
      const books = await responce.json()
      console.log(books.filter(book => book.category === "fantasy"))
      this.setState({
        books: books,
      })
    } catch (e) {
      console.log(e)
    }
  }

  componentDidMount(){
    this.fetchBooks()
  }
  render(){
  return (
    <div className="App">
      <NavBar title="StriveBooks" books={this.state.books}/>
      <Home jumboTitle="Welcome to strivebooks" />
    </div>
  );
}
}

export default App;
