export interface StockAverageInput {
	sharesOwned: number;
	currentAvg: number;
	marketPrice: number;
	targetAvg: number;
}

export interface StockAverageResult {
	additionalShares: number;
	additionalSharesRaw: number;
	additionalInvestment: number;
	newTotalShares: number;
	newTotalCost: number;
	finalAvg: number;
	direction: "down" | "up";
}

export function calculateStockAverage(
	input: StockAverageInput,
): StockAverageResult {
	const { sharesOwned, currentAvg, marketPrice, targetAvg } = input;

	const additionalSharesRaw =
		(sharesOwned * (currentAvg - targetAvg)) / (targetAvg - marketPrice);

	const additionalShares = Math.ceil(additionalSharesRaw);
	const additionalInvestment = additionalShares * marketPrice;
	const newTotalShares = sharesOwned + additionalShares;
	const newTotalCost = sharesOwned * currentAvg + additionalInvestment;
	const finalAvg = newTotalCost / newTotalShares;
	const direction = targetAvg < currentAvg ? "down" : "up";

	return {
		additionalShares,
		additionalSharesRaw,
		additionalInvestment,
		newTotalShares,
		newTotalCost,
		finalAvg,
		direction,
	};
}

export type ValidationError = string | null;

export function validateStockAverageInputs({
	sharesOwned,
	currentAvg,
	marketPrice,
	targetAvg,
	mode,
	pct,
	currency,
}: {
	sharesOwned: number | undefined;
	currentAvg: number | undefined;
	marketPrice: number | undefined;
	targetAvg: number | undefined;
	mode: "price" | "percent";
	pct: number | undefined;
	currency: string;
}): ValidationError {
	if (!sharesOwned || isNaN(sharesOwned) || sharesOwned < 1) {
		return "Please enter a valid number of shares owned (minimum 1).";
	}
	if (!currentAvg || isNaN(currentAvg) || currentAvg <= 0) {
		return "Please enter a valid current average price per share.";
	}
	if (!marketPrice || isNaN(marketPrice) || marketPrice <= 0) {
		return "Please enter a valid current market price per share.";
	}
	if (mode === "price") {
		if (!targetAvg || isNaN(targetAvg) || targetAvg <= 0) {
			return "Please enter a valid target average price.";
		}
	} else {
		if (pct === undefined || isNaN(pct)) {
			return "Please enter a valid percentage change (e.g. -10 for a 10% reduction).";
		}
		if (pct === 0) {
			return "A 0% change means no action needed — your average is already at the target!";
		}
	}

	const resolvedTarget =
		mode === "percent"
			? (currentAvg ?? 0) * (1 + (pct ?? 0) / 100)
			: (targetAvg ?? 0);

	if (Math.abs(resolvedTarget - (currentAvg ?? 0)) < 0.0001) {
		return "Target average equals your current average — no additional shares needed!";
	}

	const isAveragingDown = resolvedTarget < (currentAvg ?? 0);

	if (isAveragingDown) {
		if (marketPrice >= (currentAvg ?? 0)) {
			return `To lower your average, the market price must be below your current average price. Currently market price (${currency}${marketPrice.toFixed(2)}) ≥ current avg (${currency}${(currentAvg ?? 0).toFixed(2)}).`;
		}
		if (resolvedTarget <= marketPrice) {
			return `Target average (${currency}${resolvedTarget.toFixed(2)}) cannot be at or below the market price (${currency}${marketPrice.toFixed(2)}). You can only reach an average between market price and current average.`;
		}
	} else {
		if (marketPrice <= (currentAvg ?? 0)) {
			return "To raise your average, the market price must be above your current average price.";
		}
		if (resolvedTarget >= marketPrice) {
			return `Target average (${currency}${resolvedTarget.toFixed(2)}) cannot be at or above the market price (${currency}${marketPrice.toFixed(2)}).`;
		}
	}

	const rawShares =
		((sharesOwned ?? 0) * ((currentAvg ?? 0) - resolvedTarget)) /
		(resolvedTarget - marketPrice);
	if (rawShares <= 0) {
		return "The calculation yields a non-positive number of additional shares. Please check your inputs.";
	}

	return null;
}
