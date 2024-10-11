import os
import pickle
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from base64 import urlsafe_b64decode

SCOPES = ['https://mail.google.com/']
our_email = 'Your-Mail-Where-You-Will-Recieve-Mails-To-Be-Checked@gmail.com'


def gmail_authenticate():
    creds = None
    if os.path.exists("token.pickle"):              # token.pickle is file where we store the credentials its like a session its autogenerated when we run the code for first time
        with open("token.pickle", "rb") as token:
            creds = pickle.load(token)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'client_secret_xxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com.json', SCOPES)  # Replace with your own client secret file
            creds = flow.run_local_server(port=0)
        with open("token.pickle", "wb") as token:
            pickle.dump(creds, token)
    return build('gmail', 'v1', credentials=creds)


service = gmail_authenticate()
#print("Authenticated successfully!")


def search_messages(service, query):
    result = service.users().messages().list(userId='me', q=query).execute()
    messages = result.get('messages', [])
    return messages


def read_message(service, message):
    msg = service.users().messages().get(userId='me', id=message['id'], format='full').execute()
    payload = msg.get('payload', {})
    headers = payload.get('headers', [])
    parts = payload.get('parts', [])

    mail_content = ""

    for header in headers:
        name = header.get("name")
        value = header.get("value")
        if name.lower() == 'from':
            mail_content += f"From: {value}\n"
        elif name.lower() == 'to':
            mail_content += f"To: {value}\n"
        elif name.lower() == 'subject':
            mail_content += f"Subject: {value}\n"
        elif name.lower() == 'date':
            mail_content += f"Date: {value}\n"

    for part in parts:
        if part.get("mimeType") == "text/plain":
            data = part['body'].get('data')
            if data:
                mail_content += urlsafe_b64decode(data).decode()

    return mail_content


# Search for unread messages
query = "is:unread"
unread_messages = search_messages(service, query)

if unread_messages:
    #print(f"Found {len(unread_messages)} unread messages.")
    message = unread_messages[0]  # Get the topmost unread message
    message_read = read_message(service, message)
    #print(message_read)  # Just print the message content

else:
    print("No unread messages found.")

def unreadMessage():
    return message_read