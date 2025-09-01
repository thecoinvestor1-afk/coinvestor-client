"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Phone, Mail, Eye, EyeOff } from "lucide-react"
import { toast, Toaster } from "sonner"
import { authClient } from "@/lib/auth-client"

interface FormData {
    email: string;
    password: string;
    phoneNumber: string;
    otp: string;
    resetPhone: string;
    resetOtp: string;
    newPassword: string;
}

type FormField = keyof FormData;

export default function SignInComponent() {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [otpSent, setOtpSent] = useState<boolean>(false)
    const [activeTab, setActiveTab] = useState<string>("email")
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false)
    const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false)
    const [resetStep, setResetStep] = useState<number>(1)

    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
        phoneNumber: '',
        otp: '',
        resetPhone: '',
        resetOtp: '',
        newPassword: ''
    })

    const handleInputChange = (field: FormField, value: string): void => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    // Email/Password Sign In
    const handleEmailSignIn = async (): Promise<void> => {
        if (!formData.email.trim() || !formData.password) {
            toast.error('Please enter both email and password')
            return
        }

        setIsLoading(true)
        try {
            const { data, error } = await authClient.signIn.email({
                email: formData.email.trim(),
                password: formData.password
            })

            if (error) {
                toast.error(error.message || 'Invalid email or password')
            } else {
                toast.success('Sign in successful!')
                window.location.href = '/upload'
            }
        } catch (error) {
            toast.error('Sign in failed. Please try again.')
        }
        setIsLoading(false)
    }

    const formatPhoneNumber = (phone: string): string => {
        const cleaned = phone.trim();
        return cleaned.startsWith('+') ? cleaned : '+91' + cleaned;
    };

    // Phone OTP Sign In
    const handleSendPhoneOTP = async (): Promise<void> => {
        if (!formData.phoneNumber.trim()) {
            toast.error('Please enter your phone number')
            return
        }

        setIsLoading(true)
        try {
            const phoneNumber = formatPhoneNumber(formData.phoneNumber);

            const { data, error } = await authClient.phoneNumber.sendOtp({
                phoneNumber: phoneNumber
            })
            if (error) {
                toast.error(error.message || 'Failed to send OTP')
            } else {
                toast.success('OTP sent to your phone!')
                setOtpSent(true)
            }
        } catch (error) {
            toast.error('Failed to send OTP')
        }
        setIsLoading(false)
    }

    const handleVerifyPhoneOTP = async (): Promise<void> => {
        if (!formData.otp.trim() || formData.otp.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP')
            return
        }

        setIsLoading(true)
        try {
            let phoneNumber = formData.phoneNumber.trim()
            if (!phoneNumber.startsWith('+')) {
                phoneNumber = '+91' + phoneNumber
            }

            const { data, error } = await authClient.phoneNumber.verify({
                phoneNumber: phoneNumber,
                code: formData.otp.trim(),
                disableSession: false
            })

            if (error) {
                toast.error(error.message || 'Invalid OTP')
            } else {
                toast.success('Sign in successful!')
                window.location.href = '/upload'
            }
        } catch (error) {
            toast.error('Invalid OTP. Please try again.')
        }
        setIsLoading(false)
    }

    const handleRequestPasswordReset = async (): Promise<void> => {
        if (!formData.resetPhone.trim()) {
            toast.error('Please enter your phone number')
            return
        }

        setIsLoading(true)
        try {
            const phoneNumber = formatPhoneNumber(formData.resetPhone);
            const { data, error } = await authClient.phoneNumber.requestPasswordReset({
                phoneNumber: phoneNumber
            })

            if (error) {
                toast.error(error.message || 'Failed to send reset code')
            } else {
                toast.success('Password reset code sent to your phone!')
                setResetStep(2)
            }
        } catch (error) {
            toast.error('Failed to send reset code')
        }
        setIsLoading(false)
    }

    const handleResetPassword = async (): Promise<void> => {
        if (!formData.resetOtp.trim() || formData.resetOtp.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP')
            return
        }
        if (!formData.newPassword || formData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters')
            return
        }

        setIsLoading(true)
        try {
            let phoneNumber = formData.resetPhone.trim()
            if (!phoneNumber.startsWith('+')) {
                phoneNumber = '+91' + phoneNumber
            }

            const { data, error } = await authClient.phoneNumber.resetPassword({
                otp: formData.resetOtp.trim(),
                phoneNumber: phoneNumber,
                newPassword: formData.newPassword
            })

            if (error) {
                toast.error(error.message || 'Password reset failed')
            } else {
                toast.success('Password reset successful!')
                setShowForgotPassword(false)
                setResetStep(1)
                setFormData(prev => ({ ...prev, resetPhone: '', resetOtp: '', newPassword: '' }))
            }
        } catch (error) {
            toast.error('Password reset failed')
        }
        setIsLoading(false)
    }

    if (showForgotPassword) {
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
                            <Mail className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-foreground">Reset Password</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            {resetStep === 1 ? 'Enter your phone number to receive reset code' : 'Enter the code and your new password'}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {resetStep === 1 ? (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="reset-phone">Phone Number</Label>
                                    <Input
                                        id="reset-phone"
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        value={formData.resetPhone}
                                        onChange={(e) => handleInputChange('resetPhone', e.target.value)}
                                        className="bg-input border-border"
                                    />
                                </div>
                                <Button
                                    onClick={handleRequestPasswordReset}
                                    disabled={isLoading}
                                    className="w-full bg-primary hover:bg-primary/90"
                                >
                                    {isLoading ? "Sending..." : "Send Reset Code"}
                                </Button>
                            </>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="reset-otp">Reset Code</Label>
                                    <Input
                                        id="reset-otp"
                                        type="text"
                                        placeholder="Enter 6-digit code"
                                        maxLength={6}
                                        value={formData.resetOtp}
                                        onChange={(e) => handleInputChange('resetOtp', e.target.value)}
                                        className="bg-input border-border text-center text-lg tracking-widest"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new-password">New Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="new-password"
                                            type={showNewPassword ? "text" : "password"}
                                            placeholder="Enter new password"
                                            value={formData.newPassword}
                                            onChange={(e) => handleInputChange('newPassword', e.target.value)}
                                            className="bg-input border-border pr-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                        >
                                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                                <Button
                                    onClick={handleResetPassword}
                                    disabled={isLoading}
                                    className="w-full bg-primary hover:bg-primary/90"
                                >
                                    {isLoading ? "Resetting..." : "Reset Password"}
                                </Button>
                                <div className="flex justify-between text-sm">
                                    <Button
                                        variant="ghost"
                                        onClick={() => setResetStep(1)}
                                        className="text-muted-foreground p-0"
                                    >
                                        Change Phone
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={handleRequestPasswordReset}
                                        className="text-muted-foreground p-0"
                                    >
                                        Resend Code
                                    </Button>
                                </div>
                            </>
                        )}

                        <Button
                            variant="ghost"
                            onClick={() => {
                                setShowForgotPassword(false)
                                setResetStep(1)
                                setFormData(prev => ({ ...prev, resetPhone: '', resetOtp: '', newPassword: '' }))
                            }}
                            className="w-full text-muted-foreground"
                        >
                            Back to Sign In
                        </Button>
                    </CardContent>
                </Card>

                <Toaster
                    position="top-center"
                    toastOptions={{
                        style: {
                            background: 'hsl(var(--card))',
                            color: 'hsl(var(--card-foreground))',
                            border: '1px solid hsl(var(--border))',
                        },
                    }}
                />
            </div>
        )
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
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className="bg-input border-border"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            value={formData.password}
                                            onChange={(e) => handleInputChange('password', e.target.value)}
                                            className="bg-input border-border pr-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                                <Button
                                    onClick={handleEmailSignIn}
                                    disabled={isLoading}
                                    className="w-full bg-primary hover:bg-primary/90"
                                >
                                    {isLoading ? "Signing In..." : "Sign In"}
                                </Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="phone" className="space-y-4 mt-6">
                            {!otpSent ? (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="Enter your phone number"
                                            value={formData.phoneNumber}
                                            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                            className="bg-input border-border"
                                        />
                                    </div>
                                    <Button
                                        onClick={handleSendPhoneOTP}
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
                                            value={formData.otp}
                                            onChange={(e) => handleInputChange('otp', e.target.value)}
                                            className="bg-input border-border text-center text-lg tracking-widest"
                                        />
                                    </div>
                                    <Button
                                        onClick={handleVerifyPhoneOTP}
                                        disabled={isLoading}
                                        className="w-full bg-primary hover:bg-primary/90"
                                    >
                                        {isLoading ? "Verifying..." : "Verify & Sign In"}
                                    </Button>
                                    <div className="flex justify-between text-sm">
                                        <Button
                                            variant="ghost"
                                            onClick={() => {
                                                setOtpSent(false)
                                                setFormData(prev => ({ ...prev, otp: '' }))
                                            }}
                                            className="text-muted-foreground p-0"
                                        >
                                            Change Phone
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={handleSendPhoneOTP}
                                            className="text-muted-foreground p-0"
                                        >
                                            Resend Code
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link href="/sign-up" className="text-primary hover:underline font-medium">
                            Create Account
                        </Link>
                    </div>
                    <div className="text-center">
                        <Button
                            variant="ghost"
                            onClick={() => setShowForgotPassword(true)}
                            className="text-sm text-muted-foreground hover:text-primary p-0"
                        >
                            Forgot your password?
                        </Button>
                    </div>
                </CardFooter>
            </Card>

            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        background: 'hsl(var(--card))',
                        color: 'hsl(var(--card-foreground))',
                        border: '1px solid hsl(var(--border))',
                    },
                }}
            />
        </div>
    )
}