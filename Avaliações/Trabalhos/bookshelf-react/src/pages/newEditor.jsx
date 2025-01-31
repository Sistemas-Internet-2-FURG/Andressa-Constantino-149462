import { useState } from "react";
import axios from "axios";
import "../styles.css";
import { useNavigate } from "react-router-dom";

function NewEditor() {
  const navigate = useNavigate();
  const [editorName, setEditorName] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = { nome: editorName };
    
    try {
      await axios.post("http://127.0.0.1:5000/api/editoras", formData);
      alert("Editora salva com sucesso!");
      navigate("/index")
    } catch (error) {
      console.error("Erro ao salvar editora:", error);
      alert("Erro ao cadastrar editora");
    }
  };

  return (
    <div>
      <main>
        <div id="formBox">
          <form onSubmit={handleSubmit}>
            <h3>Editar Editora</h3>
            <label htmlFor="nome">Nome:</label>
            <input 
              type="text" 
              id="nome" 
              name="nome" 
              placeholder="Digite o nome da editora" 
              value={editorName} 
              onChange={(e) => setEditorName(e.target.value)} 
              required
            />
            <input type="submit" value="Salvar" />
          </form>
        </div>
      </main>
    </div>
  );
}

export default NewEditor;