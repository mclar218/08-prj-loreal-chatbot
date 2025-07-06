/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Set initial message
chatWindow.innerHTML = `<div class="msg ai">👋 Hello! How can I help you today?</div>`;

// Store chat history for context
let messages = [
  {
    role: "system",
    content:
      "You are a helpful assistant for L'Oréal product advice. Only answer questions about L'Oréal products, beauty routines, recommendations, or beauty-related topics. If a question is not related to these, politely reply: 'Sorry, I can only answer questions about L'Oréal products, beauty routines, or beauty-related topics.'",
  },
];

// Helper to add a message to the chat window
function addMessage(text, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `msg ${sender}`;
  msgDiv.textContent = text;
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const question = userInput.value.trim();
  if (!question) return;

  // Show user message
  addMessage(question, "user");
  messages.push({ role: "user", content: question });
  userInput.value = "";

  // Show loading message
  addMessage("Thinking...", "ai");

  try {
    // Call OpenAI API (will only work if CORS is handled or via a backend proxy)
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: messages,
        max_tokens: 200,
      }),
    });
    const data = await response.json();
    // Remove loading message
    chatWindow.removeChild(chatWindow.lastChild);
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const aiText = data.choices[0].message.content.trim();
      addMessage(aiText, "ai");
      messages.push({ role: "assistant", content: aiText });
    } else {
      addMessage("Sorry, I couldn't get a response. Please try again.", "ai");
    }
  } catch (err) {
    // Remove loading message
    chatWindow.removeChild(chatWindow.lastChild);
    addMessage("Error connecting to OpenAI API.", "ai");
  }
});
