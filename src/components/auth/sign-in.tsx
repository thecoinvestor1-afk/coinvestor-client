"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Phone, Mail, Chrome } from "lucide-react"

export default function SignInComponent() {
    const [isLoading, setIsLoading] = useState(false)
    const [otpSent, setOtpSent] = useState(false)
    const [activeTab, setActiveTab] = useState("email")
    const [formData, setFormData] = useState({
        phoneNumber: '',
        otp: ''
    })

    const handleSendOTP = async () => {
        // Replace with Better Auth endpoint
        const response = await fetch('/api/auth/send-verification-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                phoneNumber: formData.phoneNumber.trim(),
                type: 'sign-in'
            })
        });
    };

    const handleVerifyOTP = async () => {

    };

    const handleForgotPassword = async () => {

    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute animate-coin-fall opacity-10"
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 8}s`,
                            animationDuration: `${8 + Math.random() * 4}s`,
                        }}
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent animate-coin-spin" />
                    </div>
                ))}
            </div>

            <Card className="w-full max-w-md bg-card/95 backdrop-blur-sm border-border/50">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                        <div className="w-6 h-6 rounded-full bg-primary-foreground" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-foreground">Welcome Back</CardTitle>
                    <CardDescription className="text-muted-foreground">Sign in to your coin investor account</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                            <TabsTrigger value="email" className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Email
                            </TabsTrigger>
                            <TabsTrigger value="phone" className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                Phone
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="email" className="space-y-4 mt-6">
                            {!otpSent ? (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input id="email" type="email" placeholder="Enter your email" className="bg-input border-border" />
                                    </div>
                                    <Button
                                        onClick={() => handleSendOTP("email")}
                                        disabled={isLoading}
                                        className="w-full bg-primary hover:bg-primary/90"
                                    >
                                        {isLoading ? "Sending OTP..." : "Send Email OTP"}
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email-otp">Enter OTP</Label>
                                        <Input
                                            id="email-otp"
                                            type="text"
                                            placeholder="Enter 6-digit OTP"
                                            maxLength={6}
                                            className="bg-input border-border text-center text-lg tracking-widest"
                                        />
                                    </div>
                                    <Button
                                        onClick={handleVerifyOTP}
                                        disabled={isLoading}
                                        className="w-full bg-primary hover:bg-primary/90"
                                    >
                                        {isLoading ? "Verifying..." : "Verify & Sign In"}
                                    </Button>
                                    <Button variant="ghost" onClick={() => setOtpSent(false)} className="w-full text-muted-foreground">
                                        Back to Email
                                    </Button>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="phone" className="space-y-4 mt-6">
                            {!otpSent ? (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" className="bg-input border-border" />
                                    </div>
                                    <Button
                                        onClick={() => handleSendOTP("phone")}
                                        disabled={isLoading}
                                        className="w-full bg-primary hover:bg-primary/90"
                                    >
                                        {isLoading ? "Sending OTP..." : "Send SMS OTP"}
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone-otp">Enter OTP</Label>
                                        <Input
                                            id="phone-otp"
                                            type="text"
                                            placeholder="Enter 6-digit OTP"
                                            maxLength={6}
                                            className="bg-input border-border text-center text-lg tracking-widest"
                                        />
                                    </div>
                                    <Button
                                        onClick={handleVerifyOTP}
                                        disabled={isLoading}
                                        className="w-full bg-primary hover:bg-primary/90"
                                    >
                                        {isLoading ? "Verifying..." : "Verify & Sign In"}
                                    </Button>
                                    <Button variant="ghost" onClick={() => setOtpSent(false)} className="w-full text-muted-foreground">
                                        Back to Phone
                                    </Button>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                    <>
                        <div className="text-center text-sm text-muted-foreground">
                            Don't have an account?{" "}
                            <Link href="/sign-up" className="text-primary hover:underline font-medium">
                                Create Account
                            </Link>
                        </div>
                        <div className="text-center">
                            <Button
                                variant="ghost"
                                // onClick={() => setShowForgotPassword(true)}
                                className="text-sm text-muted-foreground hover:text-primary p-0"
                            >
                                Forgot your password?
                            </Button>
                        </div>
                    </>
                </CardFooter>
            </Card>
        </div>
    )
}
