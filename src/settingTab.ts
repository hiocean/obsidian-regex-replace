/*
 * @Author: hiocean
 * @Date: 2022-12-13 16:50:22
 * @LastEditors: hiocean
 * @LastEditTime: 2022-12-15 12:50:40
 * @FilePath: \obsidian-regex-replace\src\settingTab.ts
 * @Description: 
 * 
 * Copyright (c) 2022 by hiocean, All Rights Reserved. 
 */
import { App, PluginSettingTab, Setting } from 'obsidian';
import RegexFindReplacePlugin from './main';
import { logger } from "./logger";

export class RegexFindReplaceSettingTab extends PluginSettingTab {
	plugin: RegexFindReplacePlugin;

	constructor(app: App, plugin: RegexFindReplacePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl('h3', { text: 'Regular Expression Settings' });

		// new Setting(containerEl)
		// 	.setName('Case Insensitive')
		// 	.setDesc('When using regular expressions, apply the \'/i\' modifier for case insensitive search)')
		// 	.addToggle(toggle => toggle
		// 		.setValue(this.plugin.settings.caseInsensitive)
		// 		.onChange(async (value) => {
		// 			logger('Settings update: caseInsensitive: ' + value);
		// 			this.plugin.settings.caseInsensitive = value;
		// 			await this.plugin.saveSettings();
		// 		}));

		// new Setting(containerEl)
		// 	.setName('Process \\n as line break')
		// 	.setDesc('When \'\\n\' is used in the replace field, a \'line break\' will be inserted accordingly')
		// 	.addToggle(toggle => toggle
		// 		.setValue(this.plugin.settings.processLineBreak)
		// 		.onChange(async (value) => {
		// 			logger('Settings update: processLineBreak: ' + value);
		// 			this.plugin.settings.processLineBreak = value;
		// 			await this.plugin.saveSettings();
		// 		}));


		new Setting(containerEl)
			.setName('Prefill Find Field')
			.setDesc('Copy the currently selected text (if any) into the \'Find\' text field. This setting is only applied if the selection does not contain linebreaks')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.prefillFind)
				.onChange(async (value) => {
					logger('Settings update: prefillFind: ' + value);
					this.plugin.settings.prefillFind = value;
					await this.plugin.saveSettings();
				}));
	}
}
