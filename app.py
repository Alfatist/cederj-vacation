from flask import Flask, request, jsonify, send_from_directory

app = Flask(__name__)

def calcular_nota_ap2(ad1, ap1, ad2):
    # Cálculo de N1 usando as notas da AD1 e AP1
    N1 = (ad1 * 2 + ap1 * 8) / 10

    # Calculando a nota necessária em N2 para que a média N seja no mínimo 6
    N2_necessario = 12 - N1

    # Calculando a nota necessária na AP2 com base no N2 necessário e na nota da AD2
    ap2_necessario = (N2_necessario * 10 - ad2 * 2) / 8

    return ap2_necessario

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json
    ad1 = float(data['ad1'])
    ap1 = float(data['ap1'])
    ad2 = float(data['ad2'])
    nota_ap2 = calcular_nota_ap2(ad1, ap1, ad2)
    return jsonify({ 'nota_ap2': nota_ap2 })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
