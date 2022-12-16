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
	CreatContainer: HTMLElement;
	StoredContainer: HTMLElement;

	onOpen() {
		this.contentEl.empty();

		this.modalEl.style.width = "600px";
		this.titleEl.setText('RegEx Find/Replace 正则替换');
		this.CreatContainer = this.contentEl.createDiv();
		this.StoredContainer = this.contentEl.createDiv();

		const additional = this.settings.prefillFind && this.editor.getSelection()
			? { findText: this.editor.getSelection(), selectionOnly: true }
			: { selectionOnly: false };

		this.showCreateRegexUI({ additional });
		this.showStoredRegexUI();

	}
	private showStoredRegexUI(open: boolean = false): void {
		this.StoredContainer.empty();
		const details = this.StoredContainer.createEl("details");
		if (open) details.setAttribute('open', 'true')
		const summary = details.createEl("summary");
		summary.setText("Replacement history (替换历史)");

		details.ontoggle = () => {
			if (details.open) {

				if (this.settings.entryOrder.length >= 10) { new Notice("More than 10 results, delete some!") }
				this.settings.entryOrder.slice().reverse().forEach(key => {
					this.showOneRegexRow(details, key);
				});
			};
		};
	}

	private getColor(enabled: boolean) {
		return enabled ? "var(--interactive-accent)" : "var(--interactive-normal)"
	}

	private showCreateRegexUI({ key = '', additional = {} }: { key?: string; additional?: object; }) {

		const container = this.CreatContainer; container.empty();

		const regex: RegExEntry = Object.assign({}, defaultRegExEntry, (key ? this.settings.regExEntires[key] : additional));

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
					.onClick(() => { this.showCreateRegexUI({}); });
			})
			.addExtraButton((cb) => {
				cb.setIcon('play')
					.setTooltip('Apply')
					.onClick(async () => {
						if (regex.description) {
							const newkey = regex.description;
							this.settings.regExEntires[newkey] = regex;
							if (!this.settings.entryOrder.includes(newkey)) this.settings.entryOrder.push(newkey);
							await this.plugin.saveSettings();
						}
						const res = this.plugin.replace(this.editor, regex);
						new Notice(res);
						this.close();
					});
			});
	}

	private showOneRegexRow(container: HTMLElement, key: string) {
		const regex: RegExEntry = this.settings.regExEntires[key]; if (!regex) return;
		const desreg = regex.enabledRegEx ? `✔, Flags: ${regex.flags}` : "❌";
		new Setting(container)
			.setDesc(`Key: ${key},Des: ${regex.description}, RegEx: ${desreg}, [${regex.findText} ==> ${regex.replaceText}]`)
			.addButton((bu) => {
				bu.setIcon("chevrons-up")
				bu.setTooltip("Go up to modify")
				bu.onClick(() => { this.showCreateRegexUI({ key }); });
			})
			.addExtraButton((cb) => {
				cb.setIcon('cross')
					.setTooltip('Delete')
					.onClick(async () => {
						delete this.settings.regExEntires[key];
						this.settings.entryOrder.map((val, index) => { if (val == key) this.settings.entryOrder.splice(index, 1) })
						await this.plugin.saveSettings();
						this.showStoredRegexUI(true);
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

