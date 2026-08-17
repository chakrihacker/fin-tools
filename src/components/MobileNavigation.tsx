import { Calculator, Home, TrendingDown, TrendingUp } from "lucide-react";

import { useTranslations } from "@/i18n";
import { navigationItems, type NavigationItem } from "@/lib/navigation";

const icons: Record<NavigationItem["icon"], typeof Home> = {
	home: Home,
	interest: Calculator,
	average: TrendingDown,
	profit: TrendingUp,
};

type MobileNavigationProps = {
	currentPath: string;
};

export function MobileNavigation({ currentPath }: MobileNavigationProps) {
	const { t } = useTranslations();

	return (
		<nav
			className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md lg:hidden"
			aria-label={t("nav.mobileNavigation")}
		>
			<ul className="mx-auto grid max-w-md grid-cols-4">
				{navigationItems.map((item) => {
					const Icon = icons[item.icon];
					const isCurrent = currentPath === item.href;

					return (
						<li key={item.href}>
						<a
							href={item.href}
							aria-current={isCurrent ? "page" : undefined}
							aria-label={t(item.labelKey)}
							className={
								"flex min-h-11 flex-col items-center justify-center gap-1 rounded-md px-1 py-1 text-xs font-medium transition-colors " +
								(isCurrent
									? "bg-accent text-accent-foreground"
									: "text-muted-foreground hover:bg-accent hover:text-accent-foreground")
							}
						>
							<Icon className="h-5 w-5" aria-hidden="true" />
							<span>{t(item.mobileLabelKey)}</span>
						</a>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}