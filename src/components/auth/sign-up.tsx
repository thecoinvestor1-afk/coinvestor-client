"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Eye, EyeOff } from "lucide-react"
import { toast, Toaster } from "sonner"
import { authClient } from "@/lib/auth-client"

export default function SignInDocumentsFlow() {
    const [currentStep, setCurrentStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [showForgotPassword, setShowForgotPassword] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        otp: ''
    })

    const [errors, setErrors] = useState({})

    const videoRef = useRef(null)
    const canvasRef = useRef(null)
    const fileInputRef = useRef(null)

    // STRICT Validation functions
    const validateStep1 = () => {
        const newErrors = {}
        let isValid = true

        // Check each field strictly
        if (!formData.name || !formData.name.trim()) {
            newErrors.name = 'Full name is required'
            isValid = false
        }

        if (!formData.email || !formData.email.trim()) {
            newErrors.email = 'Email is required'
            isValid = false
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            newErrors.email = 'Please enter a valid email'
            isValid = false
        }

        if (!formData.phone || !formData.phone.trim()) {
            newErrors.phone = 'Phone number is required'
            isValid = false
        } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone.trim())) {
            newErrors.phone = 'Please enter a valid phone number'
            isValid = false
        }

        if (!formData.password || formData.password.length === 0) {
            newErrors.password = 'Password is required'
            isValid = false
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
            isValid = false
        }

        if (!formData.confirmPassword || formData.confirmPassword.length === 0) {
            newErrors.confirmPassword = 'Please confirm your password'
            isValid = false
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const handleSendOTP = async () => {
        if (!validateStep1()) return;

        setIsLoading(true);
        try {

            const { data: signUpData, error: signUpError } = await authClient.signUp.email({
                name: formData.name.trim(),
                email: formData.email.trim(),
                password: formData.password
            });

            if (signUpError) {
                toast.error(signUpError.message || 'Registration failed');
                setIsLoading(false);
                return;
            }

            const { data, error } = await authClient.phoneNumber.sendOtp({
                phoneNumber: formData.phone.trim()
            });

            if (error) {
                toast.error(error.message || 'Failed to send OTP');
            } else {
                toast.success('OTP sent successfully!');
                setCurrentStep(2);
            }
        } catch (error) {
            toast.error('Failed to send OTP');
        }
        setIsLoading(false);
    }

    const handleVerifyOTP = async () => {
        if (!formData.otp.trim() || formData.otp.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP');
            return;
        }

        setIsLoading(true);
        try {
            const { data, error } = await authClient.phoneNumber.verify({
                phoneNumber: formData.phone.trim(),
                code: formData.otp.trim(),
                updatePhoneNumber: true
            });

            if (error) {
                toast.error(error.message || 'Invalid OTP');
            } else {
                toast.success('Phone number verified!');
                // window.location.href = '/upload';
            }
        } catch (error) {
            toast.error('Invalid OTP. Please try again.');
        }
        setIsLoading(false);
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            {/* YOUR EXACT ORIGINAL ANIMATION */}
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
                {/* Step 1: Sign Up Form - PHONE ONLY */}
                {currentStep === 1 && (
                    <>
                        <CardHeader className="text-center space-y-2">
                            <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                                <div className="w-6 h-6 rounded-full bg-primary-foreground" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-foreground">
                                {showForgotPassword ? 'Reset Password' : 'Welcome Back'}
                            </CardTitle>
                            <CardDescription className="text-muted-foreground">
                                {showForgotPassword ? 'Enter your phone number to reset password' : 'Sign in to your coin investor account'}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {showForgotPassword ? (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="forgot-phone">Phone Number</Label>
                                        <Input
                                            id="forgot-phone"
                                            type="tel"
                                            placeholder="+1 (555) 000-0000"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            className="bg-input border-border"
                                        />
                                    </div>
                                    <Button
                                        // onClick={handleForgotPassword}
                                        disabled={isLoading}
                                        className="w-full bg-primary hover:bg-primary/90"
                                    >
                                        {isLoading ? "Sending..." : "Send Reset Code"}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={() => setShowForgotPassword(false)}
                                        className="w-full text-muted-foreground"
                                    >
                                        Back to Sign In
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            placeholder="Enter your full name"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            className={`bg-input border-border ${errors.name ? 'border-red-500' : ''}`}
                                        />
                                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Enter your email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            className={`bg-input border-border ${errors.email ? 'border-red-500' : ''}`}
                                        />
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="+1 (555) 000-0000"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            className={`bg-input border-border ${errors.phone ? 'border-red-500' : ''}`}
                                        />
                                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Create a password"
                                                value={formData.password}
                                                onChange={(e) => handleInputChange('password', e.target.value)}
                                                className={`bg-input border-border pr-10 ${errors.password ? 'border-red-500' : ''}`}
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
                                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="confirmPassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="Confirm your password"
                                                value={formData.confirmPassword}
                                                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                                className={`bg-input border-border pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                                    </div>

                                    <Button
                                        onClick={handleSendOTP}
                                        disabled={isLoading || !formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.password || !formData.confirmPassword}
                                        className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? "Sending OTP..." : "Send SMS OTP"}
                                    </Button>
                                </div>
                            )}
                        </CardContent>

                        <CardFooter className="flex flex-col space-y-4">
                            {!showForgotPassword && (
                                <>
                                    <div className="text-center text-sm text-muted-foreground">
                                        Already have an account?{" "}
                                        <Link href="/sign-in" className="text-primary hover:underline font-medium">
                                            Sign In
                                        </Link>
                                    </div>
                                </>
                            )}
                        </CardFooter>
                    </>
                )}

                {/* Step 2: OTP Verification */}
                {currentStep === 2 && (
                    <>
                        <CardHeader className="text-center space-y-2">
                            <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                                <Phone className="w-6 h-6 text-primary-foreground" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-foreground">Verify Your Phone</CardTitle>
                            <CardDescription className="text-muted-foreground">
                                We sent a 6-digit code to {formData.phone}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="otp">Enter OTP</Label>
                                    <Input
                                        id="otp"
                                        type="text"
                                        placeholder="Enter 6-digit OTP"
                                        maxLength={6}
                                        value={formData.otp}
                                        onChange={(e) => handleInputChange('otp', e.target.value)}
                                        className="bg-input border-border text-center text-lg tracking-widest"
                                    />
                                </div>
                                <Button
                                    onClick={handleVerifyOTP}
                                    disabled={isLoading || !formData.otp.trim() || formData.otp.length !== 6}
                                    className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed"
                                >
                                    {isLoading ? "Verifying..." : "Verify & Continue"}
                                </Button>
                                <div className="flex justify-between text-sm">
                                    <Button variant="ghost" onClick={() => setCurrentStep(1)} className="text-muted-foreground p-0">
                                        Change Phone Number
                                    </Button>
                                    <Button variant="ghost" onClick={handleSendOTP} className="text-muted-foreground p-0">
                                        Resend Code
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </>
                )}
            </Card>

            {/* Sonner Toaster */}
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