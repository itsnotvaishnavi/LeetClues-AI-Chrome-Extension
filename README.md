# 🚀 LeetClues — AI-Powered Progressive Coding Hint Extension

LeetClues is a Chrome extension that provides progressive AI-generated hints for LeetCode problems without revealing full solutions.  
The extension uses a Node.js backend integrated with the Groq LLM API to generate contextual hints in real-time.

---

## ✨ Features

- Automatically detects the LeetCode problem name from the active tab.
- Generates multi-level progressive hints (Hint 1 → Hint 2 → Hint 3).
- Uses Groq LLM API for real-time AI inference.
- Displays hints in a modern, responsive popup interface.
- Ensures solutions are never fully revealed.

---

## 📦 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/itsnotvaishnavi/Leetclues.git
   ```

2. Navigate to the project directory:

   ```bash
   cd Leetclues
   ```

3. Install backend dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and add your Groq API key:

   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```

   You can generate a free API key from:

   👉 https://console.groq.com/

   ⚠️ Do NOT commit your `.env` file.

5. Ensure the Chrome extension files (`manifest.json`, `popup.html`, `popup.js`) are present in the root directory.

---

## 🚀 Usage

1. Start the backend server:

   ```bash
   node server.mjs
   ```

2. Load the Chrome extension:

   - Go to `chrome://extensions/` in your browser.
   - Enable **Developer Mode** (top-right corner).
   - Click **Load Unpacked**.
   - Select the project directory.

3. Open any LeetCode problem and click the **LeetClues** extension.

Each click on **Get Hint** provides a progressively stronger hint.

---

## 🛠 Tech Stack

- JavaScript (Chrome Extension - Manifest V3)
- Node.js
- Express.js
- Groq LLM API
- RESTful API Integration

---

## 👩‍💻 Author

Vaishnavi Choudha  
GitHub: https://github.com/itsnotvaishnavi
