"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Phone, Upload, Camera, RotateCcw, Check, FileText, Eye, EyeOff } from "lucide-react"
import { toast, Toaster } from "sonner"
import { usePhoneAuth } from "@/hooks/usePhoneAuth"

export default function SignInDocumentsFlow() {
    const [currentStep, setCurrentStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [showForgotPassword, setShowForgotPassword] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const { sendOTP, verifyOTP, loading: phoneLoading } = usePhoneAuth();

    // Form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        otp: ''
    })

    // Documents state
    const [adhaarFile, setAdhaarFile] = useState(null)
    const [selfieCapture, setSelfieCapture] = useState(null)
    const [cameraStream, setCameraStream] = useState(null)
    const [showCamera, setShowCamera] = useState(false)
    const [faceDetected, setFaceDetected] = useState(false)

    // Validation errors
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

    const validateStep2 = () => {
        if (!formData.otp || !formData.otp.trim()) {
            toast.error('Please enter the OTP')
            return false
        }
        if (formData.otp.trim().length !== 6) {
            toast.error('OTP must be exactly 6 digits')
            return false
        }
        if (!/^\d{6}$/.test(formData.otp.trim())) {
            toast.error('OTP must contain only numbers')
            return false
        }
        return true
    }

    const validateStep3 = () => {
        let isValid = true
        if (!adhaarFile) {
            toast.error('Please upload your Aadhaar card')
            isValid = false
        }
        if (!selfieCapture) {
            toast.error('Please take a selfie for verification')
            isValid = false
        }
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
        if (!validateStep1()) {
            const missingFields = []
            if (!formData.name.trim()) missingFields.push('Full Name')
            if (!formData.email.trim()) missingFields.push('Email')
            if (!formData.phone.trim()) missingFields.push('Phone')
            if (!formData.password) missingFields.push('Password')
            if (!formData.confirmPassword) missingFields.push('Confirm Password')

            toast.error(`Please fill in: ${missingFields.join(', ')}`)
            return
        }

        // Format phone number
        let phoneNumber = formData.phone.trim();
        if (!phoneNumber.startsWith('+')) {
            phoneNumber = '+91' + phoneNumber; // Adjust country code
        }

        const result = await sendOTP(phoneNumber);

        if (result.success) {
            toast.success('OTP sent to your phone number!')
            setCurrentStep(2)
        } else {
            toast.error(result.error || 'Failed to send OTP. Please try again.')
        }
    }

    const handleVerifyOTP = async () => {
        if (!validateStep2()) {
            return
        }

        const result = await verifyOTP(formData.phone, formData.otp);

        if (result.success) {
            toast.success('Phone number verified!')
            setCurrentStep(3)
        } else {
            toast.error(result.error || 'Invalid OTP. Please try again.')
        }
    }

    const handleForgotPassword = async () => {
        if (!formData.phone.trim()) {
            toast.error('Please enter your phone number')
            return
        }

        setIsLoading(true)
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500))
            toast.success('Password reset code sent to your phone!')
            setShowForgotPassword(false)
        } catch (error) {
            toast.error('Failed to send reset code. Please try again.')
        }
        setIsLoading(false)
    }

    const handleGoogleAuth = async () => {
        setIsLoading(true)
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000))
            toast.success('Google authentication successful!')
            setCurrentStep(2)
        } catch (error) {
            toast.error('Google authentication failed. Please try again.')
        }
        setIsLoading(false)
    }

    // Camera functions
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user',
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                },
                audio: false
            })

            setCameraStream(stream)
            setShowCamera(true)

            if (videoRef.current) {
                videoRef.current.srcObject = stream
                videoRef.current.onloadedmetadata = () => {
                    if (videoRef.current) {
                        videoRef.current.play()
                        // Simulate face detection after 2 seconds
                        setTimeout(() => setFaceDetected(true), 2000)
                    }
                }
            }
        } catch (error) {
            console.error('Error accessing camera:', error)
            toast.error('Could not access camera. Please allow camera permissions and try again.')
        }
    }

    const stopCamera = () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop())
            setCameraStream(null)
        }
        setShowCamera(false)
        setFaceDetected(false)
    }

    const capturePhoto = () => {
        const canvas = canvasRef.current
        const video = videoRef.current

        if (!canvas || !video || video.videoWidth === 0 || video.readyState !== 4) {
            toast.error('Camera not ready. Please wait a moment and try again.')
            return
        }

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Draw the video frame to canvas
        const ctx = canvas.getContext('2d')
        if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

            // Convert canvas to blob
            canvas.toBlob((blob) => {
                if (blob) {
                    setSelfieCapture(blob)
                    stopCamera()
                    toast.success('Selfie captured successfully!')
                } else {
                    toast.error('Failed to capture photo. Please try again.')
                }
            }, 'image/jpeg', 0.9)
        }
    }

    const retakeSelfie = () => {
        setSelfieCapture(null)
        startCamera()
    }

    const handleAdhaarUpload = (event) => {
        const file = event.target.files?.[0]
        if (file) {
            // Validate file type and size
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload a valid image file')
                return
            }
            if (file.size > 10 * 1024 * 1024) { // 10MB
                toast.error('File size should be less than 10MB')
                return
            }
            setAdhaarFile(file)
            toast.success('Aadhaar uploaded successfully!')
        }
    }

    const handleSubmitDocuments = async () => {
        // FORCE validation before proceeding
        if (!adhaarFile) {
            toast.error('Please upload your Aadhaar card first')
            return // BLOCK progression
        }
        if (!selfieCapture) {
            toast.error('Please take a selfie for verification first')
            return // BLOCK progression
        }

        setIsLoading(true)
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000))
            toast.success('Documents uploaded successfully!')
            setCurrentStep(4) // Only proceed if validation passes
        } catch (error) {
            toast.error('Failed to upload documents. Please try again.')
        }
        setIsLoading(false)
    }

    const progressPercentage = currentStep === 1 ? 25 : currentStep === 2 ? 50 : currentStep === 3 ? 75 : 100

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
                {/* Progress Bar with Step Navigation */}
                <div className="px-6 pt-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-muted-foreground">
                            Step {currentStep} of 4
                        </span>
                        <span className="text-sm font-medium text-primary">
                            {progressPercentage}%
                        </span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />

                    {/* Step Navigation */}
                    {currentStep > 1 && (
                        <div className="flex justify-center mt-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setCurrentStep(currentStep - 1)}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                ← Back to Previous Step
                            </Button>
                        </div>
                    )}
                </div>

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
                                        onClick={handleForgotPassword}
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

                            {!showForgotPassword && (
                                <>
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <Separator className="w-full bg-border" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleGoogleAuth}
                                        disabled={isLoading}
                                        className="w-full bg-white hover:bg-gray-100 disabled:bg-gray-200 disabled:cursor-not-allowed text-black font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                                    >
                                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                            <path
                                                fill="#4285F4"
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            />
                                            <path
                                                fill="#34A853"
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            />
                                            <path
                                                fill="#FBBC05"
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            />
                                            <path
                                                fill="#EA4335"
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            />
                                        </svg>
                                        Continue with Google
                                    </Button>
                                </>
                            )}
                        </CardContent>

                        <CardFooter className="flex flex-col space-y-4">
                            {!showForgotPassword && (
                                <>
                                    <div className="text-center text-sm text-muted-foreground">
                                        Don't have an account?{" "}
                                        <Link href="/sign-up" className="text-primary hover:underline font-medium">
                                            Create account
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

                {/* Step 3: Document Upload */}
                {currentStep === 3 && (
                    <>
                        <CardHeader className="text-center space-y-2">
                            <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                                <FileText className="w-6 h-6 text-primary-foreground" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-foreground">Upload Documents</CardTitle>
                            <CardDescription className="text-muted-foreground">Please upload your Aadhaar and take a selfie</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {/* Aadhaar Upload */}
                            <div className="space-y-3">
                                <Label className="text-sm font-medium">Aadhaar Card</Label>
                                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                                    {!adhaarFile ? (
                                        <div
                                            className="cursor-pointer"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                            <p className="text-sm text-muted-foreground mb-1">Click to upload Aadhaar</p>
                                            <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Check className="w-5 h-5 text-green-500" />
                                                <span className="text-sm text-foreground">{adhaarFile.name}</span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setAdhaarFile(null)}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAdhaarUpload}
                                />
                            </div>

                            <Separator />

                            {/* Selfie Capture */}
                            <div className="space-y-3">
                                <Label className="text-sm font-medium">Live Photo (Selfie)</Label>

                                {!showCamera && !selfieCapture && (
                                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                                        <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                        <p className="text-sm text-muted-foreground mb-3">Take a live selfie for verification</p>
                                        <Button
                                            onClick={startCamera}
                                            className="bg-primary hover:bg-primary/90"
                                        >
                                            <Camera className="w-4 h-4 mr-2" />
                                            Open Camera
                                        </Button>
                                    </div>
                                )}

                                {showCamera && (
                                    <div className="space-y-4">
                                        <div className="relative rounded-lg overflow-hidden bg-black">
                                            <video
                                                ref={videoRef}
                                                autoPlay
                                                playsInline
                                                muted
                                                className="w-full h-64 object-cover"
                                            />
                                            {/* Face detection overlay */}
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <div
                                                    className={`w-48 h-48 border-2 rounded-full transition-colors duration-300 ${faceDetected ? 'border-green-500 shadow-green-500/50 shadow-lg' : 'border-primary'
                                                        }`}
                                                >
                                                    {faceDetected && (
                                                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                                                            <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                                                                Face Detected ✓
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 justify-center">
                                            <Button
                                                onClick={capturePhoto}
                                                className={`transition-colors duration-200 ${faceDetected
                                                    ? 'bg-green-600 hover:bg-green-700'
                                                    : 'bg-primary hover:bg-primary/90'
                                                    }`}
                                                disabled={!cameraStream}
                                            >
                                                <Camera className="w-4 h-4 mr-2" />
                                                {faceDetected ? 'Capture Photo' : 'Capture'}
                                            </Button>
                                            <Button variant="outline" onClick={stopCamera}>
                                                Cancel
                                            </Button>
                                        </div>
                                        {!faceDetected && (
                                            <p className="text-center text-xs text-muted-foreground">
                                                Position your face within the circle
                                            </p>
                                        )}
                                    </div>
                                )}

                                {selfieCapture && (
                                    <div className="space-y-4">
                                        <div className="relative rounded-lg overflow-hidden">
                                            <img
                                                src={URL.createObjectURL(selfieCapture)}
                                                alt="Captured selfie"
                                                className="w-full h-64 object-cover"
                                            />
                                        </div>
                                        <div className="flex gap-3 justify-center">
                                            <Button onClick={() => handleSubmitDocuments()} className="bg-green-600 hover:bg-green-700">
                                                <Check className="w-4 h-4 mr-2" />
                                                Confirm Photo
                                            </Button>
                                            <Button variant="outline" onClick={retakeSelfie}>
                                                <RotateCcw className="w-4 h-4 mr-2" />
                                                Retake
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <canvas ref={canvasRef} className="hidden" />

                            {adhaarFile && selfieCapture && (
                                <Button
                                    onClick={handleSubmitDocuments}
                                    disabled={isLoading}
                                    className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed mt-6"
                                >
                                    {isLoading ? "Processing..." : "Submit Documents"}
                                </Button>
                            )}

                            {(!adhaarFile || !selfieCapture) && (
                                <div className="w-full mt-6 p-3 bg-muted/50 rounded-lg text-center">
                                    <p className="text-sm text-muted-foreground">
                                        {!adhaarFile && !selfieCapture ? 'Upload Aadhaar and take selfie to continue' :
                                            !adhaarFile ? 'Upload Aadhaar to continue' :
                                                'Take selfie to continue'}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </>
                )}

                {/* Step 4: Success */}
                {currentStep === 4 && (
                    <>
                        <CardHeader className="text-center space-y-2">
                            <div className="mx-auto w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
                                <Check className="w-6 h-6 text-white" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-foreground">Welcome, {formData.name}!</CardTitle>
                            <CardDescription className="text-muted-foreground">Your account has been created successfully</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6 text-center">
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    We'll review your documents and notify you once verification is complete. This usually takes 24-48 hours.
                                </p>
                            </div>

                            <Button className="w-full bg-primary hover:bg-primary/90">
                                Continue to Dashboard
                            </Button>
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