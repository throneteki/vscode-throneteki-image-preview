'use strict';

import * as vscode from 'vscode';

export class ImageProvider implements vscode.TextDocumentContentProvider {
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();

    public provideTextDocumentContent(uri: vscode.Uri): string {
        return this.createCssSnippet();
    }

    get onDidChange(): vscode.Event<vscode.Uri> {
        return this._onDidChange.event;
    }

    public update(uri: vscode.Uri) {
        this._onDidChange.fire(uri);
    }

    private createCssSnippet() {
        let editor = vscode.window.activeTextEditor;
        if(!editor) {
            return this.renderBody('No card implementation');
        }

        if (!(editor.document.languageId === 'javascript')) {
            return this.renderBody('No card implementation');
        }

        let text = editor.document.getText();
        let match = text.match(/(\w+)\.code = '(\d{5})'/);

        if(!match) {
            return this.renderBody('No card implementation');
        }

        let cardName = match[1];
        let code = match[2];

        return this.renderBody(this.renderPreview(cardName, code));
    }

    private renderBody(content: string) {
        return `
            <style>
                body { text-align: center; padding: 1em; }
            </style>
            <body>
                ${content}
            </body>`;
    }

    private renderPreview(cardName: string, code: string): string {
        return `<img src="https://throneteki.net/img/cards/${code}.png" alt="${cardName}" />`;
    }
}
