document.addEventListener("DOMContentLoaded", () => {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");

    sendBtn.addEventListener("click", () => sendMessage());
    userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
    });

    function sendMessage() {
        let message = userInput.value.trim();
        if (message === "") return;

        const formattedMessage = `${message} {Give pointwise answer in easy language. Use new line for new points. You can also use emojis.}`;

        appendMessage("user", message);
        userInput.value = "";

        fetchChatbotResponse(formattedMessage);
    }

    function appendMessage(role, text) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", role === "user" ? "user-message" : "bot-message");
        messageDiv.innerHTML = text.replace(/\n/g, "<br>");
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function fetchChatbotResponse(userMessage) {
        const data = JSON.stringify({
            messages: [{ role: 'user', content: userMessage }],
            web_access: false
        });

        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE) {
                try {
                    const response = JSON.parse(this.responseText);
                    if (response && response.result) {
                        appendMessage("bot", response.result);
                    } else {
                        appendMessage("bot", "🤖 Sorry, I didn't understand that.");
                    }
                } catch (error) {
                    appendMessage("bot", "⚠️ Error: Unable to fetch response.");
                }
            }
        };

        xhr.open('POST', 'https://open-ai21.p.rapidapi.com/conversationllama'); // Replace with new endpoint if needed
        xhr.setRequestHeader('x-rapidapi-key', '365eaa4d46msh5dd5fa6a14c5730p15cb41jsnff505ae6a20e'); // 🔐 Replace this with your actual key
        xhr.setRequestHeader('x-rapidapi-host', 'open-ai21.p.rapidapi.com');
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.send(data);
    }
});
