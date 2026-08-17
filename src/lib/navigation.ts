export const navigationItems = [
	{
		href: "/",
		label: "Home",
		labelKey: "nav.home",
		mobileLabelKey: "nav.home",
		icon: "home",
	},
	{
		href: "/vaddi",
		label: "Interest Calculator",
		labelKey: "nav.interestCalculator",
		mobileLabelKey: "nav.interest",
		icon: "interest",
	},
	{
		href: "/stock-average",
		label: "Stock Average",
		labelKey: "nav.stockAverage",
		mobileLabelKey: "nav.average",
		icon: "average",
	},
	{
		href: "/profit-booking",
		label: "Profit Booking",
		labelKey: "nav.profitBooking",
		mobileLabelKey: "nav.profit",
		icon: "profit",
	},
] as const;

export type NavigationItem = (typeof navigationItems)[number];