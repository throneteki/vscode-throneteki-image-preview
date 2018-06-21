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
        let match = text.match(/(\w+)\.(code|id) = '(\d{5}|(\w|-)+)'/);

        if(!match) {
            return this.renderBody('No card implementation');
        }

        let cardName = match[1];
        let codeOrId = match[2];
        let code = match[3];

        return this.renderBody(this.renderPreview(codeOrId, cardName, code));
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

    private renderPreview(codeOrId: string, cardName: string, code: string): string {
        let url = codeOrId === 'code' ? `https://throneteki.net/img/cards/${code}.png` : `https://jigoku.online/img/cards/${code}.jpg`;
        return `<img src="${url}" alt="${cardName}" />`;
    }
}
