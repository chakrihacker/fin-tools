import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type MobileNavigationProps = {
	currentPath: string;
};

const links = [
	{ href: "/", label: "Home" },
	{ href: "/vaddi", label: "Interest Calculator" },
	{ href: "/stock-average", label: "Stock Average" },
];

export function MobileNavigation({ currentPath }: MobileNavigationProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon" aria-label="Open navigation menu">
					<Menu className="h-[1.2rem] w-[1.2rem]" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="min-w-48">
				{links.map((link) => (
					<DropdownMenuItem key={link.href} asChild>
						<a
							href={link.href}
							className={
								currentPath === link.href
									? "bg-accent text-accent-foreground"
									: undefined
							}
						>
							{link.label}
						</a>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}