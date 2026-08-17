"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
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
import { useTranslations } from "@/i18n";
import {
	calculateProfitBooking,
	validateProfitBookingInputs,
} from "./profitBooking";

const CURRENCIES = [
	{ value: "INR", label: "INR (₹)", symbol: "₹" },
	{ value: "USD", label: "USD ($)", symbol: "$" },
	{ value: "EUR", label: "EUR (€)", symbol: "€" },
] as const;

type Currency = (typeof CURRENCIES)[number]["value"];

function parseNumber(value: string): number | undefined {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : undefined;
}

export default function ProfitBookingCalculator() {
	const { locale, t } = useTranslations();
	const [currency, setCurrency] = useState<Currency>("INR");
	const [averageBuyPrice, setAverageBuyPrice] = useState("");
	const [currentPrice, setCurrentPrice] = useState("");
	const [quantity, setQuantity] = useState("");
	const [formulaOpen, setFormulaOpen] = useState(false);

	const selectedCurrency =
		CURRENCIES.find((item) => item.value === currency) ?? CURRENCIES[0];
	const averageBuyPriceNumber = parseNumber(averageBuyPrice);
	const currentPriceNumber = parseNumber(currentPrice);
	const quantityNumber = parseNumber(quantity);
	const hasAllInputs = [averageBuyPrice, currentPrice, quantity].every(
		(value) => value.trim() !== "",
	);
	const validationError = hasAllInputs
		? validateProfitBookingInputs({
				averageBuyPrice: averageBuyPriceNumber,
				currentPrice: currentPriceNumber,
				quantity: quantityNumber,
			})
		: null;
	const result =
		hasAllInputs && !validationError
			? calculateProfitBooking({
					averageBuyPrice: averageBuyPriceNumber!,
					currentPrice: currentPriceNumber!,
					quantity: quantityNumber!,
				})
			: null;

	const moneyFormatter = new Intl.NumberFormat(
		locale === "te" ? "te-IN" : "en-IN",
		{
			style: "currency",
			currency,
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		},
	);
	const quantityFormatter = new Intl.NumberFormat(
		locale === "te" ? "te-IN" : "en-IN",
		{
			maximumFractionDigits: 2,
		},
	);
	const formatMoney = (value: number) => moneyFormatter.format(value);
	const formatQuantity = (value: number) => quantityFormatter.format(value);

	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
					{t("profitBooking.eyebrow")}
				</p>
				<h1 className="text-3xl font-bold tracking-tight">
					{t("profitBooking.pageTitle")}
				</h1>
				<p className="max-w-2xl text-sm leading-6 text-muted-foreground">
					{t("profitBooking.pageDescription")}
				</p>
			</div>

			<Card>
				<CardHeader className="pb-4">
					<div className="flex flex-wrap items-center justify-between gap-3">
						<CardTitle className="text-base">
							{t("profitBooking.positionTitle")}
						</CardTitle>
						<div className="w-full sm:w-36">
							<Select
								value={currency}
								onValueChange={(value) => setCurrency(value as Currency)}
							>
								<SelectTrigger aria-label={t("profitBooking.currency")}>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{CURRENCIES.map((item) => (
										<SelectItem key={item.value} value={item.value}>
											{item.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardHeader>
				<CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-2">
					<div className="space-y-2">
						<Label htmlFor="average-buy-price">
							{t("profitBooking.averageBuyPrice")}
						</Label>
						<div className="relative">
							<span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
								{selectedCurrency.symbol}
							</span>
							<Input
								id="average-buy-price"
								type="number"
								min="0"
								step="any"
								inputMode="decimal"
								className="pl-7"
								placeholder="0.00"
								value={averageBuyPrice}
								onChange={(event) => setAverageBuyPrice(event.target.value)}
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="current-price">
							{t("profitBooking.currentPrice")}
						</Label>
						<div className="relative">
							<span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
								{selectedCurrency.symbol}
							</span>
							<Input
								id="current-price"
								type="number"
								min="0"
								step="any"
								inputMode="decimal"
								className="pl-7"
								placeholder="0.00"
								value={currentPrice}
								onChange={(event) => setCurrentPrice(event.target.value)}
							/>
						</div>
					</div>

					<div className="space-y-2 sm:col-span-2">
						<Label htmlFor="quantity-held">
							{t("profitBooking.quantityHeld")}
						</Label>
						<div className="relative">
							<span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
								#
							</span>
							<Input
								id="quantity-held"
								type="number"
								min="0"
								step="any"
								inputMode="decimal"
								className="pl-7"
								placeholder="0"
								value={quantity}
								onChange={(event) => setQuantity(event.target.value)}
							/>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="pb-4">
					<div className="flex flex-wrap items-center justify-between gap-3">
						<CardTitle className="text-base">
							{t("profitBooking.splitTitle")}
						</CardTitle>
						<span className="font-mono text-xs text-muted-foreground">
							{result?.status === "profit"
								? t("profitBooking.statusProfit")
								: result?.status === "no-profit"
									? t("profitBooking.statusNoProfit")
									: t("profitBooking.statusAwaiting")}
						</span>
					</div>
				</CardHeader>
				<CardContent className="space-y-5">
					{!result && !validationError ? (
						<CardDescription className="py-4 leading-6">
							{t("profitBooking.awaitingInputs")}
						</CardDescription>
					) : null}

					{validationError ? (
						<div
							role="alert"
							className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
						>
							{validationError}
						</div>
					) : null}

					{result?.status === "no-profit" ? (
						<div className="rounded-md border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm leading-6 text-foreground">
							<p className="font-medium text-amber-700 dark:text-amber-300">
								{result.shortfall === 0
									? t("profitBooking.breakEvenTitle")
									: t("profitBooking.noProfitTitle")}
							</p>
							<p className="mt-1 text-muted-foreground">
								{result.shortfall === 0
									? t("profitBooking.breakEvenDescription")
									: `${t("profitBooking.noProfitDescription")} ${formatMoney(result.currentValue)} / ${formatMoney(result.investment)}. ${t("profitBooking.shortfallLabel")} ${formatMoney(result.shortfall)}.`}
							</p>
						</div>
					) : null}

					{result?.status === "profit" ? (
						<>
							<div
								className="flex h-20 overflow-hidden rounded-md border bg-muted"
								aria-label={t("profitBooking.splitChartLabel")}
							>
								<div
									className="flex min-w-0 flex-col justify-center border-r border-dashed border-sky-600/30 bg-sky-500/15 px-3 transition-[width] duration-500"
									style={{ width: `${result.exactSellPercentage}%` }}
								>
									<span className="truncate text-[11px] font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-300">
										{t("profitBooking.sell")}
									</span>
									<span className="truncate text-lg font-semibold">
										{formatQuantity(result.exactSellQuantity)}
									</span>
								</div>
								<div
									className="flex min-w-0 flex-1 flex-col justify-center bg-amber-500/15 px-3"
									style={{ width: `${result.exactHoldPercentage}%` }}
								>
									<span className="truncate text-[11px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
										{t("profitBooking.holdFree")}
									</span>
									<span className="truncate text-lg font-semibold">
										{formatQuantity(result.exactHoldQuantity)}
									</span>
								</div>
							</div>

							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<div className="rounded-md border border-sky-500/30 bg-sky-500/10 p-4">
									<p className="text-xs text-muted-foreground">
										{t("profitBooking.sellToRecover")}
									</p>
									<p className="mt-1 font-mono text-xl font-semibold">
										{formatQuantity(result.practicalSellQuantity)} {t("profitBooking.shares")}
									</p>
									<p className="mt-1 text-xs text-muted-foreground">
										{t("profitBooking.cashRecovered")}: {formatMoney(result.cashRecovered)}
									</p>
								</div>
								<div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-4">
									<p className="text-xs text-muted-foreground">
										{t("profitBooking.holdAtZeroCost")}
									</p>
									<p className="mt-1 font-mono text-xl font-semibold">
										{formatQuantity(result.practicalHoldQuantity)} {t("profitBooking.shares")}
									</p>
									<p className="mt-1 text-xs text-muted-foreground">
										{t("profitBooking.heldValue")}: {formatMoney(result.heldValue)}
									</p>
								</div>
							</div>

							<div className="grid grid-cols-1 gap-4 border-t pt-5 sm:grid-cols-3">
								<SummaryItem
									label={t("profitBooking.totalInvested")}
									value={formatMoney(result.investment)}
								/>
								<SummaryItem
									label={t("profitBooking.valueToday")}
									value={formatMoney(result.currentValue)}
								/>
								<SummaryItem
									label={t("profitBooking.totalProfit")}
									value={formatMoney(result.profit)}
								/>
							</div>
						</>
					) : null}

					<div className="border-t pt-3">
						<Button
							type="button"
							variant="ghost"
							className="h-auto px-0 py-1 text-xs text-muted-foreground hover:bg-transparent hover:text-foreground"
							onClick={() => setFormulaOpen((isOpen) => !isOpen)}
							aria-expanded={formulaOpen}
						>
							<ChevronDown
								className={`mr-1 h-4 w-4 transition-transform ${formulaOpen ? "rotate-180" : ""}`}
							/>
							{t("profitBooking.formulaToggle")}
						</Button>
						{formulaOpen ? (
							<div className="mt-3 rounded-md border bg-muted/50 p-4 font-mono text-xs leading-6 text-muted-foreground">
								<p>{t("profitBooking.formulaSell")}</p>
								<p>{t("profitBooking.formulaHold")}</p>
								<p className="mt-2 font-sans">{t("profitBooking.formulaNote")}</p>
							</div>
						) : null}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

function SummaryItem({ label, value }: { label: string; value: string }) {
	return (
		<div>
			<p className="text-xs text-muted-foreground">{label}</p>
			<p className="mt-1 font-mono text-sm font-medium">{value}</p>
		</div>
	);
}