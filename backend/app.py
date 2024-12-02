from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Configurazione base SQLite per sviluppo locale
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///restaurant.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Modelli Database
class MenuItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50), nullable=False)

class Reservation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    guests = db.Column(db.Integer, nullable=False)

@app.route('/')
def home():
    return "Welcome to the Chatbot API! You can interact with /chat to talk to the chatbot or /reservations to make a booking."

@app.route('/chat', methods=['POST'])
def chatbot():
    user_message = request.json.get('message', '').lower()
    
    # Risposte predefinite
    if "menu" in user_message:
        menu_items = MenuItem.query.all()
        menu_text = "Il nostro menu:\n"
        for item in menu_items:
            menu_text += f"- {item.name}: €{item.price} - {item.description}\n"
        return jsonify({"reply": menu_text})
    
    elif "prenotare" in user_message or "prenotazione" in user_message:
        return jsonify({
            "reply": "Puoi prenotare un tavolo chiamandoci al numero +39 123 456 789 o compilando il form online."
        })
    
    elif "orari" in user_message or "apertura" in user_message:
        return jsonify({
            "reply": "Siamo aperti dal lunedì alla domenica, dalle 12:00 alle 23:00."
        })
    
    else:
        return jsonify({
            "reply": "Come posso aiutarti? Posso fornirti informazioni su menu, prenotazioni, orari e altro."
        })

@app.route('/reservations', methods=['POST'])
def create_reservation():
    try:
        data = request.json
        reservation = Reservation(
            name=data['name'],
            email=data['email'],
            phone=data['phone'],
            date=datetime.fromisoformat(data['date']),
            guests=data['guests']
        )
        db.session.add(reservation)
        db.session.commit()
        return jsonify({"message": "Prenotazione ricevuta con successo!"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    # Creiamo il contesto dell'applicazione
    with app.app_context():
        # Creiamo il database e le tabelle
        db.create_all()
        
        # Aggiungiamo alcuni menu items di esempio se il database è vuoto
        if not MenuItem.query.first():
            items = [
                MenuItem(
                    name="Margherita",
                    description="Pomodoro, mozzarella e basilico",
                    price=8.00,
                    category="pizze"
                ),
                MenuItem(
                    name="Carbonara",
                    description="Spaghetti con uova, guanciale e pecorino",
                    price=12.00,
                    category="primi"
                ),
                MenuItem(
                    name="Insalata Mista",
                    description="Insalata verde, pomodori, carote",
                    price=6.00,
                    category="insalate"
                )
            ]
            for item in items:
                db.session.add(item)
            db.session.commit()
    
    app.run(debug=True)
