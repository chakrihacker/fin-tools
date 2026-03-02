import { Calculator, TrendingDown } from "lucide-react";
import { useTranslations } from "@/i18n";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface Tool {
	titleKey: string;
	descriptionKey: string;
	badgeKey: string;
	href: string;
	icon: React.ReactNode;
	available: boolean;
}

const tools: Tool[] = [
	{
		titleKey: "tools.interestCalculator.title",
		descriptionKey: "tools.interestCalculator.description",
		badgeKey: "tools.interestCalculator.badge",
		href: "/vaddi",
		icon: <Calculator className="h-6 w-6" />,
		available: true,
	},
	{
		titleKey: "tools.stockAverageCalculator.title",
		descriptionKey: "tools.stockAverageCalculator.description",
		badgeKey: "tools.stockAverageCalculator.badge",
		href: "/stock-average",
		icon: <TrendingDown className="h-6 w-6" />,
		available: true,
	},
];

export default function HomeTools() {
	const { t } = useTranslations();

	return (
		<div className="space-y-8">
			<div className="space-y-2">
				<h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
					{t("tools.title")}
				</h1>
				<p className="text-neutral-600 dark:text-neutral-400">
					{t("tools.subtitle")}
				</p>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{tools.map((tool) =>
					tool.available ? (
						<a key={tool.href} href={tool.href} className="group block">
							<Card className="h-full transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer border-neutral-200 dark:border-neutral-800">
								<CardHeader className="pb-2">
									<div className="flex items-start justify-between">
										<div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
											{tool.icon}
										</div>
										<span className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
											{t(tool.badgeKey)}
										</span>
									</div>
									<CardTitle className="text-base font-semibold mt-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
										{t(tool.titleKey)}
									</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription className="text-sm leading-relaxed">
										{t(tool.descriptionKey)}
									</CardDescription>
								</CardContent>
							</Card>
						</a>
					) : (
						<Card
							key={tool.href}
							className="h-full opacity-60 cursor-not-allowed border-neutral-200 dark:border-neutral-800"
						>
							<CardHeader className="pb-2">
								<div className="flex items-start justify-between">
									<div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
										{tool.icon}
									</div>
									<span className="text-xs font-medium px-2 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
										{t("tools.comingSoon")}
									</span>
								</div>
								<CardTitle className="text-base font-semibold mt-3 text-neutral-500">
									{t(tool.titleKey)}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription className="text-sm leading-relaxed">
									{t(tool.descriptionKey)}
								</CardDescription>
							</CardContent>
						</Card>
					),
				)}
			</div>
		</div>
	);
}
