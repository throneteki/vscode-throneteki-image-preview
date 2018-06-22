'use strict';

import * as vscode from 'vscode';
import { CardInfo } from "./CardInfo";

export class ImageProvider implements vscode.TextDocumentContentProvider {
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();

    public provideTextDocumentContent(uri: vscode.Uri): vscode.ProviderResult<string> {
        let editor = vscode.window.activeTextEditor;
        if(!editor) {
            return this.renderBody('No card implementation');
        }

        if (!(editor.document.languageId === 'javascript')) {
            return this.renderBody('No card implementation');
        }

        return this.getImplementation(editor.document).then(text => {
            let card = CardInfo.parseFromFile(text);

            if(!card) {
                return this.renderBody('No card implementation');
            }

            return this.renderBody(this.renderPreview(card));
        });
    }

    get onDidChange(): vscode.Event<vscode.Uri> {
        return this._onDidChange.event;
    }

    public update(uri: vscode.Uri) {
        this._onDidChange.fire(uri);
    }

    private getImplementation(document: vscode.TextDocument): Thenable<string> {
        if(document.fileName.match(/\.spec.js$/)) {
            return this.getImplementationForSpecFile(document.fileName);
        }

        return Promise.resolve(document.getText());
    }

    getImplementationForSpecFile(fileName: string) {
        let path = fileName.split('/');
        let implementationFileName = path[path.length - 1].replace('.spec', '');
        return vscode.workspace.findFiles(`**/${implementationFileName}`).then(uris => {
            if(uris.length === 0) {
                return '';
            }

            return vscode.workspace.openTextDocument(uris[0]).then(implementationDocument => {
                return implementationDocument.getText();
            });
        });
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
