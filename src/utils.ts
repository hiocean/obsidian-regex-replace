/*
 * @Author: hiocean
 * @Date: 2022-12-13 16:50:22
 * @LastEditors: hiocean
 * @LastEditTime: 2022-12-14 15:12:50
 * @FilePath: \obsidian-regex-replace\src\utils.ts
 * @Description: 
 * 
 * Copyright (c) 2022 by hiocean, All Rights Reserved. 
 */

export function	buildUserSelRepRuleSetting(containerEl: HTMLDetailsElement){
		containerEl.empty();
        containerEl.ontoggle = async () => {
			this.plugin.settings.userSelRuleSettingsOpen = containerEl.open;
			await this.plugin.saveSettings();
        };
		const summary = containerEl.createEl("summary", {cls: "easytyping-nested-settings"});
		summary.setText("自定义选中文本编辑增强规则 (Customize Selection Replace Rule)")

        // summary.setHeading().setName("User defined Selection Replace Rule");
        // summary.createDiv("collapser").createDiv("handle");

		const selectionRuleSetting = new Setting(containerEl);
		selectionRuleSetting
			.setName("Selection Replece Rule")

		const replaceRuleTrigger = new TextComponent(selectionRuleSetting.controlEl);
		replaceRuleTrigger.setPlaceholder("Triggr Symbol");

		const replaceLeftString = new TextAreaComponent(selectionRuleSetting.controlEl);
		replaceLeftString.setPlaceholder("New Left Side String");

		const replaceRightString = new TextAreaComponent(selectionRuleSetting.controlEl);
		replaceRightString.setPlaceholder("New Right Side String");

		selectionRuleSetting
			.addButton((button) => {
				button
					.setButtonText("+")
					.setTooltip("Add Rule")
					.onClick(async (buttonEl: any) => {
						let trigger = replaceRuleTrigger.inputEl.value;
						let left = replaceLeftString.inputEl.value;
						let right = replaceRightString.inputEl.value;
						if (trigger && (left || right)) {
							if(trigger.length>1){
								new Notice("Inlvalid trigger, trigger must be a symbol of length 1");
								return;
							}
							if (this.plugin.addUserSelectionRepRule(trigger, left, right)){
								await this.plugin.saveSettings();
								this.display();
							}
							else{
								new Notice("warning! Trigger " + trigger + " is already exist!")
							}
						}
						else {
							new Notice("missing input");
						}
					});
			});

		// const selRepRuleContainer = containerEl.createEl("div");
		for (let i = 0; i < this.plugin.settings.userSelRepRuleTrigger.length; i++) {
			let trigger = this.plugin.settings.userSelRepRuleTrigger[i];
			let left_s = this.plugin.settings.userSelRepRuleValue[i].left;
			let right_s = this.plugin.settings.userSelRepRuleValue[i].right;
			let showStr = "Trigger: " + trigger + " → " + showString(left_s) + "selected" + showString(right_s);
			// const settingItem = selRepRuleContainer.createEl("div");
			new Setting(containerEl)
				.setName(showStr)
				.addExtraButton(button => {
					button.setIcon("gear")
						.setTooltip("Edit rule")
						.onClick(() => {
							new SelectRuleEditModal(this.app, trigger,left_s, right_s, async (new_left, new_right) => {
								this.plugin.updateUserSelectionRepRule(i, new_left, new_right);
								await this.plugin.saveSettings();
								this.display();
							}).open();
						})
				})
				.addExtraButton(button => {
					button.setIcon("trash")
						.setTooltip("Remove rule")
						.onClick(async () => {
							this.plugin.deleteUserSelectionRepRule(i);
							await this.plugin.saveSettings();
							this.display();
						})
				});
		}


	}


	export function parseTextToHTMLWithoutOuterParagraph(text: string, containerEl: HTMLElement) {
		MarkdownRenderer.renderMarkdown(text, containerEl, '', null);
	
		let htmlString = containerEl.innerHTML.trim();
		if (htmlString.startsWith('<p>')) {
			htmlString = htmlString.substring(3);
		}
	
		if (htmlString.endsWith('</p>')) {
			htmlString = htmlString.substring(0, htmlString.length - 4);
		}
	
		containerEl.innerHTML = htmlString;
	}
	
	export function hideEl(el: HTMLElement) {
		el.addClass('linter-visually-hidden');
	}
	
	export function unhideEl(el: HTMLElement) {
		el.removeClass('linter-visually-hidden');
	}