/*
 * @Author: hiocean
 * @Date: 2022-12-13 17:01:47
 * @LastEditors: hiocean
 * @LastEditTime: 2022-12-22 10:30:09
 * @FilePath: \obsidian-regex-replace\src\settings.ts
 * @Description: 
 * 
 * Copyright (c) 2022 by hiocean, All Rights Reserved. 
 */

export interface RegExEntries {
	[key: string]: RegExEntry;
}
export interface RegexReplaceSettings {
	prefillFind: boolean;
	regExEntires: RegExEntries;
	entryOrder: string[];
	processLineBreak: boolean;
	processTab:boolean;
}
export const DEFAULT_SETTINGS: RegexReplaceSettings = {
	prefillFind: false,
	regExEntires: {},
	entryOrder: [],
	processLineBreak: true,
	processTab: true
};
export interface RegExEntry {
	findText: string, replaceText: string,
	flags: string, enabledRegEx: boolean, selectionOnly: boolean,
	description: string
};
export const defaultRegExEntry: RegExEntry = {
	findText: "", replaceText: "",
	flags: "gmi", enabledRegEx: false, selectionOnly: true,
	description: ""
}