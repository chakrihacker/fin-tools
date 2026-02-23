import { useEffect, useState } from "react";
import {
	defaultLocale,
	translations,
	type Locale,
} from "./translations";

export type { Locale };

export function getStoredLocale(): Locale {
	if (typeof localStorage !== "undefined") {
		const stored = localStorage.getItem("locale") as Locale;
		if (stored && stored in translations) {
			return stored;
		}
	}
	return defaultLocale;
}

export function useTranslations() {
	const [locale, setLocaleState] = useState<Locale>(defaultLocale);

	useEffect(() => {
		setLocaleState(getStoredLocale());

		const handleLocaleChange = (e: Event) => {
			setLocaleState((e as CustomEvent<Locale>).detail);
		};
		window.addEventListener("locale-change", handleLocaleChange);
		return () =>
			window.removeEventListener("locale-change", handleLocaleChange);
	}, []);

	const setLocale = (newLocale: Locale) => {
		localStorage.setItem("locale", newLocale);
		setLocaleState(newLocale);
		window.dispatchEvent(
			new CustomEvent<Locale>("locale-change", { detail: newLocale }),
		);
	};

	const t = (key: string): string => {
		const keys = key.split(".");
		// biome-ignore lint/suspicious/noExplicitAny: translation key traversal
		let value: any = translations[locale];
		for (const k of keys) {
			value = value?.[k];
		}
		if (typeof value !== "string") {
			if (import.meta.env.DEV) {
				console.warn(`[i18n] Missing translation key: "${key}" for locale "${locale}"`);
			}
			return key;
		}
		return value;
	};

	return { locale, setLocale, t };
}
