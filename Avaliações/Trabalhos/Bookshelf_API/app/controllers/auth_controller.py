from flask import jsonify, request
from werkzeug.security import check_password_hash, generate_password_hash
from app.models import db, Autor
import jwt
import datetime
import os

SECRET_KEY = os.getenv('second_secret_key')

def login():
    # Certifique-se de que o conteúdo recebido é JSON
    if request.is_json:
        data = request.get_json()  # Pegando os dados JSON da requisição
        email = data.get('email')
        senha = data.get('senha')
        
        autor = Autor.query.filter_by(email=email).first()
        
        if autor and check_password_hash(autor.senha, senha):
            # Gera o token
            token = jwt.encode(
                {"id": autor.id, "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)},
                SECRET_KEY,
                algorithm="HS256"
            )
            return jsonify({"token": token}), 200  # Retorna o token em formato JSON
        
        return jsonify({"error": "Credenciais inválidas"}), 401  # Retorna erro em formato JSON
    else:
        return jsonify({"error": "Expected JSON in request"}), 400

def register():
    print(f'>>> Request: {request}')
    data = request.get_json()  # Pega os dados JSON da requisição

    if not data:
        return {"error": "JSON não encontrado no corpo da requisição"}, 400

    nome = data.get('nome')
    email = data.get('email')
    senha = data.get('senha')

    if Autor.query.filter_by(email=email).first():
        return {"error": "Email já cadastrado"}, 400

    hashed_senha = generate_password_hash(senha, method="sha256")
    novo_autor = Autor(nome=nome, email=email, senha=hashed_senha)

    db.session.add(novo_autor)
    db.session.commit()
    return {"message": "Usuário registrado com sucesso"}, 201

