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
				<h1 className="text-3xl font-bold tracking-tight">
					{t("tools.title")}
				</h1>
				<p className="text-muted-foreground">
					{t("tools.subtitle")}
				</p>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{tools.map((tool) =>
					tool.available ? (
						<a key={tool.href} href={tool.href} className="group block">
							<Card className="h-full cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
								<CardHeader className="pb-2">
									<div className="flex items-start justify-between">
										<div className="rounded-lg bg-secondary p-2 text-secondary-foreground transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
											{tool.icon}
										</div>
										<span className="rounded-full bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
											{t(tool.badgeKey)}
										</span>
									</div>
									<CardTitle className="mt-3 text-base font-semibold transition-colors group-hover:text-primary">
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
							className="h-full cursor-not-allowed opacity-60"
						>
							<CardHeader className="pb-2">
								<div className="flex items-start justify-between">
										<div className="rounded-lg bg-muted p-2 text-muted-foreground">
										{tool.icon}
									</div>
										<span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
										{t("tools.comingSoon")}
									</span>
								</div>
									<CardTitle className="mt-3 text-base font-semibold text-muted-foreground">
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
