'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ImageProvider } from './provider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    let previewUri = vscode.Uri.parse('throneteki-image-preview://throneteki-image-preview/card');
    let provider = new ImageProvider();
	let registration = vscode.workspace.registerTextDocumentContentProvider('throneteki-image-preview', provider);

	vscode.workspace.onDidChangeTextDocument((e: vscode.TextDocumentChangeEvent) => {
		provider.update(previewUri);
	});

	vscode.window.onDidChangeActiveTextEditor((e: vscode.TextEditor|undefined) => {
		provider.update(previewUri);
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
