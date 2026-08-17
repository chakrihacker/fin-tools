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
				<h1 className="text-2xl font-bold tracking-tight">
					Stock Average Calculator
				</h1>
				<p className="text-sm text-muted-foreground">
					Calculate how many shares to buy to reach your target average price
				</p>
			</div>

			{/* Calculator Card */}
			<Card>
				<CardHeader className="pb-2">
					<div className="flex flex-wrap items-center justify-between gap-3">
						{/* Mode Toggle */}
						<div className="flex w-full overflow-hidden rounded-md border border-input sm:w-auto">
							<button
								type="button"
								onClick={() => handleModeChange("price")}
								className={`flex-1 px-3 py-2 text-sm font-medium transition-colors sm:flex-none sm:px-4 ${
									mode === "price"
										? "bg-primary text-primary-foreground"
										: "bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground"
								}`}
							>
								Enter Target Price
							</button>
							<button
								type="button"
								onClick={() => handleModeChange("percent")}
								className={`flex-1 px-3 py-2 text-sm font-medium transition-colors sm:flex-none sm:px-4 ${
									mode === "percent"
										? "bg-primary text-primary-foreground"
										: "bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground"
								}`}
							>
								Enter % Change
							</button>
						</div>

						{/* Currency Selector */}
						<div className="w-full sm:w-32">
							<Select
								value={currency}
								onValueChange={(v) =>
									handleCurrencyChange(v as CurrencyValue)
								}
							>
								<SelectTrigger>
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
								/>
							</div>
						)}
					</div>
				</CardContent>

				<CardFooter className="flex flex-col-reverse gap-3 px-6 pb-6 pt-2 sm:flex-row sm:justify-between">
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
					className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
				>
					<span className="mt-0.5 shrink-0">⚠️</span>
					<span>{error}</span>
				</div>
			)}

			{/* Warning Alert */}
			{warning && (
				<div
					role="alert"
					className="flex items-start gap-3 rounded-lg border bg-muted px-4 py-3 text-sm text-muted-foreground"
				>
					<span className="mt-0.5 shrink-0">ℹ️</span>
					<span>{warning}</span>
				</div>
			)}

			{/* Results */}
			<div ref={resultRef}>
				{result && (
					<Card>
						<CardHeader className="pb-2">
							<div className="flex items-center justify-between flex-wrap gap-2">
								<CardTitle className="text-lg font-semibold">
									Results
								</CardTitle>
								<span
									className={`text-sm font-medium px-3 py-1 rounded-full ${
										result.direction === "down"
											? "bg-secondary text-secondary-foreground"
											: "bg-accent text-accent-foreground"
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
								<div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border py-2">
									<dt className="text-sm text-muted-foreground">
										Additional Shares to Buy
									</dt>
									<dd className="ml-auto text-right text-sm font-medium tabular-nums">
										{fmtInt(result.additionalShares)}
									</dd>
								</div>
								<div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border py-2">
									<dt className="text-sm text-muted-foreground">
										Additional Investment
									</dt>
									<dd className="ml-auto text-right text-sm font-medium tabular-nums">
										{fmt(result.additionalInvestment)}
									</dd>
								</div>
								<div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border py-2">
									<dt className="text-sm text-muted-foreground">
										New Total Shares
									</dt>
									<dd className="ml-auto text-right text-sm font-medium tabular-nums">
										{fmtInt(result.newTotalShares)}
									</dd>
								</div>
								<div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border py-2">
									<dt className="text-sm text-muted-foreground">
										New Total Cost
									</dt>
									<dd className="ml-auto text-right text-sm font-medium tabular-nums">
										{fmt(result.newTotalCost)}
									</dd>
								</div>
								<div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border py-2">
									<dt className="text-sm font-semibold">
										Final Average Price
									</dt>
									<dd className="ml-auto text-right text-base font-bold tabular-nums text-primary">
										{fmt(result.finalAvg)}
									</dd>
								</div>
								<div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border py-2">
									<dt className="text-sm text-muted-foreground">
										Target Average
									</dt>
									<dd className="ml-auto text-right text-sm font-medium tabular-nums">
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
			<Card>
				<CardContent className="pt-6">
					<details>
						<summary className="cursor-pointer select-none text-sm font-semibold">
							Formula Explainer
						</summary>
						<pre className="mt-3 overflow-x-auto rounded-md bg-muted p-4 text-xs leading-relaxed text-muted-foreground font-mono">
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
			<p className="pb-4 text-center text-xs text-muted-foreground">
				For educational purposes only — not financial advice.
			</p>
		</div>
	);
}
