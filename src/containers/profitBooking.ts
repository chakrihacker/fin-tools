export interface ProfitBookingInput {
	averageBuyPrice: number;
	currentPrice: number;
	quantity: number;
}

export interface ProfitBookingProfitResult {
	status: "profit";
	investment: number;
	currentValue: number;
	profit: number;
	exactSellQuantity: number;
	exactHoldQuantity: number;
	exactSellPercentage: number;
	exactHoldPercentage: number;
	practicalSellQuantity: number;
	practicalHoldQuantity: number;
	cashRecovered: number;
	heldValue: number;
}

export interface ProfitBookingNoProfitResult {
	status: "no-profit";
	investment: number;
	currentValue: number;
	profit: number;
	shortfall: number;
}

export type ProfitBookingResult =
	| ProfitBookingProfitResult
	| ProfitBookingNoProfitResult;

export function validateProfitBookingInputs({
	averageBuyPrice,
	currentPrice,
	quantity,
}: Partial<ProfitBookingInput>): string | null {
	if (
		averageBuyPrice === undefined ||
		!Number.isFinite(averageBuyPrice) ||
		averageBuyPrice <= 0
	) {
		return "Please enter a valid average buy price.";
	}

	if (
		currentPrice === undefined ||
		!Number.isFinite(currentPrice) ||
		currentPrice <= 0
	) {
		return "Please enter a valid current price.";
	}

	if (
		quantity === undefined ||
		!Number.isFinite(quantity) ||
		quantity <= 0
	) {
		return "Please enter a valid quantity held.";
	}

	return null;
}

export function calculateProfitBooking(
	input: ProfitBookingInput,
): ProfitBookingResult {
	const { averageBuyPrice, currentPrice, quantity } = input;
	const investment = averageBuyPrice * quantity;
	const currentValue = currentPrice * quantity;
	const profit = currentValue - investment;

	if (currentPrice <= averageBuyPrice) {
		return {
			status: "no-profit",
			investment,
			currentValue,
			profit,
			shortfall: Math.max(0, investment - currentValue),
		};
	}

	const exactSellQuantity = investment / currentPrice;
	const exactHoldQuantity = quantity - exactSellQuantity;
	const exactSellPercentage = (exactSellQuantity / quantity) * 100;
	const exactHoldPercentage = 100 - exactSellPercentage;
	const practicalSellQuantity = Math.min(quantity, Math.ceil(exactSellQuantity));
	const practicalHoldQuantity = quantity - practicalSellQuantity;

	return {
		status: "profit",
		investment,
		currentValue,
		profit,
		exactSellQuantity,
		exactHoldQuantity,
		exactSellPercentage,
		exactHoldPercentage,
		practicalSellQuantity,
		practicalHoldQuantity,
		cashRecovered: practicalSellQuantity * currentPrice,
		heldValue: practicalHoldQuantity * currentPrice,
	};
}