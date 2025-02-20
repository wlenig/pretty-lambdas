import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as myExtension from '../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	// There is no way to test the effects of setDeocrations
	// TODO: Write a mock like below to test that the functions are called
	// https://github.com/microsoft/vscode/issues/136164#issuecomment-956027228
});

