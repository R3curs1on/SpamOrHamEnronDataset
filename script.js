const resultContainer = document.getElementById('result-container');
const resultTitle = document.getElementById('result-title');
const resultContent = document.getElementById('result-content');

function displayResult(title, content, type) {
    // Add a 'show' class to trigger the CSS animation
    resultContainer.className = `result-container ${type} show`;
    resultTitle.innerText = title;
    resultContent.innerText = content || 'No additional content to display.';
}

async function classifyMessage() {
    const message = document.getElementById('message').value;
    if (!message) {
        alert('Please enter a message to classify.');
        return;
    }

    // Show processing state
    displayResult('Processing...', 'Classifying your message...', 'processing');

    try {
        const response = await fetch('http://127.0.0.1:5000/classify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const resultType = data.result; // 'spam' or 'ham'
        displayResult(`Classification: ${resultType.toUpperCase()}`, message, resultType);

    } catch (error) {
        console.error('Error:', error);
        displayResult('Error', 'An error occurred while classifying the message.', 'error');
    }
}

async function classifyUnread() {
    displayResult('Processing...', 'Fetching and classifying the latest unread email...', 'processing');

    try {
        const response = await fetch('http://127.0.0.1:5000/classify_unread', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.error) {
            displayResult('Info', data.error, 'error');
        } else {
            const resultType = data.result;
            displayResult(`Unread Mail Classified as: ${resultType.toUpperCase()}`, data.content, resultType);
        }
    } catch (error) {
        console.error('Error:', error);
        displayResult('Error', 'An error occurred while classifying unread emails.', 'error');
    }
}