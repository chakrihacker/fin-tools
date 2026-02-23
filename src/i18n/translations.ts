export type Locale = "en" | "te";

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
	en: "English",
	te: "తెలుగు",
};

export const translations = {
	en: {
		nav: {
			home: "Home",
			interestCalculator: "Interest Calculator",
		},
		tools: {
			title: "Financial Tools",
			subtitle: "Simple, powerful tools for your everyday financial calculations",
			comingSoon: "Coming soon",
			interestCalculator: {
				title: "Interest Calculator",
				description:
					"Calculate simple and compound interest. Supports date-based or period-based duration.",
				badge: "Vaddi",
			},
		},
		common: {
			currencySymbol: "₹",
		},
		vaddi: {
			pageTitle: "Interest Calculator",
			pageDescription:
				"Calculate simple, compound, village and bank interest with ease",
			interestType: "Interest Type",
			simpleInterest: "Simple Interest",
			compoundInterest: "Compound Interest",
			interestRateIn: "Interest Rate is in",
			rupeePerMonth: "Rupee per month",
			percentPerAnnum: "Percent per annum",
			amount: "Amount",
			interestRate: "Interest Rate",
			loanDurationType: "Loan Duration",
			startEndDate: "Start and End date",
			timePeriod: "Time period",
			startDate: "Start Date",
			endDate: "End Date",
			years: "Years",
			months: "Months",
			days: "Days",
			compoundFrequency: "Compound Frequency",
			annually: "Annually",
			semiAnnually: "Semi-annually",
			custom: "Custom",
			compoundEvery: "Compound every (months)",
			clear: "Clear",
			calculate: "Calculate",
			result: {
				simpleTitle: "Simple Interest Result",
				compoundTitle: "Compound Interest Result",
				principal: "Principal Amount",
				duration: "Loan Duration",
				interestRate: "Interest Rate",
				interest: "Interest",
				totalAmount: "Total Amount",
				rupeePerMonthLabel: "per 100 per month",
				percentPerAnnumLabel: "per annum",
			},
		},
	},
	te: {
		nav: {
			home: "హోమ్",
			interestCalculator: "వడ్డీ కాలిక్యులేటర్",
		},
		tools: {
			title: "ఆర్థిక సాధనాలు",
			subtitle:
				"మీ రోజువారీ ఆర్థిక లెక్కలకు సరళమైన, శక్తివంతమైన సాధనాలు",
			comingSoon: "త్వరలో వస్తుంది",
			interestCalculator: {
				title: "వడ్డీ కాలిక్యులేటర్",
				description:
					"సాధారణ మరియు సమ్మిళిత వడ్డీని సులభంగా లెక్కించండి. తేదీ లేదా కాల వ్యవధి ఆధారంగా లెక్కించవచ్చు.",
				badge: "వడ్డీ",
			},
		},
		common: {
			currencySymbol: "₹",
		},
		vaddi: {
			pageTitle: "వడ్డీ కాలిక్యులేటర్",
			pageDescription:
				"సాధారణ, సమ్మిళిత, గ్రామ మరియు బ్యాంకు వడ్డీని లెక్కించండి",
			interestType: "వడ్డీ రకం",
			simpleInterest: "సాధారణ వడ్డీ",
			compoundInterest: "సమ్మిళిత వడ్డీ",
			interestRateIn: "వడ్డీ రేటు రకం",
			rupeePerMonth: "నెలకు రూపాయి",
			percentPerAnnum: "సంవత్సరానికి శాతం",
			amount: "మొత్తం",
			interestRate: "వడ్డీ రేటు",
			loanDurationType: "రుణ వ్యవధి",
			startEndDate: "ప్రారంభ మరియు ముగింపు తేదీ",
			timePeriod: "కాల వ్యవధి",
			startDate: "ప్రారంభ తేదీ",
			endDate: "ముగింపు తేదీ",
			years: "సంవత్సరాలు",
			months: "నెలలు",
			days: "రోజులు",
			compoundFrequency: "సమ్మిళిత పౌనఃపుణ్యం",
			annually: "వార్షికంగా",
			semiAnnually: "అర్ధ వార్షికంగా",
			custom: "అనుకూల",
			compoundEvery: "ప్రతి (నెలలు) సమ్మిళితం",
			clear: "క్లియర్",
			calculate: "లెక్కించు",
			result: {
				simpleTitle: "సాధారణ వడ్డీ ఫలితం",
				compoundTitle: "సమ్మిళిత వడ్డీ ఫలితం",
				principal: "అసలు మొత్తం",
				duration: "రుణ వ్యవధి",
				interestRate: "వడ్డీ రేటు",
				interest: "వడ్డీ",
				totalAmount: "మొత్తం",
				rupeePerMonthLabel: "100 కి నెలకు",
				percentPerAnnumLabel: "సంవత్సరానికి",
			},
		},
	},
} as const;

export type TranslationKeys = typeof translations.en;
