/*
 * @Author: hiocean
 * @Date: 2022-12-13 17:01:47
 * @LastEditors: hiocean
 * @LastEditTime: 2022-12-15 12:49:40
 * @FilePath: \obsidian-regex-replace\src\settings.ts
 * @Description: 
 * 
 * Copyright (c) 2022 by hiocean, All Rights Reserved. 
 */
export interface RegexReplaceSettings {
	// findText: string;
	// replaceText: string;
	// enableRegEx: boolean;
	// selectionOnly: boolean;
	// caseInsensitive: boolean;
	// // processLineBreak: boolean;
	// processTab: boolean;
	prefillFind: boolean;
	regExEntires: RegExEntry[];
}
export const DEFAULT_SETTINGS: RegexReplaceSettings = {
	// findText: '',
	// replaceText: '',
	// enableRegEx: true,
	// selectionOnly: false,
	// caseInsensitive: false,
	// processLineBreak: false,
	// processTab: false,
	prefillFind: false,
	regExEntires: []
};
export interface RegExEntry {
	findText: string, replaceText: string,
	flags: string, enabledRegEx: boolean, selectionOnly: boolean,
	description:string
};
export const defaultRegExEntry: RegExEntry = {
	findText: "", replaceText: "",
	flags: "gmi", enabledRegEx: false, selectionOnly: true,
	description:""
}