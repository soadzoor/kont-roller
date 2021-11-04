import AsyncStorage from "@react-native-async-storage/async-storage";
import {LangStorageName, Language} from "../Api/types";

export class LanguageSettings
{
	public static _lang: Language = "en";

	public static get lang()
	{
		return this._lang;
	}

	public static async loadSavedLanguage()
	{
		const savedLang: Language = (await AsyncStorage.getItem(LangStorageName) as Language) || "en";

		this._lang = savedLang;
	}

	public static async setLanguage(lang: Language)
	{
		await AsyncStorage.setItem(LangStorageName, lang);

		this._lang = lang;
	}
}