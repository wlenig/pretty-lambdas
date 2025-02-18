import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('pretty-lambdas.toggle', () => {
		// TODO: Toggle decorations
		vscode.window.showInformationMessage('Hello World from pretty-lambdas!');
	});

	const lambdaDecorationType = vscode.window.createTextEditorDecorationType({
		before: {
			contentText: 'λ',
			// color: 'rgba(0,0,0,0.3)',
		},
		textDecoration: 'none; display: none;',
	});

	function updateDecorations(editor: vscode.TextEditor) {
		const text = editor.document.getText();
		const lambdaRegex = /lambda/g;
		const lambdaMatches: vscode.DecorationOptions[] = [];

		let match;

		while ((match = lambdaRegex.exec(text))) {
			const startPos = editor.document.positionAt(match.index);
			const endPos = editor.document.positionAt(match.index + match[0].length);
			const decoration = { range: new vscode.Range(startPos, endPos) };
			lambdaMatches.push(decoration);
		}

		editor.setDecorations(lambdaDecorationType, lambdaMatches);
	}

	vscode.window.onDidChangeActiveTextEditor(
		(editor) => {
			editor && updateDecorations(editor);
		},
		null,
		context.subscriptions
	);

	// vscode.workspace.onDidChangeTextDocument(
	// 	(event) => {
	// 		if (editor && event.document === editor.document) {
	// 			updateDecorations();
	// 		}
	// 	},
	// 	null,
	// 	context.subscriptions
	// );

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
