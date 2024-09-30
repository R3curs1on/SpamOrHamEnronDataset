#Import necessary libraries.

import  pandas as pd
import  numpy as np
#from scipy.special import result
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB


# Load the preprocessed data
pd.set_option('display.max_rows', 100000000)                              # now console can show 1000 rows
pd.set_option('display.max_columns', 100000000)                           # console can show 1000 columns
pd.set_option('display.width', 100000000)                                 # console will take width in 1000 units  so text won't be wrapped in ,

df_raw = pd.read_csv(r".venv/enron_spam_data.csv" ,dtype=str ,low_memory=False)

#remove the columns with nan values (data cleaning)
NaNColumns= [ x for x in df_raw.columns if x.startswith('Unnamed')]  # col with nan values

df_raw=df_raw.drop(columns=NaNColumns)  #remove the columns with nan values

#now kind of vectorize this spam or ham into numbers so that we can use it in model in form of matrix
df_raw["Spam/Ham"]=df_raw['Spam/Ham'].apply(lambda x :1 if x=="spam" else 0)  # cleaned all data with spam as 1 and ham as 0

# as in next steps we can train with only one variable ( message or subject) so we can combine both in one variable (column Combined)
df_raw['Combined']=df_raw['Subject']+" "+df_raw['Message']  # combine subject and message
df_raw=df_raw.drop(columns=['Subject','Message'])  # remove subject and message columns to avoid redundancy and as they are of no use now

df_raw = df_raw.dropna(subset=['Combined'])  # remove nan values from combined column as it can give errors in future


# create train test split
input_label = df_raw['Combined']
output_label = df_raw["Spam/Ham"]

#print(df_raw)
input_train, input_test, output_train, output_test = train_test_split(input_label, output_label, test_size=0.2)

# count vectorizer ; this will convert the text data into numerical data each word will be stored in numerical form in matrix called as tokenCount
cv = CountVectorizer()


# Creating vocabulary ; fit_transform is method to take data or vocabulary (here it is from our input_train) and the resulting sparce matrix (of words count of each mail ) is stored in input_train_count variable
input_train_vocabulary = cv.fit_transform(input_train)

# Train the model
model = MultinomialNB()  # Muntinomial Naive Bayes model is loaded
model.fit(input_train_vocabulary, output_train)  # fit method trains model on sparce matrix `x_train_coun` with label `y_train`  ; so eventually model learns/ gets fimiliar with the data

# Evaluation of model ; we test the model on test data to check the accuracy of the model ;
input_test_vocabulary = cv.transform(input_test)
accuracy = model.score(input_test_vocabulary, output_test)
print(f'Accuracy: {accuracy}')


#time to test the model
email_ham = ["No More Guessing: Confirm Email Receipt Instantly!\nExternal\nInbox\n\nTom - MailTracker <tom@email.getmailtracker.com> Unsubscribe\n9:57 PM (54 minutes ago)\nto me\n\n\nHi MailTracker user,\n\nIf you want to make your communication smoother and more efficient, this feature is for you!\n\n\nYou probably see the two button when you are reading an email 'Read Receipt' & 'I'll Reply Later'. But did you try it?\n\n\nRead Receipt\n\nEver wondered if your email has been seen? Our Read Receipt feature eliminates the guesswork. With just one click, you can send a notification to your email recipients, letting them know you've seen their message. This simple yet powerful tool reassures senders that their message has not gone unnoticed, fostering a more responsive and transparent communication environment.\n\n\nI'll Reply Later\n\nWe understand that you're not always able to respond to emails immediately. The 'I'll Reply Later' option allows you to inform senders with a single click that you've received their email and will get back to them at a later time. This feature helps manage expectations and keeps the communication line open, ensuring senders that their message is important to you.\n\n\nWant to learn more? You can read our article.\n\n\nHappy sending!\n\nTom\n\n-- "]

email_ham_count = cv.transform(email_ham)
ans="Spam" if model.predict(email_ham_count) == 1 else "Ham"
print(ans)
#model.predict(email_ham_count)

