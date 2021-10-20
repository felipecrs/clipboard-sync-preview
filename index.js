import clipboardListener from 'clipboard-event';
import clipboard from 'clipboardy';
import chokidar from 'chokidar';
import fs from 'fs';
import path from 'path';

// To start listening
clipboardListener.startListening();

const folder = 'clipboard-sync'

let lastText

clipboardListener.on('change', () => {
    const text = clipboard.readSync();

    if (!text || lastText === text) {
        return
    }

    const timestamp = Date.now()
    const file = path.join(folder, `${timestamp}.txt`);
    console.log(`Writing clipboard to ${file}`);

    fs.writeFileSync(file, text, {
        encoding: 'utf8'
    });
});

chokidar.watch(folder, {
    ignoreInitial: true
}).on('add', (path) => {
    const currentText = clipboard.readSync();
    const newText = fs.readFileSync(path, {
        encoding: 'utf8'
    })

    if (newText && currentText !== newText) {
        console.log(`Reading clipboard from ${path}`);
        lastText = newText
        clipboard.writeSync(newText);
    }
});

// To stop listening
// clipboardListener.stopListening();
