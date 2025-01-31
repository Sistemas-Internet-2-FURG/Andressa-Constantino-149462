import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./styles.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NewBook from "./pages/newBook";
import NewEditor from "./pages/newEditor";
import EditEditor from "./pages/editEditor";
import EditBook from "./pages/editBook";
import EditAuthor from "./pages/editAuthor";
import { useNavigate } from "react-router-dom";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/index" element={<BookList />} />
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/newBook" element={<NewBook />} />
        <Route path="/newEditor" element={<NewEditor />} />
        <Route path="/editEditor/:id" element={<EditEditor />} />
        <Route path="/editBook/:id" element={<EditBook />} />
        <Route path="/editAuthor/:id" element={<EditAuthor />} />
      </Routes>
    </Router>
  );
}

function Header() {
  return (
    <header>
      <div id="start">
        <img src="/static/logo-icon.png" alt="Logo" />
        <h1>BookShelf</h1>
      </div>
    </header>
  );
}

function BookList() {
  const [books, setBooks] = useState([]);
  const [editors, setEditors] = useState([]);
  const [authors, setAuthors] = useState([]);
  
  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/livros")
      .then((response) => setBooks(response.data))
      .catch((error) => console.error("Erro ao buscar livros:", error));
    
    axios.get("http://127.0.0.1:5000/api/editoras")
      .then((response) => setEditors(response.data))
      .catch((error) => console.error("Erro ao buscar editoras:", error));

    axios.get("http://127.0.0.1:5000/api/autores")
      .then((response) => setAuthors(response.data))
      .catch((error) => console.error("Erro ao buscar autores:", error));
  }, []);

  return (
    <main>
      <section id="books">
        <h2>Livros</h2>
        <ul>
          {books.map((book) => (
            <li key={book.id}>
              <div className="bookInfo">
                <span>{book.nome}</span>
                <span>De: {authors.find(a => a.id === book.autor)?.nome || "Desconhecido"}</span>
                <span>Publicado por: {editors.find(e => e.id === book.editora)?.nome || "Desconhecido"}</span>
              </div>
                <div className="bookOptions">
                  <a href={`/editBook/${book.id}`}>
                    <img src="../static/edit.png" alt="Editar" />
                  </a>
                  <form style={{ display: 'inline' }}>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await axios.delete(`http://127.0.0.1:5000/api/livros/${book.id}`);
                        alert("Livro excluído com sucesso!");
                        window.location.reload();
                      } catch (error) {
                        console.error("Erro ao excluir livro:", error);
                        alert("Erro ao excluir livro.");
                      }
                    }}
                  >
                    <img src="../static/del.png" alt="Excluir" />
                  </button>
                  </form>
                </div>
            </li>
          ))}
        </ul>
      </section>
      <section id="center">
            <div id="cadastro">
                <h2>Cadastro</h2>
                <div id="cadastroOptions">
                <a className="new" as={Link} href="/newBook">Livro</a>
                <a className="new" as={Link} href="/newEditor">Editora</a>
                </div>
            </div>
      <section id="editors">
        <h2>Editoras</h2>
        <ul>
          {editors.map((editora) => (
            <li key={editora.id}>
              <div className="editorInfo">
                <span>{editora.nome}</span>
              </div>
              <div className="editorOptions">
                <a href={`/editEditor/${editora.id}`}>
                  <img src="../static/edit.png" alt="Editar" />
                </a>
                <form style={{ display: 'inline' }}>
                <button
                    type="button"
                    onClick={async () => {
                      try {
                        await axios.delete(`http://127.0.0.1:5000/api/editoras/${editora.id}`);
                        alert("Editora excluído com sucesso!");
                        window.location.reload();
                      } catch (error) {
                        console.error("Erro ao excluir livro:", error);
                        alert("Não é possível excluir a editora");
                      }
                    }}
                  >
                    <img src="../static/del.png" alt="Excluir" />
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </section>
      </section>

      <section id="authors">
        <h2>Autores</h2>
        <ul>
          {authors.map((autor) => (
            <li key={autor.id}>
              <div className="authorInfo">
                <span>{autor.nome}</span>
              </div>
                <div className="authorOptions">
                  <a href={`/editAuthor/${autor.id}`}>
                    <img src="../static/edit.png" alt="Editar" />
                  </a>
                  <form style={{ display: 'inline' }}>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await axios.delete(`http://127.0.0.1:5000/api/autores/${autor.id}`);
                        alert("Autor excluído com sucesso!");
                        window.location.reload();
                      } catch (error) {
                        console.error("Erro ao excluir livro:", error);
                        alert("Não é possível excluir o autor");
                      }
                    }}
                  >
                    <img src="../static/del.png" alt="Excluir" />
                  </button>
                  </form>
                </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}


export default App;