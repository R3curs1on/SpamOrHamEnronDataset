# Spam or Ham Email Classifier

This project is a web application that uses a machine learning model to classify emails as "Spam" or "Ham" (not spam). It features a clean, modern web interface and can classify messages in two ways: either by manually pasting the email text or by automatically fetching and classifying your latest unread email from your Gmail account.

The core of the classifier is a **Multinomial Naive Bayes** model trained on the public Enron email dataset.

![SpamGuard Interface](![img.png](img.png))
*(Image placeholder: A screenshot of the web application's user interface would be great here!)*

---

## Features

-   **Interactive Web Interface**: A user-friendly, single-page application for easy interaction.
-   **Manual Classification**: Paste any email content into a text area to get an instant classification.
-   **Gmail Integration**: Securely connect to your Gmail account to classify your most recent unread email with a single click.
-   **Clear Visual Feedback**: The interface dynamically updates to show whether a message is Spam, Ham, or if an error occurred.
-   **Smooth Navigation**: A responsive, smooth-scrolling design for a better user experience.

---

## Technology Stack

-   **Backend**:
    -   **Python**: The core programming language.
    -   **Flask**: A micro web framework for serving the application and API endpoints.
    -   **Scikit-learn**: For building and using the Naive Bayes machine learning model.
    -   **Joblib**: For saving and loading the trained model and vectorizer.
    -   **Google API Client for Python**: To interact with the Gmail API.

-   **Frontend**:
    -   **HTML5**: For the structure of the web page.
    -   **CSS3**: For modern styling and a responsive layout.
    -   **JavaScript**: For handling user interactions and making API calls to the Flask backend.

-   **Dataset**:
    -   **Enron Email Dataset**: Used to train the spam classifier.

---

## Setup and Installation

Follow these steps to get the project running on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/R3curs1on/SpamOrHamEnronDataset.git
cd SpamOrHamEnronDataset
```

### 2. Set Up a Python Virtual Environment

It's highly recommended to use a virtual environment to manage project dependencies.

```bash
# For Windows
python -m venv venv
.\venv\Scripts\activate

# For macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Required Libraries

Install all the necessary Python packages using pip.

```bash
pip install pandas scikit-learn joblib Flask flask-cors google-api-python-client google-auth-oauthlib
```

### 4. Configure the Gmail API

To use the "Classify Latest Unread" feature, you need to enable the Gmail API and get credentials.

1.  **Go to the Google Cloud Console** and create a new project (or select an existing one).
2.  **Enable the Gmail API**: In your project dashboard, go to "APIs & Services" > "Library", search for "Gmail API", and click "Enable".
3.  **Configure OAuth Consent Screen**:
    -   Go to "APIs & Services" > "OAuth consent screen".
    -   Choose **External** and click "Create".
    -   Fill in the required fields (App name, User support email, Developer contact). You can leave most fields blank for now.
    -   On the "Scopes" page, don't add any scopes.
    -   On the "Test users" page, click **"Add Users"** and add the email address of the Gmail account you want to test with. **This is a critical step.**
4.  **Create Credentials**:
    -   Go to "APIs & Services" > "Credentials".
    -   Click **"+ CREATE CREDENTIALS"** and select **"OAuth client ID"**.
    -   For "Application type", select **"Desktop app"**.
    -   Give it a name (e.g., "Spam Classifier Desktop App") and click "Create".
5.  **Download and Rename the Credentials File**:
    -   A window will pop up with your credentials. Click **"DOWNLOAD JSON"**.
    -   Rename the downloaded file from `client_secret_....json` to exactly **`credentials.json`**.
    -   Place this `credentials.json` file in the root directory of the project.

---

## How to Run the Application

1.  **Start the Flask Server**:
    Make sure your virtual environment is active and you are in the project's root directory. Then, run the `app.py` script.

    ```bash
    python app.py
    ```

2.  **Open the Web Interface**:
    Open your web browser and go to the following address:

    ```
    http://127.0.0.1:5000
    ```

3.  **Use the Classifier**:
    -   **To classify manually**: Paste text into the text area and click the "Classify Manually" button.
    -   **To classify from Gmail**: Click the "Classify Latest Unread" button. The **first time** you do this, your browser will open a new tab asking you to log in to your Google account and grant permission. After you approve, the app will fetch and classify the email. A `token.json` file will be created to remember your consent, so you won't have to log in again.

---

## Project Structure

```
.
├── app.py                      # Flask web server and API endpoints.
├── Gmail_Api_For_Spam_Ham.py   # Handles all Gmail API authentication and interaction.
├── NaiveBayes_Big_data_set.py  # Script to train the ML model from the dataset.
├── index.html                  # The main HTML file for the web interface.
├── style.css                   # CSS for styling the web interface.
├── script.js                   # JavaScript for frontend logic and API calls.
├── spam_classifier_model.pkl   # The pre-trained machine learning model.
├── vectorizer.pkl              # The pre-fitted CountVectorizer.
├── enron_spam_data.csv         # The dataset used for training.
├── credentials.json            # (You must create this) Your application's API credentials.
└── token.json                  # (Auto-generated) Stores the user's permission token.
```