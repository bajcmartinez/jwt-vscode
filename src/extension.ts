// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { decodeJWT } from './jwt';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "jwt-vscode" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('jwt-vscode.decodeJWT', async () => {
		const clipboardContent = await vscode.env.clipboard.readText();
		
		const input = await vscode.window.showInputBox({
			prompt: 'Enter your encoded JWT',
			value: clipboardContent || ''
		});

		if (input === undefined) {
			return; // User canceled the input box
		}
		
		// Decode the user input into the JWT parts
		const decodedJWT = decodeJWT(input);

		// Load the editor preferences
		const editorConfig = vscode.workspace.getConfiguration('editor');
    	const indent = editorConfig.get<number>('tabSize', 2);

		const newFile = vscode.Uri.parse('untitled:' + 'decoded.json');
		vscode.workspace.openTextDocument(newFile).then(document => {
		const edit = new vscode.WorkspaceEdit();
		edit.insert(newFile, new vscode.Position(0, 0), JSON.stringify(decodedJWT, null, indent));
		return vscode.workspace.applyEdit(edit).then(success => {
			if (success) {
			vscode.window.showTextDocument(document);
			} else {
			vscode.window.showInformationMessage('Could not open file!');
			}
		});
		});
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
