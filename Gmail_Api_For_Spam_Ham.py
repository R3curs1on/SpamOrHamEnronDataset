import os
import json
from google.auth.exceptions import RefreshError
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from base64 import urlsafe_b64decode

SCOPES = ['https://mail.google.com/']


def gmail_authenticate():
    """
    Authenticates with the Gmail API. Handles token creation, loading, and refreshing.
    Stores user's permission token in token.json.
    """
    creds = None
    # The file token.json stores the user's access and refresh tokens.
    # It is created automatically after the first successful authorization.
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)

    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            try:
                creds.refresh(Request())
            except RefreshError as e:
                print(f"Authentication failed: {e}")
                print("Your refresh token is invalid. Please delete 'token.json' and re-authenticate.")
                raise  # Re-raise the exception to be caught by the Flask app
        else:
            # This requires the 'credentials.json' file from Google Cloud Console
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)

        # Save the credentials (the token) for the next run
        with open("token.json", "w") as token:
            token.write(creds.to_json())

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

    body_data = None
    if parts:
        for part in parts:
            if part.get("mimeType") == "text/plain":
                body_data = part['body'].get('data')
                break  # Found the plain text part
    # If no plain text part, check the main body (for simple emails)
    elif 'body' in payload and 'data' in payload['body']:
        body_data = payload['body'].get('data')

    if body_data:
        mail_content += "\n" + urlsafe_b64decode(body_data).decode('utf-8', 'ignore')

    # Mark the message as read after processing
    service.users().messages().modify(userId='me', id=message['id'], body={'removeLabelIds': ['UNREAD']}).execute()

    return mail_content


def unreadMessage():
    """
    Authenticates, finds the latest unread message, reads its content,
    and marks it as read.
    """
    try:
        service = gmail_authenticate()
        query = "is:unread"
        unread_messages = search_messages(service, query)

        if unread_messages:
            message = unread_messages[0]  # Get the topmost unread message
            message_read = read_message(service, message)
            return message_read

        return None
    except Exception as e:
        print(f"An error occurred in unreadMessage: {e}")
        raise
