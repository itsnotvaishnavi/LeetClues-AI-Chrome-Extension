# 🚀 LeetClues — AI-Powered Progressive Coding Hint Extension

LeetClues is a Chrome extension that provides progressive AI-generated hints for LeetCode problems **without revealing full solutions**. It uses a Node.js backend integrated with the Groq LLM API to generate contextual hints in real-time.

---

## 🎥 Demo

https://github.com/user-attachments/assets/a6864d24-57a1-4907-b30d-15944e456edb

---

## ✨ Features

- 🔍 Automatically detects the LeetCode problem from the active tab
- 🧠 Generates progressive hints (Hint 1 → Hint 2 → Hint 3)
- ⚡ Uses Groq LLM API for fast real-time inference
- 🎨 Clean, modern, and responsive popup UI
- 🔒 Ensures solutions are never fully revealed

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

1. Open any LeetCode problem in your browser
2. Click the **LeetClues** extension icon
3. Click **Get Hint**
4. Each click provides a progressively stronger hint — without spoiling the solution

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
