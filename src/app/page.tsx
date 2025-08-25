"use client"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight, TrendingUp, Shield, Zap, BarChart3, Coins, DollarSign, PieChart } from "lucide-react"
import { useEffect, useState } from "react"
import Footer from "@/components/Footer"

// Animated Coin SVG Component
const AnimatedCoin = ({ className, delay = 0 }: { className?: string; delay?: number }) => (
  <div className={`absolute ${className}`} style={{ animationDelay: `${delay}s` }}>
    <svg width="40" height="40" viewBox="0 0 40 40" className="animate-coin-fall text-primary/20" fill="currentColor">
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" fill="none" />
      <text x="20" y="26" textAnchor="middle" className="text-xs font-bold fill-current">
        ₿
      </text>
    </svg>
  </div>
)

// Floating Coin Background
const CoinBackground = () => {
  const [coins, setCoins] = useState<Array<{ id: number; left: string; delay: number }>>([])

  useEffect(() => {
    const coinArray = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 8,
    }))
    setCoins(coinArray)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {coins.map((coin) => (
        <AnimatedCoin key={coin.id} className={`animate-coin-fall`} delay={coin.delay} />
      ))}
    </div>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative">
      <CoinBackground />

      {/* Header */}
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

      {/* Hero Section */}
      <section className="relative z-10 py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 bg-background text-yellow-500 border-yellow-500">
              <Zap className="w-3 h-3 mr-1 text-yellow-500" />
              Earn 1% Weekly Interest
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Buy Coins Today,
              <br />
              <span className="text-primary">Grow Your Wealth Weekly</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              CoinVest makes crypto investing simple: Buy coins securely and earn <strong>1% interest every week</strong>—steady growth, passive income, zero hassle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/profiles">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg">
                  Start Earning Now
                  <TrendingUp className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-3 text-lg border-border hover:bg-card bg-transparent"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-16 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">1% Weekly</div>
              <div className="text-muted-foreground">Guaranteed Returns</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">50K+</div>
              <div className="text-muted-foreground">Happy Investors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-muted-foreground">Safe & Secure</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Why Choose <span className="text-primary">CoinVest</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We make investing effortless—buy coins instantly and enjoy weekly interest on your balance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>1% Weekly Growth</CardTitle>
                <CardDescription>
                  Your money works for you. Earn guaranteed <strong>1% interest every single week</strong>.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Secure & Reliable</CardTitle>
                <CardDescription>
                  Your funds are protected with bank-grade security, 2FA, and cold storage.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <PieChart className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Simple Investing</CardTitle>
                <CardDescription>
                  No complex charts—just buy coins, sit back, and watch your balance grow every week.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Instant Withdrawals</CardTitle>
                <CardDescription>
                  Access your profits anytime with fast and hassle-free withdrawals.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>
                  Buy and earn in seconds with our ultra-fast platform built for all investors.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Passive Income</CardTitle>
                <CardDescription>
                  Relax while your coins earn for you—turning your balance into growing wealth.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Start Growing Your
              <br />
              <span className="text-primary">Crypto Wealth Today</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of investors earning <strong>1% weekly interest</strong> with CoinVest.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/profiles">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg">
                  Create Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-3 text-lg border-border hover:bg-card bg-transparent"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
