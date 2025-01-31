from flask import jsonify, request
from app.models import db, Editora, Livro

def get_editoras():
    editoras = Editora.query.all()
    return jsonify([{
        "id": editora.id,
        "nome": editora.nome,
        "livros_count": editora.livros_count
    } for editora in editoras]), 200

def create_editora():
    data = request.json
    nome = data.get('nome')

    if Editora.query.filter_by(nome=nome).first():
        return jsonify({"error": "Editora já cadastrada"}), 400

    nova_editora = Editora(nome=nome)
    db.session.add(nova_editora)
    db.session.commit()
    return jsonify({"message": "Editora criada com sucesso"}), 201

def update_editora(editora_id):
    data = request.json
    editora = Editora.query.get(editora_id)

    if not editora:
        return jsonify({"error": "Editora não encontrada"}), 404

    editora.nome = data.get('nome', editora.nome)
    db.session.commit()
    return jsonify({"message": "Editora atualizada com sucesso"}), 200

def delete_editora(editora_id):
    editora = Editora.query.get(editora_id)

    if not editora:
        return jsonify({"error": "Editora não encontrada"}), 404

    if Livro.query.filter_by(editora=editora_id).first():
        return jsonify({"error": "Não é possível excluir a editora, pois há livros associados"}), 400

    db.session.delete(editora)
    db.session.commit()
    return jsonify({"message": "Editora deletada com sucesso"}), 200
