import clipboardListener from 'clipboard-event';
import clipboard from 'clipboardy';
import chokidar from 'chokidar';
import fs from 'fs';
import path from 'path';

// To start listening
clipboardListener.startListening();

const folder = 'clipboard-sync'

let lastTextRead = ''
let lastTextWritten = ''
let lastTimeWritten = ''

clipboardListener.on('change', () => {
    const text = clipboard.readSync();

    if (!text || lastTextRead === text || lastTextWritten === text) {
        return
    }

    lastTextWritten = text

    const timestamp = Date.now().toString()
    lastTimeWritten = timestamp

    const file = path.join(folder, `${timestamp}.txt`);
    console.log(`Writing clipboard to ${file}`);

    fs.writeFileSync(file, text, {
        encoding: 'utf8'
    });
});

chokidar.watch(`${folder}/*.txt`, {
    ignoreInitial: true,
}).on('add', (filePath) => {
    const currentText = clipboard.readSync();
    const newText = fs.readFileSync(filePath, {
        encoding: 'utf8'
    })

    if (newText && currentText !== newText) {
        console.log(`Reading clipboard from ${filePath}`);
        lastTextRead = newText
        const timestamp = path.parse(filePath).name
        if (lastTimeWritten && timestamp <= lastTimeWritten) {
            return
        }
        clipboard.writeSync(newText);
    }
});

// To stop listening
// clipboardListener.stopListening();
