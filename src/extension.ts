import * as vscode from 'vscode';

let decorationsEnabled = true;

export function activate(context: vscode.ExtensionContext) {
	const toggleCommand = vscode.commands.registerCommand('pretty-lambdas.toggle', () => {
		decorationsEnabled = !decorationsEnabled;
		vscode.window.showInformationMessage(
			`Pretty Lambdas ${decorationsEnabled ? 'enabled' : 'disabled'}`
		);
		if (vscode.window.activeTextEditor) {
			updateDecorations(vscode.window.activeTextEditor);
		}
	});

	const lambdaDecorationType = vscode.window.createTextEditorDecorationType({
		before: {
			contentText: 'λ',
		},
		textDecoration: 'none; display: none;',
	});

	async function updateDecorations(editor: vscode.TextEditor) {
		// Clear decorations if disabled
		if (!decorationsEnabled) {
			editor.setDecorations(lambdaDecorationType, []);
			return;
		}

		// Only process Python files
		if (editor.document.languageId !== 'python') {
			return;
		}

		const text = editor.document.getText();
		const lambdaRegex = /\blambda\b/g;
		const lambdaMatches: vscode.DecorationOptions[] = [];

		let match;

		// Find matches of lambda keyword
		while ((match = lambdaRegex.exec(text))) {
			const startPos = editor.document.positionAt(match.index);
			const endPos = editor.document.positionAt(match.index + match[0].length);
			const decoration = { range: new vscode.Range(startPos, endPos) };
			lambdaMatches.push(decoration);
		}

		const selections = editor.selections;

		// Filter out matches that are within selections
		const filteredMatches = lambdaMatches.filter((match) =>
			!selections.some((selection) => match.range.contains(selection))
		);

		editor.setDecorations(lambdaDecorationType, filteredMatches);
	}

	vscode.window.onDidChangeActiveTextEditor(
		(editor) => {
			editor && updateDecorations(editor);
		},
		null,
		context.subscriptions
	);

	vscode.workspace.onDidChangeTextDocument(
		(event) => {
			vscode.window.activeTextEditor 
			&& updateDecorations(vscode.window.activeTextEditor);
		},
		null,
		context.subscriptions
	);

	vscode.window.onDidChangeTextEditorSelection(
        (event) => {
            updateDecorations(event.textEditor);
        },
        null,
        context.subscriptions
    );

	context.subscriptions.push(toggleCommand);

	// Do initial update on startup
	if (vscode.window.activeTextEditor) {
		updateDecorations(vscode.window.activeTextEditor);
	}
}

// This method is called when your extension is deactivated
export function deactivate() {}
