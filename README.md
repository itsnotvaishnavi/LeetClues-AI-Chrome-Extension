# 🚀 LeetClues — AI-Powered Progressive Coding Hint Extension

LeetClues is a Chrome extension that provides progressive AI-generated hints for LeetCode problems **without revealing full solutions**. It uses a Node.js backend integrated with the Groq LLM API to generate contextual hints in real-time.

---

## 🎥 Demo

https://github.com/user-attachments/assets/a6864d24-57a1-4907-b30d-15944e456edb





---

## ✨ Features

- 🔍 **Problem Detection:** Automatically detects the LeetCode problem from the active tab.
- 🧠 **Progressive Hint System:** Generates progressive hints (Hint 1 → Hint 2 → Hint 3) with alternative and optimized approaches at advanced levels.
- 🤖 **Auto-Mentor & Code Analysis:** Extracts code directly from the LeetCode editor or popup to analyze your progress and logic gaps.
- 🕒 **Idle Tracking:** A non-intrusive floating AI mentor automatically appears with guidance if you're stuck for a set period of time.
- 💡 **Reveal Solution:** Clears hint history and explicitly shows the final solution when requested.
- 📚 **Learning Resources:** Direct integration with GeeksforGeeks to explore topics further.
- ⚡ **Lightning Fast:** Uses Groq LLM API (`llama-3.1-8b-instant`) for fast real-time inference.

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/itsnotvaishnavi/Leetclues.git
```

### 2. Navigate to the project directory

```bash
cd Leetclues
```

### 3. Install backend dependencies

```bash
npm install
```

### 4. Create a `.env` file in the root directory

```env
GROQ_API_KEY=your_groq_api_key_here
```

> 👉 Get your free API key at [https://console.groq.com/](https://console.groq.com/)  
> ⚠️ Do **NOT** commit your `.env` file to version control.

---

## 🚀 Usage

### Start the backend server

```bash
node server.mjs
```

### Load the Chrome Extension

1. Go to `chrome://extensions/`
2. Enable **Developer Mode** (toggle in the top-right corner)
3. Click **Load Unpacked**
4. Select the project folder

---

## 💡 How It Works

1. **Auto Tracking**: Open any LeetCode problem. The Auto-Mentor will run in the background. If you're stuck for 15 seconds, a floating AI mentor will analyze your code and provide guidance natively on the page.
2. **Manual Hints**: Click the **LeetClues** extension icon and click **Get Hint** or paste your code for instant, progressive feedback.
3. **Progressive System**: Each click provides a progressively stronger hint. Advanced levels show alternative and optimized approaches.
4. **Reveal Solution**: If you're absolutely stuck, use the "Reveal Solution" feature to clear your history and get the final answer.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Chrome Extension | JavaScript (Manifest V3) |
| Backend | Node.js + Express.js |
| AI Inference | Groq LLM API |
| Communication | RESTful API |

---

## 📁 Project Structure

```
Leetclues/
├── manifest.json       # Chrome extension manifest (MV3)
├── popup.html          # Extension popup UI
├── popup.js            # Popup logic & API calls
├── content.js          # Content script to detect problem
├── server.mjs          # Express backend server
├── .env                # API key (do not commit)
└── package.json        # Node.js dependencies
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

> Built with ❤️ to make coding interviews less stressful.
