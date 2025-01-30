from app.routes import create_app  # Importa a função create_app do arquivo routes.py
from flask_cors import CORS

app = create_app()  # Cria o aplicativo Flask
CORS(app)  # Habilita CORS antes de rodar o app

if __name__ == '__main__':
    app.run(debug=True)  # Roda o aplicativo no modo debug
