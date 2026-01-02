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

## 🚀 How to Run Locally (English)

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

---

# 🇨🇳 中文使用指南 (Chinese Guide)

这是一个可以在你本地电脑上运行的工具，用来把微信或其他社交软件导出的聊天记录（JSON格式）清洗干净。它能去掉无用的时间戳和系统废话，还能自动给名字和敏感信息打码，生成适合发给 AI (如 ChatGPT, Claude) 阅读的纯文本。

## 🛡️ 隐私说明

**100% 本地运行**：哪怕你断网了，这个工具也能用。
- 没有任何数据会上传到服务器。
- 所有的处理都在你的浏览器里完成。
- 安全可靠，不用担心聊天记录泄露。

## 📦 如何在本地电脑上使用（小白保姆级教程）

如果你不懂代码，按照下面步骤一步步来即可：

### 第一步：安装基础环境 (Node.js)
1. 去 [Node.js 官网](https://nodejs.org/) 下载 **LTS 版本** (长期支持版)。
2. 下载后双击安装，一路点击 "Next" 直到完成。
3. 验证是否安装成功：按键盘上的 `Win + R` 键，输入 `cmd` 回车。在出现的黑框里输入 `node -v`，如果出现数字版本号（如 v18.x.x），说明安装成功了。

### 第二步：准备项目代码
1. 在电脑上新建一个文件夹，比如叫 `chat-cleaner`。
2. 将本项目的所有文件放入该文件夹中（如果你是从 GitHub 下载的压缩包，请解压进去）。

### 第三步：安装与启动
1. 打开那个 `chat-cleaner` 文件夹。
2. 在文件夹空白处，**按住 Shift 键并点击鼠标右键**，选择 **"在此处打开 Powershell 窗口"** 或 **"在终端中打开"**。
3. 在弹出的蓝框或黑框里，输入以下命令并按回车（这步是安装必要的工具包，只需做一次）：
   ```bash
   npm install
   ```
   *注意：如果出现进度条，请耐心等待它跑完。*

4. 安装完成后，输入以下命令启动软件：
   ```bash
   npm run dev
   ```
5. 此时屏幕上会出现一个链接（通常是 `http://localhost:5173`）。按住 Ctrl 键点击这个链接，或者复制到浏览器打开，就可以开始使用了！

## 💡 功能介绍

1. **Import Data (导入数据)**：点击按钮选择你的 `.json` 格式聊天记录文件。
2. **Cleaning Options (清洗选项)**：
   - **Short Aliases**: 把名字变成 A, B, C (最省 AI 的字数)。
   - **Merge Consecutive**: 一个人连续发的消息合并成一段。
   - **Mask Sensitive**: 自动把手机号、网址、邮箱打码。
   - **Anonymize Users**: 隐藏真实姓名，用代号表示。
3. **Custom Redaction List (自定义打码)**：
   - 在左下角的文本框里，输入你想隐藏的特定名字或地名（用逗号隔开），比如 `张三, 北京, 某某公司`，工具会帮你自动替换成 `[REDACTED]`。
4. **导出**：
   - 点击 **Copy** 直接复制清洗后的文本。
   - 点击 **Download .txt** 保存成文本文件，然后直接拖给 AI。

## 📝 License

Open Source / MIT
