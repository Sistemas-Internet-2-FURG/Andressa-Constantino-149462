import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles.css";

function EditEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editor, setEditor] = useState({ nome: "" });

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/editoras")
      .then((response) => {
        const editoraEncontrado = response.data.find((editora) => editora.id === Number(id));
        if (editoraEncontrado) setEditor(editoraEncontrado);
      })
      .catch((error) => console.error("Erro ao buscar livros:", error));
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:5000/api/editoras/${id}`, editor);
      navigate("/index");
    } catch (error) {
      console.error("Erro ao editar editora:", error);
    }
  };

  return (
    <main>
      <div id="formBox">
        <form onSubmit={handleSubmit}>
          <h3>Editar Editora</h3>
          <label htmlFor="nome">Nome:</label>
          <input 
            type="text" 
            id="nome" 
            name="nome" 
            value={editor.nome} 
            onChange={(e) => setEditor({ ...editor, nome: e.target.value })} 
          />
          <input type="submit" value="Salvar" />
        </form>
      </div>
    </main>
  );
}

export default EditEditor;