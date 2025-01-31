import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles.css";

function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editors, setEditors] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [selectedEditor, setSelectedEditor] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [books, setBooks] = useState([]);
  const [book, setBook] = useState({ nome: "", autor_nome: "", editora: "" });

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/livros")
      .then((response) => {
        setBooks(response.data);
        const livroEncontrado = response.data.find((livro) => livro.id === Number(id));
        if (livroEncontrado) setBook(livroEncontrado);
      })
      .catch((error) => console.error("Erro ao buscar livros:", error));
  
    axios.get("http://127.0.0.1:5000/api/editoras")
      .then((response) => setEditors(response.data))
      .catch((error) => console.error("Erro ao buscar editoras:", error));
  
    axios.get("http://127.0.0.1:5000/api/autores")
      .then((response) => setAuthors(response.data))
      .catch((error) => console.error("Erro ao buscar autores:", error));
  }, [id]);


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:5000/api/livros/${id}`, book);
      alert("Livro editado com sucesso!");
      navigate("/index")
    } catch (error) {
      console.error("Erro ao editar livro:", error);
      alert("Erro ao editar livro");
    }
  };

  return (
    <main>
      <div id="formBox">
        <form onSubmit={handleSubmit}>
          <h3>Editar Livro</h3>
          <label htmlFor="nome">Nome:</label>
          <input 
            type="text" 
            id="nome" 
            name="nome" 
            value={book.nome} 
            onChange={(e) => setBook({ ...book, nome: e.target.value })} 
          />

          <label htmlFor="autor">Autor:</label>
          <select 
            id="autor" 
            name="autor" 
            value={selectedAuthor} 
            onChange={(e) => {
                const authorId = Number(e.target.value);
                setSelectedAuthor(authorId);
                setBook({ ...book, autor: authorId });
            }}
            required
            >
            <option value={book.autor}>{authors.find((autor) => autor.id === book.autor)?.nome}</option>
            {authors.map((autor) => (
                <option key={autor.id} value={autor.id}>{autor.nome}</option>
            ))}
            </select>

          <label htmlFor="editora">Editora:</label>
          <select 
            id="editora" 
            name="editora" 
            value={selectedEditor} 
            onChange={(e) => {
                const editorId = Number(e.target.value);
                setSelectedEditor(editorId);
                setBook({ ...book, editora: editorId });
            }}
            required
            >
            <option value={book.editora}>{editors.find((editora) => editora.id === book.editora)?.nome}</option>
            {editors.map((editora) => (
                <option key={editora.id} value={editora.id}>{editora.nome}</option>
            ))}
            </select>


          <input type="submit" value="Salvar" />
        </form>
      </div>
    </main>
  );
}

export default EditBook;