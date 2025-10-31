import os
from flask import Flask, request, jsonify, send_from_directory
import joblib
from flask_cors import CORS
from google.auth.exceptions import RefreshError

import Gmail_Api_For_Spam_Ham

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__)
CORS(app)

# Try to load artifacts at startup; keep app alive even if they fail
model = None
vectorizer = None
try:
    model = joblib.load("spam_classifier_model.pkl")
    vectorizer = joblib.load("vectorizer.pkl")
except Exception as e:
    print(f"[startup] Failed to load artifacts: {e}")

# HTML landing page at "/"
@app.route("/", methods=["GET"])
def root_html():
    return send_from_directory(BASE_DIR, "index.html")

# Serve static assets used by index.html
@app.route("/style.css", methods=["GET"])
def serve_css():
    return send_from_directory(BASE_DIR, "style.css")

@app.route("/script.js", methods=["GET"])
def serve_js():
    return send_from_directory(BASE_DIR, "script.js")

# JSON health endpoint
@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "ready": model is not None and vectorizer is not None,
        "routes": ["/", "/health", "/classify", "/classify_unread"]
    })

@app.route("/classify", methods=["POST"])
def classify_message():
    if model is None or vectorizer is None:
        return jsonify({"error": "Model not loaded."}), 503

    payload = request.get_json(silent=True) or {}
    data = payload.get("message")
    if not data:
        return jsonify({"error": "Field `message` is required."}), 400

    message_vector = vectorizer.transform([data])
    prediction = model.predict(message_vector)[0]
    result = "spam" if int(prediction) == 1 else "ham"
    return jsonify({"result": result})

@app.route("/classify_unread", methods=["POST"])
def classify_unread():
    if model is None or vectorizer is None:
        return jsonify({"error": "Model not loaded."}), 503

    try:
        unread_mail_content = Gmail_Api_For_Spam_Ham.unreadMessage()
        if not unread_mail_content:
            return jsonify({"error": "No unread mails found."}), 404

        message_vector = vectorizer.transform([unread_mail_content])
        prediction = model.predict(message_vector)[0]
        result = "spam" if int(prediction) == 1 else "ham"
        return jsonify({"result": result, "content": unread_mail_content})

    except RefreshError:
        error_msg = (
            "Google API authentication failed. Your authorization token may be invalid. "
            "On the server, please delete the 'token.json' file and restart the application to re-authenticate."
        )
        return jsonify({"error": error_msg}), 500
    except Exception as e:
        # Catch other potential errors during the API call
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500


if __name__ == "__main__":
    # Important: When you first run this, you will need to authenticate in the console.
    # After that, it will use the token.json file.
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=True)