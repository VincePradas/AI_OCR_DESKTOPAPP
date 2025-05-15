import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { app, BrowserWindow, globalShortcut } from "electron";
import screenshotDesktop from "screenshot-desktop";
import fs from "fs";
import Tesseract from "tesseract.js";
import "dotenv/config";

import { GoogleGenAI } from "@google/genai";

let win: BrowserWindow;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

function createWindow() {
  win = new BrowserWindow({
    width: 400,
    height: 200,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  win.loadURL(
    'data:text/html,<h1 style="color:white;font-size:20px;">Press the key "P".</h1>'
  );
}

async function captureAndRespond() {
  try {
    console.log("=== Starting captureAndRespond ===");

    const imgPath = path.join(__dirname, "screen.png");
    console.log("Taking screenshot...");
    const img = await screenshotDesktop({ format: "png" });
    console.log(`Screenshot captured, size: ${img.length} bytes`);

    fs.writeFileSync(imgPath, img);
    console.log(`Screenshot saved to ${imgPath}`);

    console.log("Running OCR on screenshot...");
    const result = await Tesseract.recognize(imgPath, "eng", {
      logger: (m) => console.log("Tesseract progress:", m),
    });

    const text = result.data.text.trim();
    console.log("OCR detected text:", text);

    const questions = text.match(/[^.?!\n]*\?/g);
    const question = questions ? questions[0] : null;

    if (!question) {
      console.warn("No question found in OCR text.");
      win.loadURL(
        `data:text/html,<h1 style="color:white;">No question found in OCR text.</h1>`
      );
      return;
    }

    console.log("Question extracted for AI:", question);

    console.log("Sending question to GoogleGenAI...");
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: question,
    });

    console.log("Raw AI response object:", response);

    if (response.text) {
      console.log("AI response text received:", response.text);
      win.loadURL(
        `data:text/html,<body style="background:transparent;color:white;font-size:16px;">${response.text}</body>`
      );
    } else {
      console.error("AI Failed to respond: empty text in response");
      win.loadURL(
        `data:text/html,<h1 style="color:white;">AI Failed to respond.</h1>`
      );
    }

    console.log("=== captureAndRespond finished ===");
  } catch (error) {
    win.loadURL(
      `data:text/html,<h1 style="color:white;">An error occurred. Check console.</h1>`
    );
    console.error("Error in captureAndRespond:", error);
  }
}

app.whenReady().then(() => {
  createWindow();

  const ret = globalShortcut.register("P", () => {
    console.log("P pressed — running AI OCR");
    captureAndRespond();
  });

  if (!ret) {
    console.error("Global shortcut registration failed");
  } else {
    console.log("Global shortcut registered successfully");
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
