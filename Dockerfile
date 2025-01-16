# Usar a imagem base do Python
FROM python:3.9-slim

# Definir o diretório de trabalho
WORKDIR /app

# Copiar os arquivos de requisitos e instalar as dependências
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

# Copiar todos os arquivos do projeto para o diretório de trabalho
COPY . .

# Comando para executar a aplicação
CMD ["python", "app.py"]
