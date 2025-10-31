import os
import pickle
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from base64 import urlsafe_b64decode

SCOPES = ['https://mail.google.com/']

def gmail_authenticate():
    creds = None
    if os.path.exists("token.pickle"):
        with open("token.pickle", "rb") as token:
            creds = pickle.load(token)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json') # Make sure your credentials file is named credentials.json
            creds = flow.run_local_server(port=0)
        with open("token.pickle", "wb") as token:
            pickle.dump(creds, token)
    return build('gmail', 'v1', credentials=creds)

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
        if name.lower() in ['from', 'to', 'subject', 'date']:
            mail_content += f"{name}: {value}\n"

    for part in parts:
        if part.get("mimeType") == "text/plain":
            data = part['body'].get('data')
            if data:
                mail_content += urlsafe_b64decode(data).decode()
    
    # Mark the message as read after processing
    service.users().messages().modify(userId='me', id=message['id'], body={'removeLabelIds': ['UNREAD']}).execute()

    return mail_content

def unreadMessage():
    """
    Authenticates, finds the latest unread message, reads its content,
    and marks it as read.
    """
    service = gmail_authenticate()
    query = "is:unread"
    unread_messages = search_messages(service, query)

    if unread_messages:
        message = unread_messages[0]  # Get the topmost unread message
        message_read = read_message(service, message)
        return message_read
    
    return None
