const resultContainer = document.getElementById('result-container');
const resultTitle = document.getElementById('result-title');
const resultContent = document.getElementById('result-content');

function displayResult(title, content, type) {
    // Add a 'show' class to trigger the CSS animation
    resultContainer.className = `result-container ${type} show`;
    resultTitle.innerText = title;
    resultContent.innerText = content || 'No additional content to display.';
}

getDetails();
async function getDetails() {
    const username = "R3curs1on"; // You can also get this from an input field
    const response = await fetch(`https://api.github.com/users/${username}`);
    const data = await response.json()
    document.getElementById('output').style.display = "block";
    document.getElementById('bio').innerText = data.bio || "No bio available"; //
    document.getElementById('name').innerText = data.name;
    document.getElementById('profile').innerHTML = `<img src="${data.avatar_url}" width="100">`;
}

console.log("GitHub Profile Data Fetched Successfully");

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