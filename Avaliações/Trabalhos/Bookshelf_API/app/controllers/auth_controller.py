from flask import jsonify, request
from werkzeug.security import check_password_hash, generate_password_hash
from app.models import db, Autor
import jwt
import datetime

SECRET_KEY = "sua_secret_key"

def login():
    data = request.json
    email = data.get('email')
    senha = data.get('senha')
    autor = Autor.query.filter_by(email=email).first()

    if autor and check_password_hash(autor.senha, senha):
        token = jwt.encode(
            {"id": autor.id, "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)},
            SECRET_KEY,
            algorithm="HS256"
        )
        return jsonify({"token": token}), 200

    return jsonify({"error": "Credenciais inválidas"}), 401

def register():
    data = request.json
    nome = data.get('nome')
    email = data.get('email')
    senha = data.get('senha')

    if Autor.query.filter_by(email=email).first():
        return jsonify({"error": "Email já cadastrado"}), 400

    hashed_senha = generate_password_hash(senha, method="sha256")
    novo_autor = Autor(nome=nome, email=email, senha=hashed_senha)

    db.session.add(novo_autor)
    db.session.commit()
    return jsonify({"message": "Usuário registrado com sucesso"}), 201
