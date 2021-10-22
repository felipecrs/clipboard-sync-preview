# clipboard-sync-preview

A very simple tool which helps to sync the clipboard between computers by relying on a shared folder.

## Deprecated

This project is now replaced by [clipboard-sync](https://github.com/felipecrs/clipboard-sync) and will no longer receive updates.

## Demo

https://user-images.githubusercontent.com/29582865/138028220-29755211-ab79-45dc-acac-9a14431c03d4.mp4

## Get started

Install with:

```console
npm install --global clipboard-sync-preview
```

And run it with:

```console
clipboard-sync-preview
```

When you run, it will be syncing until you close it.

The tool will write the clipboard to files in a `clipboard-sync-preview` relative to where you started it, and it will read from it too.

### Using OneDrive

If you have OneDrive set on both computers, this is how you can use this tool to sync the clipboard:

1. Create a folder called `clipboard-sync-preview` in the root of your OneDrive folder.
2. Turn on _Always keep on this device_ for this folder on both computers:
   ![image](https://user-images.githubusercontent.com/29582865/138023653-c284670c-0019-42f9-9018-e98e138bf18f.png)
3. Open a shell (e.g. Windows PowerShell) on the root of your OneDrive folder and run `clipboard-sync-preview` from there. Do it on both computers.

The OneDrive client will handle downloading and uploading the files which `clipboard-sync-preview` will create.

## How it works

It is very simple.

When a new text is detected in your clipboard, the tool will create a file in the `clipboard-sync-preview` folder with its contents.

When a new file is detected in the `clipboard-sync-preview` folder, the tool will read its contents and write it to the clipboard.

Some safeguards are implemented to prevent infinite loops and unneeded operations.

Also, it deletes the files created when they become 5 minutes old.
