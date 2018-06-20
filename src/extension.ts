'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ImageProvider } from './provider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // // Use the console to output diagnostic information (console.log) and errors (console.error)
    // // This line of code will only be executed once when your extension is activated
    // console.log('Congratulations, your extension "throneteki-image-preview" is now active!');

    // // The command has been defined in the package.json file
    // // Now provide the implementation of the command with  registerCommand
    // // The commandId parameter must match the command field in package.json
    // let disposable = vscode.commands.registerCommand('extension.previewCardImage', () => {
    //     // The code you place here will be executed every time your command is executed

    //     // Display a message box to the user
    //     vscode.window.showInformationMessage('Hello World!');
    // });

    // context.subscriptions.push(disposable);

    let previewUri = vscode.Uri.parse('throneteki-image-preview://throneteki-image-preview/card');
    let provider = new ImageProvider();
	let registration = vscode.workspace.registerTextDocumentContentProvider('throneteki-image-preview', provider);

	vscode.workspace.onDidChangeTextDocument((e: vscode.TextDocumentChangeEvent) => {
        // if(!vscode.window.activeTextEditor) {
        //     return;
        // }

		// if (e.document === vscode.window.activeTextEditor.document) {
			provider.update(previewUri);
		// }
	});

	vscode.window.onDidChangeTextEditorSelection((e: vscode.TextEditorSelectionChangeEvent) => {
		if (e.textEditor === vscode.window.activeTextEditor) {
			provider.update(previewUri);
		}
	});

	let disposable = vscode.commands.registerCommand('extension.showCardImagePreview', () => {
		return vscode.commands.executeCommand('vscode.previewHtml', previewUri, vscode.ViewColumn.Two, 'Card Image Preview').then((success) => {
		}, (reason) => {
			vscode.window.showErrorMessage(reason);
		});
	});

	context.subscriptions.push(disposable, registration);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
