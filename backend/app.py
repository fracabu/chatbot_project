from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS

# Configura l'app Flask
app = Flask(
    __name__,
    static_folder="../frontend",  # Percorso per i file statici
    static_url_path="/"          # URL per accedere ai file statici
)

CORS(app)  # Abilita il CORS per richieste frontend-backend

# Route per servire il file index.html
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, "index.html")

# Endpoint per la chat
@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get("message", "")
    # Esempio di logica per il bot
    if "menu" in user_message.lower():
        bot_response = "Ecco il nostro menu: Bruschetta, Carbonara, Tiramisù e tanto altro!"
    else:
        bot_response = "Mi spiace, non ho capito. Puoi chiedermi informazioni sul menu o prenotazioni."
    return jsonify({
        "message": bot_response,
        "status": "success"
    })

# Endpoint per le prenotazioni
@app.route('/reservations', methods=['GET', 'POST'])
def reservations():
    if request.method == 'GET':
        return jsonify([
            {"id": 1, "name": "Prenotazione Tavolo per 2"},
            {"id": 2, "name": "Prenotazione Tavolo per 4"}
        ])
    elif request.method == 'POST':
        data = request.json
        return jsonify({
            "message": f"Prenotazione ricevuta per {data.get('name', 'ospite')}!",
            "status": "success"
        })

# Route per servire i file statici (CSS, JS, immagini)
@app.route('/<path:path>')
def serve_static_files(path):
    return send_from_directory(app.static_folder, path)

# Avvio del server
if __name__ == '__main__':
    app.run(debug=True)
