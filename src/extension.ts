import * as vscode from "vscode";
import { decodeJWT } from "./jwt";

export function activate(context: vscode.ExtensionContext) {
  const JWT_DECODE_SCHEME = "jwt-vscode";

  const jwtDecodeFileProvider = new (class
    implements vscode.TextDocumentContentProvider
  {
    // emitter and its event
    onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
    onDidChange = this.onDidChangeEmitter.event;

    provideTextDocumentContent(uri: vscode.Uri): string {
      // Load the editor preferences
      const editorConfig = vscode.workspace.getConfiguration("editor");
      const indent = editorConfig.get<number>("tabSize", 2);

      // Decode the user input into the JWT parts
      const decodedJWT = decodeJWT(uri.path.slice(0, uri.path.length - 13));

      return JSON.stringify(decodedJWT, null, indent);
    }
  })();

  context.subscriptions.push(
    vscode.workspace.registerTextDocumentContentProvider(
      JWT_DECODE_SCHEME,
      jwtDecodeFileProvider
    )
  );

  const disposable = vscode.commands.registerCommand(
    "jwt-vscode.decodeJWT",
    async () => {
      const clipboardContent = await vscode.env.clipboard.readText();

      const input = await vscode.window.showInputBox({
        prompt: "Enter your encoded JWT",
        value: clipboardContent || "",
      });

      if (input === undefined) {
        return; // User canceled the input box
      }

      const newFile = vscode.Uri.parse(
        `${JWT_DECODE_SCHEME}:${input}/decoded.json`
      );
      await vscode.workspace.openTextDocument(newFile);
      await vscode.window.showTextDocument(newFile);
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
