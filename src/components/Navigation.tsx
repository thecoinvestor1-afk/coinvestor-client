import { ArrowRight, Coins } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button"


export default function Navigation() {
    return (
        <header className="relative z-10 border-b border-border/50 backdrop-blur-sm bg-background/80">
            <div className="container mx-auto px-4 py-4">
                <nav className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <Coins className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold text-foreground">CoinVest</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-6">
                        <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                            Features
                        </Link>
                        <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                            How It Works
                        </Link>
                        <Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                            About
                        </Link>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Link href="/sign-in">
                            <Button variant="ghost" size="sm">
                                Sign In
                            </Button>
                        </Link>
                        <Link href="/profiles">
                            <Button size="sm" className="bg-primary hover:bg-primary/90">
                                Get Started
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </nav>
            </div>
        </header>
    )
}