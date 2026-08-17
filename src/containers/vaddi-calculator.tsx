"use client";

import { Button } from "@/components/ui/button";
import {
Card,
CardContent,
CardDescription,
CardFooter,
CardHeader,
CardTitle,
} from "@/components/ui/card";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import {
Form,
FormControl,
FormField,
FormItem,
FormLabel,
FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTranslations } from "@/i18n";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { calculateTotalYears, durationBetweenDates } from "./utils";

const VaddiCalculatorSchema = z.object({
interestType: z.enum(["simple", "compound"]),
interestRateType: z.enum(["rupee", "percent"]),
amount: z.coerce.number(),
interestRate: z.coerce.number(),
loanDurationType: z.enum(["dates", "period"]),
years: z.coerce.number().optional(),
months: z.coerce.number().optional(),
days: z.coerce.number().optional(),
startDate: z.date().optional(),
endDate: z.date().optional(),
compoundFrequencyMonths: z.coerce.number().optional(),
compoundFrequency: z.enum(["annually", "semiannually", "custom"]),
});

type FormValues = z.infer<typeof VaddiCalculatorSchema>;

const calculateDuration = ({
loanDurationType,
years,
months,
days,
startDate,
endDate,
}: {
loanDurationType: string;
years?: number;
months?: number;
days?: number;
startDate?: Date;
endDate?: Date;
}) => {
if (loanDurationType === "period") {
return { years, months, days };
}
if (loanDurationType === "dates" && startDate && endDate) {
return durationBetweenDates(startDate, endDate);
}
return { years: 0, months: 0, days: 0 };
};

export default function VaddiCalculator() {
	const { t } = useTranslations();
	const currency = t("common.currencySymbol");

const vaddiForm = useForm<FormValues>({
resolver: zodResolver(VaddiCalculatorSchema),
defaultValues: {
interestType: "simple",
interestRateType: "rupee",
amount: "" as unknown as number,
interestRate: "" as unknown as number,
loanDurationType: "dates",
years: "" as unknown as number,
months: "" as unknown as number,
days: "" as unknown as number,
startDate: undefined,
endDate: undefined,
compoundFrequencyMonths: "" as unknown as number,
compoundFrequency: "annually",
},
});

const [interest, setInterest] = useState(0);
const [duration, setDuration] = useState({ years: 0, months: 0, days: 0 });

const resultRef = useRef<HTMLDivElement>(null);

const isInterestTypeCompound = vaddiForm.watch("interestType") === "compound";
const durationType = vaddiForm.watch("loanDurationType");
const compoundFrequency = vaddiForm.watch("compoundFrequency");

const simpleInterest = ({
amount,
time,
rateOfInterest,
}: { amount: number; time: number; rateOfInterest: number }) => {
return amount * rateOfInterest * time;
};

const compoundInterest = ({
amount,
time,
rateOfInterest,
frequency,
}: {
amount: number;
time: number;
rateOfInterest: number;
frequency: number;
}) => {
const totalMonths = Math.floor(12 * Math.floor(time) + (time % 1) * 12);
const totalDays = Math.floor(360 * Math.floor(time) + (time % 1) * 360);
const completePeriods = Math.floor(totalMonths / frequency);

let currentAmount = amount;

for (let i = 0; i < completePeriods; i++) {
const periodInterest = simpleInterest({
amount: currentAmount,
time: frequency / 12,
rateOfInterest,
});
currentAmount += periodInterest;
}

const remainingDays = totalDays - completePeriods * frequency * 30;
if (remainingDays > 0) {
const remainingInterest = simpleInterest({
amount: currentAmount,
rateOfInterest,
time: remainingDays / 360,
});
currentAmount += remainingInterest;
}

return currentAmount - amount;
};

const onSubmit = (data: FormValues) => {
const percentage =
(data.interestRate * (data.interestRateType === "percent" ? 1 : 12)) /
100;
const calcDuration = calculateDuration(data);
setDuration(calcDuration);
const finalDuration = calculateTotalYears(calcDuration);

let result: number;
if (data.interestType === "simple") {
result = simpleInterest({
amount: data.amount,
time: finalDuration,
rateOfInterest: percentage,
});
} else {
result = compoundInterest({
amount: data.amount,
rateOfInterest: percentage,
time: finalDuration,
frequency:
data.compoundFrequency === "custom"
? (data.compoundFrequencyMonths ?? 12)
: data.compoundFrequency === "annually"
? 12
: 6,
});
}

setInterest(result);
setTimeout(() => {
resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
}, 100);

return result;
};

const formatDuration = () => {
const parts = [
duration.years ? `${duration.years} ${t("vaddi.years")}` : "",
duration.months ? `${duration.months} ${t("vaddi.months")}` : "",
duration.days ? `${duration.days} ${t("vaddi.days")}` : "",
].filter(Boolean);
return parts.join(" ") || "—";
};

return (
<div className="space-y-6">
<div className="space-y-1">
<h1 className="text-2xl font-bold tracking-tight">
{t("vaddi.pageTitle")}
</h1>
<p className="text-sm text-muted-foreground">
{t("vaddi.pageDescription")}
</p>
</div>

<Form {...vaddiForm}>
<form onSubmit={vaddiForm.handleSubmit(onSubmit)}>
<Card>
<CardContent className="pt-6 space-y-5">
{/* Interest Type and Rate Type */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
<FormField
control={vaddiForm.control}
name="interestType"
render={({ field }) => (
<FormItem className="space-y-2">
<FormLabel className="text-sm font-medium">
{t("vaddi.interestType")}
</FormLabel>
<FormControl>
<RadioGroup
defaultValue={field.value}
onValueChange={field.onChange}
className="flex flex-wrap gap-x-4 gap-y-2"
>
<FormItem className="flex items-center space-x-2 space-y-0">
<FormControl>
<RadioGroupItem value="simple" id="simple" />
</FormControl>
<FormLabel className="font-normal cursor-pointer">
{t("vaddi.simpleInterest")}
</FormLabel>
</FormItem>
<FormItem className="flex items-center space-x-2 space-y-0">
<FormControl>
<RadioGroupItem value="compound" id="compound" />
</FormControl>
<FormLabel className="font-normal cursor-pointer">
{t("vaddi.compoundInterest")}
</FormLabel>
</FormItem>
</RadioGroup>
</FormControl>
</FormItem>
)}
/>
<FormField
control={vaddiForm.control}
name="interestRateType"
render={({ field }) => (
<FormItem className="space-y-2">
<FormLabel className="text-sm font-medium">
{t("vaddi.interestRateIn")}
</FormLabel>
<FormControl>
<RadioGroup
defaultValue={field.value}
onValueChange={field.onChange}
className="flex flex-wrap gap-x-4 gap-y-2"
>
<FormItem className="flex items-center space-x-2 space-y-0">
<FormControl>
<RadioGroupItem value="rupee" id="rupee" />
</FormControl>
<FormLabel className="font-normal cursor-pointer">
{t("vaddi.rupeePerMonth")}
</FormLabel>
</FormItem>
<FormItem className="flex items-center space-x-2 space-y-0">
<FormControl>
<RadioGroupItem value="percent" id="percent" />
</FormControl>
<FormLabel className="font-normal cursor-pointer">
{t("vaddi.percentPerAnnum")}
</FormLabel>
</FormItem>
</RadioGroup>
</FormControl>
</FormItem>
)}
/>
</div>

{/* Amount and Interest Rate */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
<FormField
control={vaddiForm.control}
name="amount"
render={({ field }) => (
<FormItem className="space-y-2">
<FormLabel htmlFor="amount" className="text-sm font-medium">
{t("vaddi.amount")} *
</FormLabel>
<FormControl>
<Input
{...field}
type="number"
id="amount"
placeholder="0"
className="bg-background"
/>
</FormControl>
<FormMessage />
</FormItem>
)}
/>
<FormField
control={vaddiForm.control}
name="interestRate"
render={({ field }) => (
<FormItem className="space-y-2">
<FormLabel htmlFor="rate" className="text-sm font-medium">
{t("vaddi.interestRate")} *
</FormLabel>
<FormControl>
<Input
{...field}
type="number"
id="rate"
className="bg-background"
placeholder="0"
/>
</FormControl>
<FormMessage />
</FormItem>
)}
/>
</div>

{/* Loan Duration Type */}
<FormField
control={vaddiForm.control}
name="loanDurationType"
render={({ field }) => (
<FormItem className="space-y-2">
<FormLabel className="text-sm font-medium">
{t("vaddi.loanDurationType")}
</FormLabel>
<RadioGroup
defaultValue={field.value}
onValueChange={field.onChange}
className="flex flex-wrap gap-x-4 gap-y-2"
>
<FormItem className="flex items-center space-x-2 space-y-0">
<FormControl>
<RadioGroupItem value="dates" id="dates" />
</FormControl>
<FormLabel
htmlFor="dates"
className="font-normal cursor-pointer"
>
{t("vaddi.startEndDate")}
</FormLabel>
</FormItem>
<FormItem className="flex items-center space-x-2 space-y-0">
<FormControl>
<RadioGroupItem value="period" id="period" />
</FormControl>
<FormLabel
htmlFor="period"
className="font-normal cursor-pointer"
>
{t("vaddi.timePeriod")}
</FormLabel>
</FormItem>
</RadioGroup>
</FormItem>
)}
/>

{/* Duration Inputs */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
{durationType === "dates" ? (
<>
<FormField
control={vaddiForm.control}
name="startDate"
render={({ field }) => (
<FormItem className="space-y-2">
<FormLabel className="text-sm font-medium">
{t("vaddi.startDate")}
</FormLabel>
<FormControl>
<DateTimePicker
granularity="day"
displayFormat={{ hour24: "dd-LLL-yyyy" }}
value={field.value}
onChange={field.onChange}
/>
</FormControl>
<FormMessage />
</FormItem>
)}
/>
<FormField
control={vaddiForm.control}
name="endDate"
render={({ field }) => (
<FormItem className="space-y-2">
<FormLabel className="text-sm font-medium">
{t("vaddi.endDate")}
</FormLabel>
<FormControl>
<DateTimePicker
granularity="day"
displayFormat={{ hour24: "dd-LLL-yyyy" }}
value={field.value}
onChange={field.onChange}
/>
</FormControl>
<FormMessage />
</FormItem>
)}
/>
</>
) : (
<div className="grid grid-cols-3 gap-4 md:col-span-2">
<FormField
control={vaddiForm.control}
name="years"
render={({ field }) => (
<FormItem className="space-y-2">
<FormLabel
htmlFor="years"
className="text-sm font-medium"
>
{t("vaddi.years")}
</FormLabel>
<FormControl>
<Input
{...field}
type="number"
id="years"
min="0"
placeholder="0"
className="bg-background"
/>
</FormControl>
<FormMessage />
</FormItem>
)}
/>
<FormField
control={vaddiForm.control}
name="months"
render={({ field }) => (
<FormItem className="space-y-2">
<FormLabel
htmlFor="months"
className="text-sm font-medium"
>
{t("vaddi.months")}
</FormLabel>
<FormControl>
<Input
{...field}
type="number"
id="months"
min="0"
placeholder="0"
className="bg-background"
/>
</FormControl>
<FormMessage />
</FormItem>
)}
/>
<FormField
control={vaddiForm.control}
name="days"
render={({ field }) => (
<FormItem className="space-y-2">
<FormLabel
htmlFor="days"
className="text-sm font-medium"
>
{t("vaddi.days")}
</FormLabel>
<FormControl>
<Input
{...field}
type="number"
id="days"
min="0"
placeholder="0"
className="bg-background"
/>
</FormControl>
<FormMessage />
</FormItem>
)}
/>
</div>
)}
</div>

{/* Compound Frequency */}
<div className="min-h-[68px] transition-all duration-200">
{isInterestTypeCompound && (
<FormField
control={vaddiForm.control}
name="compoundFrequency"
render={({ field }) => (
<FormItem className="space-y-2">
<FormLabel className="text-sm font-medium">
{t("vaddi.compoundFrequency")}
</FormLabel>
<RadioGroup
defaultValue="annually"
value={field.value}
onValueChange={field.onChange}
className="flex flex-wrap gap-4"
>
<FormItem className="flex items-center space-x-2 space-y-0">
<FormControl>
<RadioGroupItem value="annually" id="annually" />
</FormControl>
<FormLabel
htmlFor="annually"
className="font-normal cursor-pointer"
>
{t("vaddi.annually")}
</FormLabel>
</FormItem>
<FormItem className="flex items-center space-x-2 space-y-0">
<FormControl>
<RadioGroupItem
value="semiannually"
id="semiannually"
/>
</FormControl>
<FormLabel
htmlFor="semiannually"
className="font-normal cursor-pointer"
>
{t("vaddi.semiAnnually")}
</FormLabel>
</FormItem>
<FormItem className="flex items-center space-x-2 space-y-0">
<FormControl>
<RadioGroupItem value="custom" id="custom" />
</FormControl>
<FormLabel
htmlFor="custom"
className="font-normal cursor-pointer"
>
{t("vaddi.custom")}
</FormLabel>
</FormItem>
</RadioGroup>
</FormItem>
)}
/>
)}
</div>

{/* Custom Compound Frequency */}
<div className="min-h-[68px] transition-all duration-200">
{isInterestTypeCompound && compoundFrequency === "custom" && (
<FormField
control={vaddiForm.control}
name="compoundFrequencyMonths"
render={({ field }) => (
<FormItem className="space-y-2">
<Label
htmlFor="customMonths"
className="text-sm font-medium"
>
{t("vaddi.compoundEvery")}
</Label>
<Input
{...field}
type="number"
id="customMonths"
min="1"
className="bg-background"
placeholder="0"
/>
</FormItem>
)}
/>
)}
</div>
</CardContent>
<CardFooter className="flex flex-col-reverse gap-3 px-6 pb-6 pt-2 sm:flex-row sm:justify-between">
<Button
type="button"
variant="outline"
onClick={() => {
vaddiForm.reset();
setInterest(0);
setDuration({ years: 0, months: 0, days: 0 });
}}
>
{t("vaddi.clear")}
</Button>
<Button type="submit">{t("vaddi.calculate")}</Button>
</CardFooter>
</Card>
</form>
</Form>

{/* Result */}
<div ref={resultRef}>
{vaddiForm.formState.isSubmitSuccessful && interest > 0 && (
<Card>
<CardHeader className="pb-2">
<CardTitle className="text-lg font-semibold">
{isInterestTypeCompound
? t("vaddi.result.compoundTitle")
: t("vaddi.result.simpleTitle")}
</CardTitle>
</CardHeader>
<CardContent>
<dl className="space-y-3">
<div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border py-2">
<dt className="text-sm text-muted-foreground">
{t("vaddi.result.principal")}
</dt>
<dd className="ml-auto text-right text-sm font-medium tabular-nums">
{currency}{Number(vaddiForm.getValues("amount")).toLocaleString()}
</dd>
</div>
<div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border py-2">
<dt className="text-sm text-muted-foreground">
{t("vaddi.result.duration")}
</dt>
<dd className="ml-auto text-right text-sm font-medium">{formatDuration()}</dd>
</div>
<div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border py-2">
<dt className="text-sm text-muted-foreground">
{t("vaddi.result.interestRate")}
</dt>
<dd className="ml-auto text-right text-sm font-medium">
{vaddiForm.getValues("interestRate")}{" "}
<span className="font-normal text-muted-foreground">
(
{vaddiForm.getValues("interestRateType") === "rupee"
? t("vaddi.result.rupeePerMonthLabel")
: t("vaddi.result.percentPerAnnumLabel")}
)
</span>
</dd>
</div>
<div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border py-2">
<dt className="text-sm text-muted-foreground">
{t("vaddi.result.interest")}
</dt>
<dd className="ml-auto text-right text-sm font-medium tabular-nums">
{currency}{interest.toFixed(2)}
</dd>
</div>
<div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2">
<dt className="text-sm font-semibold">
{t("vaddi.result.totalAmount")}
</dt>
<dd className="ml-auto text-right text-base font-bold tabular-nums text-primary">
{currency}
{(
Number(vaddiForm.getValues("amount")) + interest
).toFixed(2)}
</dd>
</div>
</dl>
</CardContent>
</Card>
)}
</div>
</div>
);
}
