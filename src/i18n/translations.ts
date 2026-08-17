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
			profitBooking: "Profit Booking",
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
			stockAverageCalculator: {
				title: "Stock Average Calculator",
				description:
					"Calculate how many shares to buy to reach your target average price",
				badge: "Investing",
			},
			profitBookingCalculator: {
				title: "Profit Booking Calculator",
				description:
					"Find how many shares to sell to recover your original investment.",
				badge: "Investing",
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
		profitBooking: {
			eyebrow: "Profit-Booking Calculator",
			pageTitle: "Cash out your capital, hold the profit.",
			pageDescription:
				"Enter your position to see how many shares to sell to recover your original capital and how many to keep as profit.",
			positionTitle: "Your position",
			currency: "Currency",
			averageBuyPrice: "Average buy price",
			currentPrice: "Current price",
			quantityHeld: "Quantity held",
			splitTitle: "Your split",
			statusAwaiting: "Awaiting inputs",
			statusProfit: "In profit - split ready",
			statusNoProfit: "No profit yet",
			awaitingInputs: "Fill in all three fields above to see the split.",
			breakEvenTitle: "At break-even",
			breakEvenDescription:
				"Your current price matches your average buy price, so there is no profit to carve out yet.",
			noProfitTitle: "No profit to book yet",
			noProfitDescription:
				"The position is currently worth less than your investment.",
			shortfallLabel: "Paper shortfall",
			splitChartLabel: "Exact sell and hold share split",
			sell: "Sell",
			holdFree: "Hold, free",
			sellToRecover: "Sell to recover capital",
			holdAtZeroCost: "Hold at zero net cost",
			shares: "shares",
			cashRecovered: "Cash recovered",
			heldValue: "Worth today",
			totalInvested: "Total invested",
			valueToday: "Value today",
			totalProfit: "Total profit",
			formulaToggle: "How this is calculated",
			formulaSell: "Shares to sell = (average buy price x quantity) / current price",
			formulaHold: "Shares to hold = quantity - shares to sell",
			formulaNote:
				"The sale quantity is rounded up to the next whole share so it recovers at least your original capital.",
		},
	},
	te: {
		nav: {
			home: "హోమ్",
			interestCalculator: "వడ్డీ కాలిక్యులేటర్",
			profitBooking: "లాభ బుకింగ్",
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
			profitBookingCalculator: {
				title: "లాభ బుకింగ్ కాలిక్యులేటర్",
				description:
					"మీ అసలు పెట్టుబడిని వెనక్కి తీసుకోవడానికి ఎన్ని షేర్లు విక్రయించాలో తెలుసుకోండి.",
				badge: "పెట్టుబడి",
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
		profitBooking: {
			eyebrow: "లాభ బుకింగ్ కాలిక్యులేటర్",
			pageTitle: "అసలు పెట్టుబడిని తీసుకోండి, లాభాన్ని ఉంచండి.",
			pageDescription:
				"మీ అసలు పెట్టుబడిని వెనక్కి తీసుకోవడానికి ఎన్ని షేర్లు విక్రయించాలి, లాభంగా ఎన్ని ఉంచుకోవాలో తెలుసుకోండి.",
			positionTitle: "మీ స్థానం",
			currency: "కరెన్సీ",
			averageBuyPrice: "సగటు కొనుగోలు ధర",
			currentPrice: "ప్రస్తుత ధర",
			quantityHeld: "ఉన్న పరిమాణం",
			splitTitle: "మీ విభజన",
			statusAwaiting: "ఇన్‌పుట్‌ల కోసం వేచి ఉంది",
			statusProfit: "లాభంలో ఉంది - విభజన సిద్ధం",
			statusNoProfit: "ఇంకా లాభం లేదు",
			awaitingInputs: "విభజన చూడటానికి పై మూడు ఫీల్డ్‌లను పూర్తి చేయండి.",
			breakEvenTitle: "బ్రేక్-ఈవెన్‌లో ఉంది",
			breakEvenDescription:
				"ప్రస్తుత ధర మీ సగటు కొనుగోలు ధరతో సమానంగా ఉంది; కాబట్టి ఇప్పటికీ లాభం లేదు.",
			noProfitTitle: "బుక్ చేయడానికి లాభం లేదు",
			noProfitDescription:
				"ఈ స్థానం ప్రస్తుతం మీ పెట్టుబడి కంటే తక్కువ విలువ కలిగి ఉంది.",
			shortfallLabel: "కాగితపు లోటు",
			splitChartLabel: "కచ్చితమైన విక్రయ మరియు ఉంచే షేర్ల విభజన",
			sell: "విక్రయించండి",
			holdFree: "ఉచితంగా ఉంచండి",
			sellToRecover: "అసలు పెట్టుబడికి విక్రయించండి",
			holdAtZeroCost: "సున్నా నికర ఖర్చుతో ఉంచండి",
			shares: "షేర్లు",
			cashRecovered: "తిరిగి వచ్చిన నగదు",
			heldValue: "నేటి విలువ",
			totalInvested: "మొత్తం పెట్టుబడి",
			valueToday: "నేటి విలువ",
			totalProfit: "మొత్తం లాభం",
			formulaToggle: "ఇది ఎలా లెక్కించబడుతుంది",
			formulaSell:
				"విక్రయించే షేర్లు = (సగటు కొనుగోలు ధర x పరిమాణం) / ప్రస్తుత ధర",
			formulaHold: "ఉంచే షేర్లు = పరిమాణం - విక్రయించే షేర్లు",
			formulaNote:
				"మీ అసలు పెట్టుబడి పూర్తిగా తిరిగి రావడానికి విక్రయించే పరిమాణాన్ని తదుపరి పూర్తి షేరు వరకు పెంచుతాము.",
		},
	},
} as const;

export type TranslationKeys = typeof translations.en;
