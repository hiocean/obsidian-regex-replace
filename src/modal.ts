import { App, Editor, Modal, Notice, Setting } from 'obsidian';
import { defaultRegExEntry, RegExEntry, RegexReplaceSettings } from './settings';
import RegexFindReplacePlugin from './main';

export class FindAndReplaceModal extends Modal {
	constructor(app: App, editor: Editor, settings: RegexReplaceSettings, plugin: RegexFindReplacePlugin) {
		super(app);
		this.editor = editor;
		this.settings = settings;
		this.plugin = plugin;
	}
	settings: RegexReplaceSettings;
	editor: Editor;
	plugin: RegexFindReplacePlugin;
	newUIContainer: HTMLElement;
	storeUIContainer: HTMLElement;

	onOpen() {
		
		this.modalEl.style.width = "600px";
		this.titleEl.setText('Regex Find/Replace');

		this.newUIContainer = this.contentEl.createDiv();
		this.storeUIContainer = this.contentEl.createDiv();

		const additional = this.settings.prefillFind && this.editor.getSelection()
			? { findText: this.editor.getSelection(), }
			: {};
		
		this.newRegexUI({ container: this.newUIContainer, additional });
		this.showStored({ container: this.storeUIContainer });

	}
	private resetUI(index: number = -1) {
		// this.contentEl.empty();
		// this.display(index);
		this.newUIContainer.empty()
		this.newRegexUI({ container: this.newUIContainer, index });
	}

	private showStored({ container }: { container: HTMLElement; }): void {
		container.createEl('h4', { text: "History" });
		this.settings.regExEntires.forEach((regex, index) => {
			this.regexRow(container, index);//todo adjust the numbers.
		});
	}

	private getColor(enabled: boolean) {
		return enabled ? "var(--interactive-accent)" : "var(--interactive-normal)"
	}

	private newRegexUI({ container, index = -1, additional = {} }: {
		container: HTMLElement; index?: number; additional?: object;
	}) {
		const regex: RegExEntry = index == -1 ? Object.assign(defaultRegExEntry, additional) : this.settings.regExEntires[index];

		container.createEl('h4', { text: "New" });
		new Setting(container)
			.setDesc(`Find:`)
			.addText((cb) => {
				cb.setPlaceholder('regex/string to find')
					.setValue(regex.findText)
					.onChange((value) => { regex.findText = value; });
				cb.inputEl.style.width = "350px"
			})
			.addButton((bu) => {
				bu.setIcon("regex")
				bu.setTooltip("Enable Regex")
				bu.buttonEl.style.background = this.getColor(regex.enabledRegEx)
				bu.onClick(() => {
					regex.enabledRegEx = !regex.enabledRegEx;
					bu.buttonEl.style.background = this.getColor(regex.enabledRegEx)
				});
			})
			.addText((cb) => {
				cb.setPlaceholder('flags')
					.setValue(regex.flags)
					.onChange((value) => { regex.flags = value; });
				cb.inputEl.style.width = "40px"
			})

		new Setting(container)
			.setDesc(`Replacement:`)
			.addText((cb) => {
				cb.setPlaceholder('Replacement')
					.setValue(regex.replaceText)
					.onChange((value) => { regex.replaceText = value; });
				cb.inputEl.style.width = "450px"
			})
		new Setting(container)
			.setDesc(`Description:`)
			.addText((cb) => {
				cb.setValue(regex.description)
					.setPlaceholder('The formula will be saved if des is not blank.')
					.onChange((value) => { regex.description = value; });
				cb.inputEl.style.width = "330px"
			})
			.addButton((bu) => {
				bu.setIcon("text-cursor-input")
				bu.setTooltip("Enable Selection Only")
				bu.buttonEl.style.background = this.getColor(regex.selectionOnly)
				bu.onClick(() => {
					regex.selectionOnly = !regex.selectionOnly;
					bu.buttonEl.style.background = this.getColor(regex.selectionOnly)
				});
			})
			.addExtraButton((cb) => {
				cb.setIcon('refresh-cw')
					.setTooltip('Rewrite')
					.onClick(() => { this.resetUI(); });
			})
			.addExtraButton((cb) => {
				cb.setIcon('play')
					.setTooltip('Apply')
					.onClick(() => {
						if (index == -1) this.settings.regExEntires.push(regex);
						if (regex.description) this.plugin.saveSettings();
						const res = this.plugin.replace(this.editor, regex);
						new Notice(res);
						this.close();
					});
			});
	}

	private regexRow(container: HTMLElement, index: number) {
		const regex: RegExEntry = this.settings.regExEntires[index];
		const desreg = regex.enabledRegEx ? `enabled, Flags: ${regex.flags}` : "disabled";
		new Setting(container)
			.setDesc(`Des: ${regex.description}, RegEx: ${desreg}, [${regex.findText} ==> ${regex.replaceText}]`)
			.addButton((bu) => {
				bu.setIcon("chevrons-up")
				bu.setTooltip("Go up to modify")
				bu.onClick(() => { this.resetUI(index); });
			})
			.addExtraButton((cb) => {
				cb.setIcon('cross')
					.setTooltip('Delete')
					.onClick(() => {
						this.settings.regExEntires.splice(index, 1);
						this.plugin.saveSettings();
						this.resetUI();
					});
			})
			.addExtraButton((cb) => {
				cb.setIcon('play')
					.setTooltip('Apply')
					.onClick(() => {
						const res = this.plugin.replace(this.editor, regex);
						new Notice(res);
						this.close();
					});
			});
	}

	onClose() {
		this.contentEl.empty();
	}
}

