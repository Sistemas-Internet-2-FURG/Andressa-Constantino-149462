import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./styles.css";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<BookList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
      <div id="end">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
      </div>
    </header>
  );
}

function BookList() {
  const [books, setBooks] = useState([]);
  const [editors, setEditors] = useState([]);
  const [authors, setAuthors] = useState([]);
  
  useEffect(() => {
    axios.get("/api/livros")
      .then((response) => setBooks(response.data))
      .catch((error) => console.error("Erro ao buscar livros:", error));
    
    axios.get("/api/editoras")
      .then((response) => setEditors(response.data))
      .catch((error) => console.error("Erro ao buscar editoras:", error));

    axios.get("/api/autores")
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
                <span>De: {book.autor_nome}</span>
                <span>Publicado por: {book.editora_nome}</span>
              </div>
              {book.autor === 'autor_id_aqui' && (
                <div className="bookOptions">
                  <a href={`/editar_livro/${book.id}`}>
                    <img src="../static/edit.png" alt="Editar" />
                  </a>
                  <form action={`/excluir_livro/${book.id}`} method="post" style={{ display: 'inline' }}>
                    <button type="submit">
                      <img src="../static/del.png" alt="Excluir" />
                    </button>
                  </form>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section id="editors">
        <h2>Editoras</h2>
        <ul>
          {editors.map((editora) => (
            <li key={editora.id}>
              <div className="editorInfo">
                <span>{editora.nome}</span>
                <span>Livros Publicados = {editora.livros_count}</span>
              </div>
              <div className="editorOptions">
                <a href={`/editar_editora/${editora.id}`}>
                  <img src="../static/edit.png" alt="Editar" />
                </a>
                <form action={`/excluir_editora/${editora.id}`} method="post" style={{ display: 'inline' }}>
                  <button type="submit">
                    <img src="../static/del.png" alt="Excluir" />
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="authors">
        <h2>Autores</h2>
        <ul>
          {authors.map((autor) => (
            <li key={autor.id}>
              <div className="authorInfo">
                <span>{autor.nome}</span>
                <span>Livros Escritos = {autor.livros_count}</span>
              </div>
              {autor.id === 'autor_id_aqui' && (
                <div className="authorOptions">
                  <a href={`/editar_autor/${autor.id}`}>
                    <img src="../static/edit.png" alt="Editar" />
                  </a>
                  <form action={`/excluir_autor/${autor.id}`} method="post" style={{ display: 'inline' }}>
                    <button type="submit">
                      <img src="../static/del.png" alt="Excluir" />
                    </button>
                  </form>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}


export default App;