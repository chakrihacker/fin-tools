import { describe, expect, it } from "vitest";
import {
	calculateProfitBooking,
	validateProfitBookingInputs,
} from "../src/containers/profitBooking";

describe("calculateProfitBooking", () => {
	it("splits a profitable position into capital recovery and profit", () => {
		const result = calculateProfitBooking({
			averageBuyPrice: 100,
			currentPrice: 125,
			quantity: 100,
		});

		expect(result.status).toBe("profit");
		if (result.status !== "profit") return;

		expect(result.investment).toBe(10000);
		expect(result.currentValue).toBe(12500);
		expect(result.profit).toBe(2500);
		expect(result.exactSellQuantity).toBe(80);
		expect(result.exactHoldQuantity).toBe(20);
		expect(result.practicalSellQuantity).toBe(80);
		expect(result.practicalHoldQuantity).toBe(20);
		expect(result.cashRecovered).toBe(10000);
	});

	it("rounds a fractional actionable sale upward to recover capital", () => {
		const result = calculateProfitBooking({
			averageBuyPrice: 100,
			currentPrice: 130,
			quantity: 10,
		});

		expect(result.status).toBe("profit");
		if (result.status !== "profit") return;

		expect(result.exactSellQuantity).toBeCloseTo(1000 / 130, 8);
		expect(result.practicalSellQuantity).toBe(8);
		expect(result.cashRecovered).toBeGreaterThanOrEqual(result.investment);
		expect(result.practicalHoldQuantity).toBe(2);
	});

	it("keeps exact split percentages balanced", () => {
		const result = calculateProfitBooking({
			averageBuyPrice: 150,
			currentPrice: 200,
			quantity: 30,
		});

		expect(result.status).toBe("profit");
		if (result.status !== "profit") return;

		expect(result.exactSellPercentage + result.exactHoldPercentage).toBeCloseTo(
			100,
			10,
		);
		expect(result.exactSellQuantity + result.exactHoldQuantity).toBeCloseTo(
			30,
			10,
		);
	});

	it("returns a break-even position as no profit", () => {
		const result = calculateProfitBooking({
			averageBuyPrice: 100,
			currentPrice: 100,
			quantity: 20,
		});

		expect(result).toMatchObject({
			status: "no-profit",
			profit: 0,
			shortfall: 0,
		});
	});

	it("returns the shortfall for a losing position", () => {
		const result = calculateProfitBooking({
			averageBuyPrice: 100,
			currentPrice: 80,
			quantity: 20,
		});

		expect(result).toMatchObject({
			status: "no-profit",
			investment: 2000,
			currentValue: 1600,
			profit: -400,
			shortfall: 400,
		});
	});
});

describe("validateProfitBookingInputs", () => {
	it("accepts positive finite inputs", () => {
		expect(
			validateProfitBookingInputs({
				averageBuyPrice: 100,
				currentPrice: 120,
				quantity: 10,
			}),
		).toBeNull();
	});

	it("rejects missing or non-positive values", () => {
		expect(validateProfitBookingInputs({})).toMatch(/average buy price/);
		expect(
			validateProfitBookingInputs({
				averageBuyPrice: 100,
				currentPrice: 0,
				quantity: 10,
			}),
		).toMatch(/current price/);
		expect(
			validateProfitBookingInputs({
				averageBuyPrice: 100,
				currentPrice: 120,
				quantity: Number.NaN,
			}),
		).toMatch(/quantity held/);
	});
});