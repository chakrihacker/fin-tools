"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	calculateStockAverage,
	validateStockAverageInputs,
	type StockAverageResult,
} from "./stockAverage";
import { useRef, useState } from "react";

const CURRENCIES = [
	{ value: "INR", label: "₹ INR", symbol: "₹" },
	{ value: "USD", label: "$ USD", symbol: "$" },
	{ value: "EUR", label: "€ EUR", symbol: "€" },
] as const;

type CurrencyValue = (typeof CURRENCIES)[number]["value"];

export default function StockAverageCalculator() {
	const [currency, setCurrency] = useState<CurrencyValue>("INR");
	const [mode, setMode] = useState<"price" | "percent">("price");

	const [sharesOwned, setSharesOwned] = useState("");
	const [currentAvg, setCurrentAvg] = useState("");
	const [marketPrice, setMarketPrice] = useState("");
	const [targetPrice, setTargetPrice] = useState("");
	const [pctChange, setPctChange] = useState("");

	const [error, setError] = useState<string | null>(null);
	const [warning, setWarning] = useState<string | null>(null);
	const [result, setResult] = useState<StockAverageResult | null>(null);
	const [copied, setCopied] = useState(false);

	const resultRef = useRef<HTMLDivElement>(null);

	const currencySymbol =
		CURRENCIES.find((c) => c.value === currency)?.symbol ?? "₹";

	const handleModeChange = (newMode: "price" | "percent") => {
		setMode(newMode);
		setError(null);
		setWarning(null);
		setResult(null);
	};

	const handleCurrencyChange = (val: CurrencyValue) => {
		setCurrency(val);
	};

	const parseNum = (val: string) => {
		const n = parseFloat(val);
		return isNaN(n) ? undefined : n;
	};

	const handleCalculate = () => {
		const sharesNum = parseNum(sharesOwned);
		const currentAvgNum = parseNum(currentAvg);
		const marketPriceNum = parseNum(marketPrice);
		const targetPriceNum = parseNum(targetPrice);
		const pctNum = parseNum(pctChange);

		const resolvedTarget =
			mode === "percent" && currentAvgNum !== undefined && pctNum !== undefined
				? currentAvgNum * (1 + pctNum / 100)
				: targetPriceNum;

		const validationError = validateStockAverageInputs({
			sharesOwned: sharesNum,
			currentAvg: currentAvgNum,
			marketPrice: marketPriceNum,
			targetAvg: resolvedTarget,
			mode,
			pct: pctNum,
			currency: currencySymbol,
		});

		if (validationError) {
			setError(validationError);
			setWarning(null);
			setResult(null);
			return;
		}

		setError(null);

		const calcResult = calculateStockAverage({
			sharesOwned: sharesNum!,
			currentAvg: currentAvgNum!,
			marketPrice: marketPriceNum!,
			targetAvg: resolvedTarget!,
		});

		if (calcResult.additionalShares > calcResult.additionalSharesRaw + 0.01) {
			setWarning(
				`Mathematically, you need ${calcResult.additionalSharesRaw.toFixed(4)} shares, but since fractional shares may not be available, we've rounded up to ${calcResult.additionalShares}. Your final average will be slightly better than target.`,
			);
		} else {
			setWarning(null);
		}

		setResult(calcResult);

		setTimeout(() => {
			resultRef.current?.scrollIntoView({
				behavior: "smooth",
				block: "nearest",
			});
		}, 100);
	};

	const handleClear = () => {
		setSharesOwned("");
		setCurrentAvg("");
		setMarketPrice("");
		setTargetPrice("");
		setPctChange("");
		setError(null);
		setWarning(null);
		setResult(null);
	};

	const fmt = (n: number) => `${currencySymbol}${n.toFixed(2)}`;
	const fmtInt = (n: number) => n.toLocaleString();

	const resolvedTargetDisplay =
		result !== null
			? mode === "percent"
				? parseFloat(currentAvg) * (1 + parseFloat(pctChange) / 100)
				: parseFloat(targetPrice)
			: null;

	const handleCopy = async () => {
		if (!result || resolvedTargetDisplay === null) return;
		const sym = currencySymbol;
		const text = [
			"Stock Target Average Calculator Results",
			"————————————————————————",
			`Additional Shares to Buy : ${result.additionalShares.toLocaleString()}`,
			`Additional Investment    : ${sym}${result.additionalInvestment.toFixed(2)}`,
			`New Total Shares         : ${result.newTotalShares.toLocaleString()}`,
			`New Total Cost           : ${sym}${result.newTotalCost.toFixed(2)}`,
			`Final Average Price      : ${sym}${result.finalAvg.toFixed(2)}`,
			`Target Average           : ${sym}${resolvedTargetDisplay.toFixed(2)}`,
			"————————————————————————",
			"(Generated for educational purposes — not financial advice)",
		].join("\n");

		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			// ignore clipboard errors
		}
	};

	return (
		<div className="space-y-6">
			{/* Heading */}
			<div className="space-y-1">
				<h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
					Stock Average Calculator
				</h1>
				<p className="text-sm text-neutral-600 dark:text-neutral-400">
					Calculate how many shares to buy to reach your target average price
				</p>
			</div>

			{/* Calculator Card */}
			<Card className="border-neutral-200 dark:border-neutral-800">
				<CardHeader className="pb-2">
					<div className="flex flex-wrap items-center justify-between gap-3">
						{/* Mode Toggle */}
						<div className="flex rounded-md border border-neutral-200 dark:border-neutral-800 overflow-hidden">
							<button
								type="button"
								onClick={() => handleModeChange("price")}
								className={`px-4 py-2 text-sm font-medium transition-colors ${
									mode === "price"
										? "bg-neutral-900 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-900"
										: "bg-white text-neutral-600 hover:bg-neutral-50 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-900"
								}`}
							>
								Enter Target Price
							</button>
							<button
								type="button"
								onClick={() => handleModeChange("percent")}
								className={`px-4 py-2 text-sm font-medium transition-colors ${
									mode === "percent"
										? "bg-neutral-900 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-900"
										: "bg-white text-neutral-600 hover:bg-neutral-50 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-900"
								}`}
							>
								Enter % Change
							</button>
						</div>

						{/* Currency Selector */}
						<div className="w-32">
							<Select
								value={currency}
								onValueChange={(v) =>
									handleCurrencyChange(v as CurrencyValue)
								}
							>
								<SelectTrigger className="bg-white dark:bg-neutral-950">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{CURRENCIES.map((c) => (
										<SelectItem key={c.value} value={c.value}>
											{c.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardHeader>

				<CardContent className="pt-4 space-y-5">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
						{/* Shares Owned */}
						<div className="space-y-2">
							<Label
								htmlFor="sharesOwned"
								className="text-sm font-medium"
							>
								Shares Owned *
							</Label>
							<Input
								id="sharesOwned"
								type="number"
								min="1"
								step="1"
								placeholder="100"
								value={sharesOwned}
								onChange={(e) => setSharesOwned(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
								className="bg-white dark:bg-neutral-950"
							/>
						</div>

						{/* Current Average Price */}
						<div className="space-y-2">
							<Label
								htmlFor="currentAvg"
								className="text-sm font-medium"
							>
								Current Average Price ({currencySymbol}) *
							</Label>
							<Input
								id="currentAvg"
								type="number"
								min="0.01"
								step="0.01"
								placeholder="500.00"
								value={currentAvg}
								onChange={(e) => setCurrentAvg(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
								className="bg-white dark:bg-neutral-950"
							/>
						</div>

						{/* Market Price */}
						<div className="space-y-2">
							<Label
								htmlFor="marketPrice"
								className="text-sm font-medium"
							>
								Market Price ({currencySymbol}) *
							</Label>
							<Input
								id="marketPrice"
								type="number"
								min="0.01"
								step="0.01"
								placeholder="400.00"
								value={marketPrice}
								onChange={(e) => setMarketPrice(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
								className="bg-white dark:bg-neutral-950"
							/>
						</div>

						{/* Target Price or % Change */}
						{mode === "price" ? (
							<div className="space-y-2">
								<Label
									htmlFor="targetPrice"
									className="text-sm font-medium"
								>
									Target Average Price ({currencySymbol}) *
								</Label>
								<Input
									id="targetPrice"
									type="number"
									min="0.01"
									step="0.01"
									placeholder="450.00"
									value={targetPrice}
									onChange={(e) => setTargetPrice(e.target.value)}
									onKeyDown={(e) =>
										e.key === "Enter" && handleCalculate()
									}
									className="bg-white dark:bg-neutral-950"
								/>
							</div>
						) : (
							<div className="space-y-2">
								<Label
									htmlFor="pctChange"
									className="text-sm font-medium"
								>
									% Change (negative = avg down) *
								</Label>
								<Input
									id="pctChange"
									type="number"
									step="0.1"
									placeholder="-10"
									value={pctChange}
									onChange={(e) => setPctChange(e.target.value)}
									onKeyDown={(e) =>
										e.key === "Enter" && handleCalculate()
									}
									className="bg-white dark:bg-neutral-950"
								/>
							</div>
						)}
					</div>
				</CardContent>

				<CardFooter className="flex justify-between pt-2 pb-6 px-6">
					<Button type="button" variant="outline" onClick={handleClear}>
						Clear
					</Button>
					<Button type="button" onClick={handleCalculate}>
						Calculate
					</Button>
				</CardFooter>
			</Card>

			{/* Error Alert */}
			{error && (
				<div
					role="alert"
					className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800/50 dark:bg-red-950/30 dark:text-red-300"
				>
					<span className="mt-0.5 shrink-0">⚠️</span>
					<span>{error}</span>
				</div>
			)}

			{/* Warning Alert */}
			{warning && (
				<div
					role="alert"
					className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800/50 dark:bg-amber-950/30 dark:text-amber-300"
				>
					<span className="mt-0.5 shrink-0">ℹ️</span>
					<span>{warning}</span>
				</div>
			)}

			{/* Results */}
			<div ref={resultRef}>
				{result && (
					<Card className="border-neutral-200 dark:border-neutral-800">
						<CardHeader className="pb-2">
							<div className="flex items-center justify-between flex-wrap gap-2">
								<CardTitle className="text-lg font-semibold">
									Results
								</CardTitle>
								<span
									className={`text-sm font-medium px-3 py-1 rounded-full ${
										result.direction === "down"
											? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
											: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
									}`}
								>
									{result.direction === "down"
										? "↓ Averaging Down"
										: "↑ Averaging Up"}
								</span>
							</div>
						</CardHeader>
						<CardContent>
							<dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
								<div className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-800">
									<dt className="text-sm text-neutral-600 dark:text-neutral-400">
										Additional Shares to Buy
									</dt>
									<dd className="text-sm font-medium tabular-nums">
										{fmtInt(result.additionalShares)}
									</dd>
								</div>
								<div className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-800">
									<dt className="text-sm text-neutral-600 dark:text-neutral-400">
										Additional Investment
									</dt>
									<dd className="text-sm font-medium tabular-nums text-amber-600 dark:text-amber-400">
										{fmt(result.additionalInvestment)}
									</dd>
								</div>
								<div className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-800">
									<dt className="text-sm text-neutral-600 dark:text-neutral-400">
										New Total Shares
									</dt>
									<dd className="text-sm font-medium tabular-nums">
										{fmtInt(result.newTotalShares)}
									</dd>
								</div>
								<div className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-800">
									<dt className="text-sm text-neutral-600 dark:text-neutral-400">
										New Total Cost
									</dt>
									<dd className="text-sm font-medium tabular-nums">
										{fmt(result.newTotalCost)}
									</dd>
								</div>
								<div className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-800">
									<dt className="text-sm font-semibold">
										Final Average Price
									</dt>
									<dd className="text-base font-bold tabular-nums text-green-600 dark:text-green-400">
										{fmt(result.finalAvg)}
									</dd>
								</div>
								<div className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-800">
									<dt className="text-sm text-neutral-600 dark:text-neutral-400">
										Target Average
									</dt>
									<dd className="text-sm font-medium tabular-nums">
										{resolvedTargetDisplay !== null
											? fmt(resolvedTargetDisplay)
											: "—"}
									</dd>
								</div>
							</dl>

							<div className="mt-4 flex justify-end">
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={handleCopy}
								>
									{copied ? "✅ Copied!" : "Copy to Clipboard"}
								</Button>
							</div>
						</CardContent>
					</Card>
				)}
			</div>

			{/* Formula Explainer */}
			<Card className="border-neutral-200 dark:border-neutral-800">
				<CardContent className="pt-6">
					<details>
						<summary className="cursor-pointer text-sm font-semibold text-neutral-700 dark:text-neutral-300 select-none">
							Formula Explainer
						</summary>
						<pre className="mt-3 overflow-x-auto rounded-md bg-neutral-100 dark:bg-neutral-900 p-4 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-mono">
							{`Additional shares  = (current_shares × (current_avg − target_avg)) / (target_avg − market_price)
Additional invest  = additional_shares × market_price
New total shares   = current_shares + additional_shares
New total cost     = (current_shares × current_avg) + additional_investment
Final avg          = new_total_cost / new_total_shares`}
						</pre>
					</details>
				</CardContent>
			</Card>

			{/* Disclaimer */}
			<p className="text-xs text-center text-neutral-500 dark:text-neutral-500 pb-4">
				For educational purposes only — not financial advice.
			</p>
		</div>
	);
}
