# Chat Log Cleaner & Tokenizer

A secure, client-side utility designed to parse, clean, and format raw social media chat exports (JSON) into token-efficient text suitable for Large Language Models (LLMs).

## 🔒 Privacy First

**100% Local Processing**: This application runs entirely in your browser using JavaScript. 
- No data is ever uploaded to any server.
- All parsing, regex matching, and cleaning happens in your device's memory.
- You can disconnect from the internet while using this tool for extra security.

## ✨ Features

- **Format Parsing**: Handles standard JSON chat structures (compatible with common WeChat/Social export tools).
- **Smart Redaction**:
  - **Auto-Anonymization**: Replaces real names with generic aliases (User A, User B).
  - **Sensitive Data Masking**: Automatically detects and masks phone numbers, emails, and URLs.
  - **Chinese Name Detection**: Built-in logic with a database of 300+ surnames to identify and redact Chinese names while preserving common words.
  - **Custom Keywords**: A dedicated field to manually input specific names, places, or terms to scrub.
- **Token Optimization**:
  - Removes redundant timestamps to save context.
  - Merges consecutive messages from the same sender.
  - Simplifies system messages (e.g., "recalled a message") and media placeholders.

## 🚀 How to Run Locally

This is a standard React application. You can download the source code and run it on your own machine.

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Create a new directory and extract the project files.
2. Open your terminal in the project folder.
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

Start the local development server:

```bash
npm run dev
```

Open your browser to the local URL provided (usually `http://localhost:5173`).

## 🛠 Usage Guide

1. **Export Data**: Obtain your chat history in JSON format.
2. **Import**: Click "Import Data" in the app or drag and drop your JSON file.
3. **Configure**:
   - **Anonymize Users**: Essential for privacy.
   - **Mask Sensitive**: specific regex for phones/IDs.
   - **Custom List**: If a specific name is missed, add it to the custom list text area.
4. **Export**: Copy the result to your clipboard or download as `.txt` to send to your LLM.

## 📝 License

Open Source / MIT
