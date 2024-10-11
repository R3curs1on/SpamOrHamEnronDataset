from flask import Flask, request, jsonify
import joblib
from flask_cors import CORS

import Gmail_Api_For_Spam_Ham

#import 'Gmail_Api_For_Spam_Ham'
# Load the trained model and vectorizer
model = joblib.load("spam_classifier_model.pkl")
vectorizer = joblib.load("vectorizer.pkl")

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/classify', methods=['POST'])
def classify_message():
    # Get message from frontend (request in JSON format)
    data = request.json['message']
    
    # Vectorize the input message using the saved vectorizer
    message_vector = vectorizer.transform([data])
    
    # Predict using the trained model
    prediction = model.predict(message_vector)
    
    # Determine if the message is spam or ham
    result = "spam" if prediction == 1 else "ham"
    
    # Return the result as a JSON response
    return jsonify({'result': result})


@app.route('/classify_unread', methods=['POST'])
def classify_unread():
    # Get the unread mail content from the Gmail API script

    unread_mail_content = Gmail_Api_For_Spam_Ham.unreadMessage()


    if unread_mail_content:
        # Vectorize the extracted mail content
        message_vector = vectorizer.transform([unread_mail_content])

        # Predict using the trained model
        prediction = model.predict(message_vector)

        # Determine if the message is spam or ham
        result = "spam" if prediction == 1 else "ham"

        # Return the result as a JSON response
        return jsonify({'result': result, 'content': unread_mail_content})

    return jsonify({'error': 'No unread mails found.'})



if __name__ == '__main__':
    app.run(debug=True)
