import clipboardListener from "clipboard-event";
import clipboard from "clipboardy";
import chokidar from "chokidar";
import fs from "fs";
import path from "path";
import { stderr } from "process";

const folder = "clipboard-sync";

let lastTextWritten = "";
let lastTimeWritten = "";

let lastTextRead = "";
let lastTimeRead = "";

// Handles exiting the program
[
  "exit",
  "SIGINT",
  "SIGUSR1",
  "SIGUSR2",
  // 'uncaughtException',
  "SIGTERM",
].forEach((eventType) => {
  process.on(eventType, () => {
    clipboardListener.stopListening();
    process.exit();
  });
});

clipboardListener.startListening();

// Writes clipboard to file
clipboardListener.on("change", () => {
  let textToWrite = "";
  try {
    textToWrite = clipboard.readSync();
  } catch (error) {
    console.error("Error reading clipboard");
    return;
  }
  if (
    !textToWrite ||
    lastTextRead === textToWrite ||
    lastTextWritten === textToWrite
  ) {
    return;
  }

  const writeTime = `${Date.now()}`;
  const filePath = path.join(folder, `${writeTime}.txt`);

  lastTimeWritten = writeTime;
  lastTextWritten = textToWrite;

  console.log(`Writing clipboard to ${filePath}`);
  fs.writeFileSync(filePath, textToWrite, {
    encoding: "utf8",
  });
});

// Watches for files and reads clipboard from it
chokidar
  .watch(`${folder}/*.txt`, {
    ignoreInitial: true,
    depth: 1,
  })
  .on("add", (filePath) => {
    const currentText = clipboard.readSync();

    const newText = fs.readFileSync(filePath, {
      encoding: "utf8",
    });

    // Prevents writing duplicated text to clipboard
    if (!newText || currentText === newText) {
      return;
    }

    const currentFileTime = path.parse(filePath).name;
    // Skips the read if a newer file was already wrote
    if (lastTimeWritten && currentFileTime <= lastTimeWritten) {
      return;
    }

    // Skips if a newer file was already read
    if (lastTimeRead && currentFileTime <= lastTimeRead) {
      return;
    }

    lastTextRead = newText;
    lastTimeRead = currentFileTime;

    console.log(`Reading clipboard from ${filePath}`);
    clipboard.writeSync(newText);
  });

// Remove files older than 5 minutes
chokidar
  .watch(`${folder}/*.txt`, {
    depth: 1,
  })
  .on("add", (filePath) => {
    const currentTimeMinus5Min = `${Date.now() - 300000}`;
    if (path.parse(filePath).name <= currentTimeMinus5Min) {
      fs.unlinkSync(filePath);
    }
  });
