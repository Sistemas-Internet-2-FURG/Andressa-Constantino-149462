from flask import jsonify, request
from app.models import db, Autor

def get_autores():
    autores = Autor.query.all()
    return jsonify([{
        "id": autor.id,
        "nome": autor.nome,
        "email": autor.email,
        "livros_count": autor.livros_count
    } for autor in autores]), 200

def update_autor(autor_id):
    data = request.json
    autor = Autor.query.get(autor_id)

    if not autor:
        return jsonify({"error": "Autor não encontrado"}), 404

    autor.nome = data.get('nome', autor.nome)
    autor.email = data.get('email', autor.email)
    autor.senha = data.get('senha', autor.senha)

    db.session.commit()
    return jsonify({"message": "Autor atualizado com sucesso"}), 200

def delete_autor(autor_id):
    autor = Autor.query.get(autor_id)

    if not autor:
        return jsonify({"error": "Autor não encontrado"}), 404

    db.session.delete(autor)
    db.session.commit()
    return jsonify({"message": "Autor deletado com sucesso"}), 200
