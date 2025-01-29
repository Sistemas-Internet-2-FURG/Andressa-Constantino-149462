from flask import jsonify, request
from app.models import db, Livro, Editora

def get_livros():
    livros = Livro.query.all()
    return jsonify([{
        "id": livro.id,
        "nome": livro.nome,
        "autor_id": livro.autor_id,
        "editora_id": livro.editora_id
    } for livro in livros]), 200

def create_livro():
    data = request.json
    novo_livro = Livro(
        nome=data['nome'],
        autor_id=data['autor_id'],
        editora_id=data['editora_id']
    )
    db.session.add(novo_livro)
    db.session.commit()
    return jsonify({"message": "Livro criado com sucesso"}), 201

def update_livro(livro_id):
    data = request.json
    livro = Livro.query.get(livro_id)

    if not livro:
        return jsonify({"error": "Livro não encontrado"}), 404

    livro.nome = data.get('nome', livro.nome)
    livro.editora_id = data.get('editora_id', livro.editora_id)

    db.session.commit()
    return jsonify({"message": "Livro atualizado com sucesso"}), 200

def delete_livro(livro_id):
    livro = Livro.query.get(livro_id)

    if not livro:
        return jsonify({"error": "Livro não encontrado"}), 404

    db.session.delete(livro)
    db.session.commit()
    return jsonify({"message": "Livro deletado com sucesso"}), 200
