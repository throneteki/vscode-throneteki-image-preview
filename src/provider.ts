'use strict';

import * as vscode from 'vscode';
import { CardInfo } from "./CardInfo";

export class ImageProvider implements vscode.TextDocumentContentProvider {
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();

    public provideTextDocumentContent(uri: vscode.Uri): vscode.ProviderResult<string> {
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

        let card = CardInfo.parseFromFile(editor.document.getText());

        if(!card) {
            return this.renderBody('No card implementation');
        }

        return this.renderBody(this.renderPreview(card));
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

    private renderPreview(card: CardInfo): string {
        return `<img src="${card.imageUrl}" alt="${card.name}" />`;
    }
}
