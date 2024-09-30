# SpamOrHam

This project implements a Naive Bayes Classifier to detect spam or ham (non-spam) emails using the Enron Spam Dataset. The process involves data cleaning, vectorization of email content, and model training for classification.
Key Features

    Preprocesses raw email data by cleaning NaN values and combining the subject and message fields.
    Converts email content into a sparse matrix using CountVectorizer.
    Trains a Multinomial Naive Bayes model on the cleaned dataset.
    Evaluates the model's performance on a test set with accuracy scoring.
    Classifies sample emails as "Spam" or "Ham."

Steps:

    Data Cleaning: Removes unnecessary columns and rows with NaN values.
    Vectorization: Combines email subject and message into a single feature, then transforms the text data into numerical form.
    Model Training: Uses the vectorized data to train the Naive Bayes classifier.
    Model Evaluation: Splits the data into training and testing sets and evaluates model accuracy.
    Prediction: Classifies new emails as spam or ham based on the trained model.

Example:
    A sample email is tested, and the model predicts whether it's spam or ham.

Installation:
Install the required libraries:

`pip install pandas numpy scikit-learn`

Load the dataset:

`enron_spam_data.csv`

Sample Mail is on Line 58 named email_ham   
Note - Change your desired mail in this variable only `email_ham`

`
email_ham = ["No More Guessing: Confirm Email Receipt Instantly!\nExternal\nInbox\n\nTom - MailTracker <tom@email.getmailtracker.com> Unsubscribe\n9:57 PM (54 minutes ago)\nto me\n\n\nHi MailTracker user,\n\nIf you want to make your communication smoother and more efficient, this feature is for you!\n\n\nYou probably see the two button when you are reading an email 'Read Receipt' & 'I'll Reply Later'. But did you try it?\n\n\nRead Receipt\n\nEver wondered if your email has been seen? Our Read Receipt feature eliminates the guesswork. With just one click, you can send a notification to your email recipients, letting them know you've seen their message. This simple yet powerful tool reassures senders that their message has not gone unnoticed, fostering a more responsive and transparent communication environment.\n\n\nI'll Reply Later\n\nWe understand that you're not always able to respond to emails immediately. The 'I'll Reply Later' option allows you to inform senders with a single click that you've received their email and will get back to them at a later time. This feature helps manage expectations and keeps the communication line open, ensuring senders that their message is important to you.\n\n\nWant to learn more? You can read our article.\n\n\nHappy sending!\n\nTom\n\n-- "]
`

Usage:

To train the model and classify an email, run the provided script:

`python NaiveBayes_Big_data_set.py`
