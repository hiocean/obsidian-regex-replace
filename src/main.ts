/*
 * @Author: hiocean
 * @Date: 2022-12-13 16:34:46
 * @LastEditors: hiocean
 * @LastEditTime: 2022-12-14 17:40:16
 * @FilePath: \obsidian-regex-replace\src\main.ts
 * @Description: 
 * 
 * Copyright (c) 2022 by hiocean, All Rights Reserved. 
 */
import { Editor, MarkdownView, Plugin } from 'obsidian';
import { FindAndReplaceModal } from './modal';
import { logger } from './logger';
import { RegexReplaceSettings, DEFAULT_SETTINGS, RegExEntry } from './settings';
import { RegexFindReplaceSettingTab } from './settingTab';


export default class RegexFindReplacePlugin extends Plugin {
	settings: RegexReplaceSettings;

	async onload() {
		logger('Loading Plugin...', 9);
		await this.loadSettings();
		this.addSettingTab(new RegexFindReplaceSettingTab(this.app, this));

		this.addCommand({
			id: 'obsidian-regex-replace',
			name: 'Find and Replace using regular expressions',
			editorCallback: (editor) => {
				new FindAndReplaceModal(this.app, editor, this.settings, this).open();
			},
		});

	}

	replace(editor: Editor, pattern: RegExEntry): string {
		if (!pattern.findText) return "The findtext must not be null."
		const scope = pattern.selectionOnly ? 'selection' : 'document';
		let nrOfHits = 0;

		if (pattern.enabledRegEx) {
			logger('Using regex', 8);
			const searchRegex = new RegExp(pattern.findText, pattern.flags);
			let rresult;
			if (pattern.selectionOnly) {
				const selectedText = editor.getSelection(); if (!selectedText) { return `No selection!`; }
				rresult = selectedText.match(searchRegex);
				if (rresult) {
					editor.replaceSelection(selectedText.replace(searchRegex, pattern.replaceText));
				}
			} else {
				const documentText = editor.getValue();
				rresult = documentText.match(searchRegex);
				if (rresult) {
					editor.setValue(documentText.replace(searchRegex, pattern.replaceText));
				}
			}
			nrOfHits = rresult?.length || 0
		} else {
			logger('NOT using regex', 8);
			if (!pattern.selectionOnly) {
				logger('   SCOPE: Full document', 9);
				const documentText = editor.getValue();
				const documentSplit = documentText.split(pattern.findText);
				nrOfHits = documentSplit.length - 1;
				editor.setValue(documentSplit.join(pattern.replaceText));
			}
			else {
				logger('   SCOPE: Selection', 9);
				const selectedText = editor.getSelection(); if (!selectedText) { return `No selection!`; }
				const selectedSplit = selectedText.split(pattern.findText);
				nrOfHits = selectedSplit.length - 1;
				editor.replaceSelection(selectedSplit.join(pattern.replaceText));
			}
		}
		return nrOfHits ? `Made ${nrOfHits} replacement(s) in ${scope}` : "No match found";
	}

	onunload() {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

}


