import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { localeNames, type Locale } from "@/i18n/translations";
import { useTranslations } from "@/i18n";

export function LanguageSelector() {
	const { locale, setLocale } = useTranslations();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon" aria-label="Select language">
					<Languages className="h-[1.2rem] w-[1.2rem]" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{(Object.keys(localeNames) as Locale[]).map((lang) => (
					<DropdownMenuItem
						key={lang}
						onClick={() => setLocale(lang)}
						className={locale === lang ? "font-semibold" : ""}
					>
						{localeNames[lang]}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
