import { describe, expect, it } from "vitest";
import {
	calculateStockAverage,
	validateStockAverageInputs,
} from "../src/containers/stockAverage";

describe("calculateStockAverage", () => {
	it("averages down with target price mode", () => {
		const result = calculateStockAverage({
			sharesOwned: 100,
			currentAvg: 500,
			marketPrice: 400,
			targetAvg: 450,
		});
		expect(result.direction).toBe("down");
		expect(result.additionalShares).toBeGreaterThan(0);
		expect(result.finalAvg).toBeLessThanOrEqual(450 + 0.01);
		expect(result.finalAvg).toBeGreaterThanOrEqual(450 - 1);
	});

	it("averages up with target price mode", () => {
		const result = calculateStockAverage({
			sharesOwned: 100,
			currentAvg: 400,
			marketPrice: 500,
			targetAvg: 450,
		});
		expect(result.direction).toBe("up");
		expect(result.additionalShares).toBeGreaterThan(0);
		expect(result.finalAvg).toBeGreaterThanOrEqual(450 - 0.01);
	});

	it("rounds up fractional additional shares", () => {
		// Chosen values that produce a fractional additionalSharesRaw
		const result = calculateStockAverage({
			sharesOwned: 10,
			currentAvg: 100,
			marketPrice: 80,
			targetAvg: 90,
		});
		expect(result.additionalShares).toBe(Math.ceil(result.additionalSharesRaw));
	});

	it("computes finalAvg correctly based on rounded shares", () => {
		const result = calculateStockAverage({
			sharesOwned: 100,
			currentAvg: 500,
			marketPrice: 400,
			targetAvg: 450,
		});
		const expectedNewTotalCost =
			100 * 500 + result.additionalShares * 400;
		const expectedFinalAvg =
			expectedNewTotalCost / (100 + result.additionalShares);
		expect(result.finalAvg).toBeCloseTo(expectedFinalAvg, 5);
	});

	it("returns direction 'down' when targetAvg < currentAvg", () => {
		const result = calculateStockAverage({
			sharesOwned: 50,
			currentAvg: 200,
			marketPrice: 150,
			targetAvg: 180,
		});
		expect(result.direction).toBe("down");
	});

	it("returns direction 'up' when targetAvg > currentAvg", () => {
		const result = calculateStockAverage({
			sharesOwned: 50,
			currentAvg: 200,
			marketPrice: 250,
			targetAvg: 220,
		});
		expect(result.direction).toBe("up");
	});
});

describe("validateStockAverageInputs", () => {
	const valid = {
		sharesOwned: 100,
		currentAvg: 500,
		marketPrice: 400,
		targetAvg: 450,
		mode: "price" as const,
		pct: undefined,
		currency: "₹",
	};

	it("returns null for valid averaging-down price-mode inputs", () => {
		expect(validateStockAverageInputs(valid)).toBeNull();
	});

	it("errors when sharesOwned < 1", () => {
		expect(
			validateStockAverageInputs({ ...valid, sharesOwned: 0 }),
		).toMatch(/valid number of shares/);
	});

	it("errors when currentAvg <= 0", () => {
		expect(
			validateStockAverageInputs({ ...valid, currentAvg: 0 }),
		).toMatch(/current average price/);
	});

	it("errors when marketPrice <= 0", () => {
		expect(
			validateStockAverageInputs({ ...valid, marketPrice: 0 }),
		).toMatch(/market price per share/);
	});

	it("errors when targetAvg <= 0 in price mode", () => {
		expect(
			validateStockAverageInputs({ ...valid, targetAvg: 0 }),
		).toMatch(/target average price/);
	});

	it("errors when pct is missing in percent mode", () => {
		expect(
			validateStockAverageInputs({
				...valid,
				mode: "percent",
				pct: undefined,
				targetAvg: undefined,
			}),
		).toMatch(/percentage change/);
	});

	it("errors when pct is 0 in percent mode", () => {
		expect(
			validateStockAverageInputs({
				...valid,
				mode: "percent",
				pct: 0,
				targetAvg: undefined,
			}),
		).toMatch(/0% change/);
	});

	it("errors when target equals current average", () => {
		expect(
			validateStockAverageInputs({ ...valid, targetAvg: 500 }),
		).toMatch(/no additional shares needed/);
	});

	it("errors when averaging down but market price >= current avg", () => {
		expect(
			validateStockAverageInputs({
				...valid,
				targetAvg: 450,
				marketPrice: 600,
			}),
		).toMatch(/lower your average/);
	});

	it("errors when averaging down but target <= market price", () => {
		expect(
			validateStockAverageInputs({
				...valid,
				targetAvg: 350,
				marketPrice: 400,
			}),
		).toMatch(/cannot be at or below/);
	});

	it("errors when averaging up but market price <= current avg", () => {
		expect(
			validateStockAverageInputs({
				...valid,
				currentAvg: 400,
				marketPrice: 300,
				targetAvg: 450,
			}),
		).toMatch(/raise your average/);
	});

	it("errors when averaging up but target >= market price", () => {
		expect(
			validateStockAverageInputs({
				...valid,
				currentAvg: 400,
				marketPrice: 500,
				targetAvg: 550,
			}),
		).toMatch(/cannot be at or above/);
	});

	it("accepts valid percent mode inputs", () => {
		expect(
			validateStockAverageInputs({
				...valid,
				mode: "percent",
				pct: -10,
				targetAvg: undefined,
				marketPrice: 400,
				currentAvg: 500,
			}),
		).toBeNull();
	});
});
