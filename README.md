# AI OCR Overlay

A desktop application that lets you take a screenshot, extract questions from the image using OCR, and get instant AI-generated answers using Google Gemini. Built with Electron, Tesseract.js, and Google GenAI.

## Features

- **Global Shortcut**: Press `P` to capture your screen and trigger the workflow.
- **OCR**: Uses Tesseract.js to extract text from screenshots.
- **AI Q&A**: Automatically detects questions in the screenshot and sends them to Google Gemini for answers.
- **Overlay UI**: Displays the AI's answer in a transparent, always-on-top window.

## Requirements

- Node.js (v18+ recommended)
- npm
- Google Gemini API key (set as `GEMINI_API_KEY` in `.env`)

## Installation

1. **Clone the repository**

   ```sh
   git clone <your-repo-url>
   cd gemini-ocr-overlay
   ```

2. **Install dependencies**

   ```sh
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

## Usage

### Start the Electron App

```sh
npm run ai
```

- A transparent overlay window will appear.
- Press the `P` key to capture the screen, extract a question, and get an AI answer.

### Test Gemini API (CLI)

You can test your Gemini API key and integration with:

```sh
npm run start
```

This runs [test-gemini.ts](test-gemini.ts) and prints a sample response.

## Project Structure

- [main.ts](main.ts): Main Electron process, handles screenshot, OCR, and AI integration.
- [test-gemini.ts](test-gemini.ts): Simple CLI test for Gemini API.
- [screenshot-desktop.d.ts](screenshot-desktop.d.ts): Type definitions for screenshot-desktop.
- [package.json](package.json): Project metadata and scripts.
- [tsconfig.json](tsconfig.json): TypeScript configuration.

## How It Works

1. **Overlay Window**: Electron creates a transparent, always-on-top window.
2. **Screenshot**: On pressing `P`, the app captures the screen using `screenshot-desktop`.
3. **OCR**: The screenshot is processed by Tesseract.js to extract text.
4. **Question Detection**: The app searches for the first question in the extracted text.
5. **AI Answer**: The question is sent to Google Gemini via the GenAI SDK, and the answer is displayed in the overlay.

## Troubleshooting

- **No question found**: If no question mark is detected in the OCR text, the overlay will notify you.
- **API errors**: Ensure your `.env` file contains a valid `GEMINI_API_KEY`.
- **Global shortcut not working**: Make sure no other app is using the `P` key as a global shortcut.

## Development

- TypeScript is used throughout the project.
- Electron APIs are available in the main process.
- Modify [main.ts](main.ts) for core logic changes.

## License

MIT License

---

**Note:** This project is for educational and personal productivity use. Ensure you comply with the terms of service for Google Gemini and any other APIs you use.
