"use client"

import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import {
    Bell,
    Coins,
    TrendingUp,
    Timer,
    Download,
    Upload,
    User,
    Smartphone,
    Building2,
    MessageCircle,
    Eye,
    EyeOff,
    Check,
    X,
    Clock,
    QrCode,
    Copy,
    FileText,
    Wallet
} from 'lucide-react';
import Image from '@/components/ui/image';

import whatsapplogo from '@images/other/whatsapp.png'

type PaymentStatus = 'pending' | 'successful' | 'failed';
type VerificationStatus = 'verified' | 'not-verified' | 'pending';

type Investment = {
    id: string;
    amount: number;
    startDate: Date;
    daysLeft: number;
    currentValue: number;
    projectedValue: number;
    status: PaymentStatus;
};

type UserProfile = {
    name: string;
    email: string;
    phone: string;
    emailVerified: VerificationStatus;
    documentsVerified: VerificationStatus;
    totalCoins: number;
    totalValue: number;
};

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [coinAmount, setCoinAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [paymentStep, setPaymentStep] = useState(1);
    const [showBalance, setShowBalance] = useState(false);
    const [withdrawalAmount, setWithdrawalAmount] = useState('');
    const [withdrawalReason, setWithdrawalReason] = useState('');

    // Mock data - replace with API calls
    const [userProfile, setUserProfile] = useState<UserProfile>({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+91 98765 43210',
        emailVerified: 'verified',
        documentsVerified: 'pending',
        totalCoins: 2500,
        totalValue: 2625
    });

    const [investments, setInvestments] = useState<Investment[]>([
        {
            id: '1',
            amount: 1000,
            startDate: new Date('2024-08-01'),
            daysLeft: 45,
            currentValue: 1025,
            projectedValue: 1050,
            status: 'successful'
        },
        {
            id: '2',
            amount: 1500,
            startDate: new Date('2024-08-15'),
            daysLeft: 59,
            currentValue: 1537.5,
            projectedValue: 1575,
            status: 'successful'
        }
    ]);

    // Timer logic for active investments
    const [timeLeft, setTimeLeft] = useState({ days: 45, hours: 12, minutes: 30 });

    useEffect(() => {
        const timer = setInterval(() => {
            // Update timer logic here
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // API handler functions (empty for now)
    const handleBuyCoins = async () => {
        toast.success("Coins purchase initiated!");
    };

    const handleUploadProof = async () => {
        toast.success("Payment proof uploaded successfully! We'll verify it within 24 hours.");
        setPaymentStep(1);
        setCoinAmount('');
        setPaymentMethod('');
    };

    const handleWithdrawalRequest = async () => {
        toast.success("Withdrawal request submitted for admin approval!");
        setWithdrawalAmount('');
        setWithdrawalReason('');
    };

    const handleProfileUpdate = async () => {
        toast.success("Profile updated successfully!");
    };

    const handleEmailVerification = async () => {
        toast.info("Verification OTP sent to your email!");
    };

    const handleDocumentUpload = async () => {
        toast.success("Documents uploaded successfully! Verification may take 2-3 business days.");
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    };

    const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`;

    const getStatusColor = (status: PaymentStatus | VerificationStatus) => {
        switch (status) {
            case 'successful':
            case 'verified':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
            case 'not-verified':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: PaymentStatus | VerificationStatus) => {
        switch (status) {
            case 'successful':
            case 'verified':
                return <Check className="w-4 h-4" />;
            case 'pending':
                return <Clock className="w-4 h-4" />;
            case 'failed':
            case 'not-verified':
                return <X className="w-4 h-4" />;
            default:
                return null;
        }
    };

    const PaymentMethodCard = ({ method, icon: Icon, title, description, onSelect }: any) => (
        <Card
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${paymentMethod === method ? 'ring-2 ring-primary border-primary' : ''
                }`}
            onClick={() => setPaymentMethod(method)}
        >
            <CardContent className="flex items-center gap-4 p-4 sm:p-6">
                <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold opacity-90 text-sm sm:text-base">{title}</h3>
                    <p className="text-xs sm:text-sm opacity-60 truncate">{description}</p>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="bg-custom bg-fixed bg-cover bg-center bg-no-repeat w-full">
            <div className="min-h-screen container mx-auto">
                {/* Dashboard Header with Timer and Stats */}
                <div className="w-full px-3 sm:px-4 lg:px-8 pt-4 sm:pt-6 lg:pt-8">
                    <div className="mb-4 sm:mb-6 lg:mb-8">
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 sm:gap-6">
                            {/* Welcome Section */}
                            <div className="text-center sm:text-left lg:flex-1">
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">
                                    Welcome back, {userProfile.name}!
                                </h1>
                                <p className="opacity-70 mt-1 text-sm sm:text-base">
                                    Manage your investments and track your earnings
                                </p>
                            </div>

                            {/* Timer and Quick Stats */}
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:flex gap-3 sm:gap-4 lg:gap-4 lg:flex-shrink-0">
                                {/* Investment Timer */}
                                <Card className="p-4 sm:p-5 lg:min-w-[200px] xl:min-w-[220px]">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                                            <Timer className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs sm:text-sm text-gray-600 mb-1">Next Maturity</p>
                                            <p className="text-base sm:text-lg lg:text-xl font-bold text-primary">
                                                {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
                                            </p>
                                        </div>
                                    </div>
                                </Card>

                                {/* Current Balance */}
                                <Card className="p-4 sm:p-5 lg:min-w-[200px] xl:min-w-[220px]">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-green-100 flex-shrink-0">
                                            <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Balance</p>
                                            <div className="flex items-center gap-2">
                                                <p className="text-base sm:text-lg lg:text-xl font-bold text-green-600 truncate">
                                                    {showBalance ? formatCurrency(userProfile.totalValue) : '****'}
                                                </p>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 w-7 p-0 flex-shrink-0 hover:bg-gray-100"
                                                    onClick={() => setShowBalance(!showBalance)}
                                                >
                                                    {showBalance ?
                                                        <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" /> :
                                                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                                                    }
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <main className="w-full px-3 sm:px-4 lg:px-8 pb-8">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
                        {/* Tab Navigation - 2 Row Layout */}
                        <div className="w-full">
                            <TabsList className="grid grid-cols-3 grid-rows-2 w-full sm:flex sm:w-full h-24 sm:h-12 p-1 gap-1">
                                <TabsTrigger value="overview" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4">
                                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                    <span className="text-xs sm:text-sm whitespace-nowrap">Overview</span>
                                </TabsTrigger>
                                <TabsTrigger value="buy" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4">
                                    <Coins className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                    <span className="text-xs sm:text-sm whitespace-nowrap">Buy</span>
                                </TabsTrigger>
                                <TabsTrigger value="investments" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4">
                                    <Wallet className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                    <span className="text-xs sm:text-sm whitespace-nowrap">Invest</span>
                                </TabsTrigger>
                                <TabsTrigger value="withdrawal" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4">
                                    <Download className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                    <span className="text-xs sm:text-sm whitespace-nowrap">Withdraw</span>
                                </TabsTrigger>
                                <TabsTrigger value="profile" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 col-start-2">
                                    <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                    <span className="text-xs sm:text-sm whitespace-nowrap">Profile</span>
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {/* Overview Tab */}
                        <TabsContent value="overview" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <div>
                                            <CardTitle className="text-sm font-medium">Total Coins</CardTitle>
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className="text-xl sm:text-2xl font-bold">{userProfile.totalCoins.toLocaleString()}</div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0"
                                                    onClick={() => setShowBalance(!showBalance)}
                                                >
                                                    {showBalance ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                                </Button>
                                            </div>
                                            <p className="text-sm opacity-60">
                                                {showBalance ? formatCurrency(userProfile.totalValue) : '****'}
                                            </p>
                                        </div>
                                        <div>
                                            <Coins className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                                        </div>
                                    </CardHeader>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <div>
                                            <CardTitle className="text-sm font-medium">Active Investments</CardTitle>
                                            <div className="text-xl sm:text-2xl font-bold mt-2">{investments.length}</div>
                                            <p className="text-xs text-green-600">+5% expected returns</p>
                                        </div>
                                        <div>
                                            <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                                        </div>
                                    </CardHeader>
                                </Card>

                                <Card className="sm:col-span-2 lg:col-span-1">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <div>
                                            <CardTitle className="text-sm font-medium">Days Remaining</CardTitle>
                                            <div className="text-xl sm:text-2xl font-bold mt-2">{timeLeft.days}</div>
                                            <p className="text-xs text-orange-600">Next maturity</p>
                                        </div>
                                        <div>
                                            <Timer className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
                                        </div>
                                    </CardHeader>
                                </Card>
                            </div>

                            {/* Recent Investments */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg sm:text-xl">Recent Investments</CardTitle>
                                    <CardDescription>Your latest investment activities</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 sm:space-y-4">
                                        {investments.map((investment) => (
                                            <div key={investment.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 border rounded-lg">
                                                <div className="flex items-center gap-3 sm:gap-4">
                                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                                        <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-medium text-sm sm:text-base">{investment.amount} Coins</p>
                                                        <p className="text-xs sm:text-sm text-gray-600">{investment.daysLeft} days remaining</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between sm:justify-end sm:text-right gap-4">
                                                    <div>
                                                        <p className="font-semibold text-sm sm:text-base">{formatCurrency(investment.currentValue)}</p>
                                                    </div>
                                                    <Badge className={`${getStatusColor(investment.status)} text-xs`}>
                                                        {getStatusIcon(investment.status)}
                                                        <span className="ml-1 capitalize">{investment.status}</span>
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Buy Coins Tab */}
                        <TabsContent value="buy" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                            {paymentStep === 1 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg sm:text-xl">Buy Coins</CardTitle>
                                        <CardDescription>Enter the amount of coins you want to purchase (Minimum: 100 coins)</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4 sm:space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="coinAmount">Number of Coins</Label>
                                            <Input
                                                id="coinAmount"
                                                type="number"
                                                placeholder="100"
                                                value={coinAmount}
                                                onChange={(e) => setCoinAmount(e.target.value)}
                                                min="100"
                                                className="placeholder:opacity-60 placeholder-shown:placeholder:opacity-60"
                                            />
                                            {coinAmount && parseInt(coinAmount) >= 100 && (
                                                <div className="p-3 sm:p-4 bg-primary rounded-lg">
                                                    <div className="space-y-2 text-sm sm:text-base">
                                                        <div className="flex justify-between items-center">
                                                            <span>Investment Amount:</span>
                                                            <span className="font-semibold">{formatCurrency(parseInt(coinAmount))}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span>Expected Returns (5%):</span>
                                                            <span className="font-semibold text-green-600">
                                                                {formatCurrency(parseInt(coinAmount) * 1.05)}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between items-center mt-2 pt-2 border-t">
                                                            <span className="font-medium">Maturity (90 days):</span>
                                                            <span className="font-bold text-green-600">
                                                                {formatCurrency(parseInt(coinAmount) * 1.05)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button
                                            className="w-full bg-primary"
                                            onClick={() => setPaymentStep(2)}
                                            disabled={!coinAmount || parseInt(coinAmount) < 100}
                                        >
                                            Continue to Payment
                                        </Button>
                                    </CardFooter>
                                </Card>
                            )}

                            {paymentStep === 2 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg sm:text-xl">Select Payment Method</CardTitle>
                                        <CardDescription>Choose your preferred payment method</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3 sm:space-y-4">
                                        <PaymentMethodCard
                                            method="qr"
                                            icon={QrCode}
                                            title="QR Code"
                                            description="Scan and pay using any UPI app"
                                            onSelect={() => setPaymentMethod('qr')}
                                        />
                                        <PaymentMethodCard
                                            method="upi"
                                            icon={Smartphone}
                                            title="UPI"
                                            description="Pay directly using UPI ID"
                                            onSelect={() => setPaymentMethod('upi')}
                                        />
                                        <PaymentMethodCard
                                            method="bank"
                                            icon={Building2}
                                            title="Bank Transfer"
                                            description="Transfer to our bank account"
                                            onSelect={() => setPaymentMethod('bank')}
                                        />
                                    </CardContent>
                                    <CardFooter className="flex gap-3">
                                        <Button variant="outline" onClick={() => setPaymentStep(1)} className="flex-1">
                                            Back
                                        </Button>
                                        <Button
                                            className="flex-1 bg-primary"
                                            onClick={() => setPaymentStep(3)}
                                            disabled={!paymentMethod}
                                        >
                                            Continue
                                        </Button>
                                    </CardFooter>
                                </Card>
                            )}

                            {paymentStep === 3 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg sm:text-xl">Complete Payment</CardTitle>
                                        <CardDescription>
                                            {paymentMethod === 'qr' && 'Scan the QR code to complete payment'}
                                            {paymentMethod === 'upi' && 'Use the UPI ID to complete payment'}
                                            {paymentMethod === 'bank' && 'Transfer to the bank account details below'}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4 sm:space-y-6">
                                        {paymentMethod === 'qr' && (
                                            <div className="text-center space-y-4">
                                                <div className="w-32 h-32 sm:w-48 sm:h-48 bg-gray-200 rounded-lg flex items-center justify-center mx-auto">
                                                    <QrCode className="w-16 h-16 sm:w-24 sm:h-24 text-gray-400" />
                                                </div>
                                                <div className="space-y-2 text-sm sm:text-base">
                                                    <p className="font-medium">QR Code 1: PhonePe</p>
                                                    <p className="font-medium">QR Code 2: Google Pay</p>
                                                </div>
                                            </div>
                                        )}

                                        {paymentMethod === 'upi' && (
                                            <div className="space-y-4">
                                                <div className="p-3 sm:p-4 bg-gray-50 rounded-lg space-y-3">
                                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                                        <span className="text-sm sm:text-base">UPI ID 1:</span>
                                                        <div className="flex items-center gap-2">
                                                            <code className="bg-white px-2 py-1 rounded text-xs sm:text-sm">merchant1@paytm</code>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0"
                                                                onClick={() => copyToClipboard('merchant1@paytm')}
                                                            >
                                                                <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                                        <span className="text-sm sm:text-base">UPI ID 2:</span>
                                                        <div className="flex items-center gap-2">
                                                            <code className="bg-white px-2 py-1 rounded text-xs sm:text-sm">merchant2@okaxis</code>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0"
                                                                onClick={() => copyToClipboard('merchant2@okaxis')}
                                                            >
                                                                <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {paymentMethod === 'bank' && (
                                            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg space-y-3">
                                                <h4 className="font-medium mb-3 text-sm sm:text-base">Bank Account Details</h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                                                    <div>
                                                        <span className="text-gray-600">Account Name:</span>
                                                        <p className="font-medium">InvestCoins Private Limited</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-600">Account Number:</span>
                                                        <p className="font-medium">1234567890123456</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-600">IFSC Code:</span>
                                                        <p className="font-medium">HDFC0001234</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-600">Bank Name:</span>
                                                        <p className="font-medium">HDFC Bank</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-4">
                                            <div className="p-3 sm:p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                                                <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-2" />
                                                <p className="text-xs sm:text-sm text-gray-600 mb-2">Upload Payment Proof</p>
                                                <input
                                                    type="file"
                                                    accept="image/*,.pdf"
                                                    className="hidden"
                                                    id="payment-proof"
                                                    onChange={(e) => {
                                                        if (e.target.files?.[0]) {
                                                            toast.success(`File "${e.target.files[0].name}" selected`);
                                                        }
                                                    }}
                                                />
                                                <Label htmlFor="payment-proof">
                                                    <Button variant="outline" size="sm" asChild>
                                                        <span className="cursor-pointer text-xs sm:text-sm">Choose File</span>
                                                    </Button>
                                                </Label>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xs sm:text-sm text-gray-600">Amount: {formatCurrency(parseInt(coinAmount || '0'))}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex gap-3">
                                        <Button variant="outline" onClick={() => setPaymentStep(2)} className="flex-1">
                                            Back
                                        </Button>
                                        <Button className="flex-1 bg-primary" onClick={handleUploadProof}>
                                            Submit Payment Proof
                                        </Button>
                                    </CardFooter>
                                </Card>
                            )}
                        </TabsContent>

                        {/* Investments Tab */}
                        <TabsContent value="investments" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg sm:text-xl">My Investments</CardTitle>
                                    <CardDescription>Track your investment performance and earnings</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4 sm:space-y-6">
                                        {investments.map((investment) => (
                                            <Card key={investment.id} className="p-4 sm:p-6">
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2">
                                                                <Badge className={getStatusColor(investment.status)}>
                                                                    {getStatusIcon(investment.status)}
                                                                    <span className="ml-1 capitalize text-xs">{investment.status}</span>
                                                                </Badge>
                                                                <span className="text-xs sm:text-sm text-gray-600">
                                                                    ID: #{investment.id}
                                                                </span>
                                                            </div>
                                                            <h3 className="font-semibold text-base sm:text-lg">{investment.amount} Coins Investment</h3>
                                                            <p className="text-xs sm:text-sm text-gray-600">
                                                                Started: {investment.startDate.toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-3 gap-2 sm:gap-4">
                                                        <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                                                            <p className="text-xs text-gray-600">Days Left</p>
                                                            <p className="font-bold text-sm sm:text-lg">{investment.daysLeft}</p>
                                                        </div>
                                                        <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg">
                                                            <p className="text-xs text-gray-600">Current Value</p>
                                                            <p className="font-bold text-sm sm:text-lg text-green-600">
                                                                {formatCurrency(investment.currentValue)}
                                                            </p>
                                                        </div>
                                                        <div className="text-center p-2 sm:p-3 bg-blue-50 rounded-lg">
                                                            <p className="text-xs text-gray-600">Projected Returns</p>
                                                            <p className="font-bold text-sm sm:text-lg text-primary">
                                                                {formatCurrency(investment.projectedValue)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                                                style={{ width: `${((90 - investment.daysLeft) / 90) * 100}%` }}
                                                            />
                                                        </div>
                                                        <div className="flex justify-between text-xs text-gray-600">
                                                            <span>Progress</span>
                                                            <span>{Math.round(((90 - investment.daysLeft) / 90) * 100)}% complete</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Withdrawal Tab */}
                        <TabsContent value="withdrawal" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg sm:text-xl">Request Withdrawal</CardTitle>
                                    <CardDescription>Submit a withdrawal request for admin approval</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 sm:space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="withdrawalAmount">Withdrawal Amount</Label>
                                        <Input
                                            id="withdrawalAmount"
                                            type="number"
                                            placeholder="Enter amount"
                                            value={withdrawalAmount}
                                            onChange={(e) => setWithdrawalAmount(e.target.value)}
                                        />
                                        <p className="text-xs sm:text-sm opacity-60">
                                            Available balance: {formatCurrency(userProfile.totalValue)}
                                        </p>
                                    </div>

                                    <div className="p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <h4 className="font-medium text-yellow-800 mb-2 text-sm sm:text-base">Important Notice</h4>
                                        <ul className="text-xs sm:text-sm text-yellow-700 space-y-1">
                                            <li>• Minimum withdrawal amount: {formatCurrency(100)}</li>
                                            <li>• Withdrawal requests require admin approval</li>
                                            <li>• Processing time: 3-5 business days</li>
                                        </ul>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                className="w-full bg-primary"
                                                disabled={!withdrawalAmount || parseInt(withdrawalAmount || '0') < 100}
                                            >
                                                Submit Withdrawal Request
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="mx-4 sm:mx-0 max-w-lg">
                                            <AlertDialogHeader>
                                                <AlertDialogTitle className="text-base sm:text-lg">Confirm Withdrawal Request</AlertDialogTitle>
                                                <AlertDialogDescription className="text-sm">
                                                    Are you sure you want to request withdrawal of {formatCurrency(parseInt(withdrawalAmount || '0'))}?
                                                    This action will be sent for admin approval.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                                                <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={handleWithdrawalRequest} className="w-full sm:w-auto">
                                                    Confirm Request
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        {/* Profile Tab */}
                        <TabsContent value="profile" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                {/* Profile Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg sm:text-xl">Profile Information</CardTitle>
                                        <CardDescription>Update your personal details</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <div className="p-3 bg-secondary rounded-md border">
                                                <p className="text-sm font-semibold text-black">{userProfile.name}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <div className="flex flex-col sm:flex-row gap-2">
                                                <div className="p-3 bg-secondary rounded-md border flex-1">
                                                    <p className="text-sm font-semibold text-black">{userProfile.email}</p>
                                                </div>
                                                <Badge className={`${getStatusColor(userProfile.emailVerified)} self-start whitespace-nowrap`}>
                                                    {getStatusIcon(userProfile.emailVerified)}
                                                    <span className="ml-1 capitalize text-xs">{userProfile.emailVerified}</span>
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <div className="p-3 bg-secondary rounded-md border">
                                                <p className="text-sm font-semibold text-black">{userProfile.phone}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Document Verification */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg sm:text-xl">Document Verification</CardTitle>
                                        <CardDescription>Upload and verify your documents</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-3 sm:p-4 border rounded-lg">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                                                    <div className="min-w-0">
                                                        <p className="font-medium text-sm sm:text-base">Identity Proof</p>
                                                        <p className="text-xs sm:text-sm text-gray-600 truncate">Aadhar, PAN, or Passport</p>
                                                    </div>
                                                </div>
                                                <Badge className={`${getStatusColor(userProfile.documentsVerified)} flex-shrink-0`}>
                                                    {getStatusIcon(userProfile.documentsVerified)}
                                                    <span className="ml-1 capitalize text-xs">{userProfile.documentsVerified}</span>
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </main>

                {/* WhatsApp Support Widget */}
                <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
                    <Button
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full p-0 bg-transparent hover:bg-green-50 shadow-lg overflow-hidden"
                        onClick={() => window.open('https://wa.me/your-whatsapp-number', '_blank')}
                    >
                        <Image
                            src={whatsapplogo}
                            alt="WhatsApp"
                            width={48}
                            height={48}
                            className="w-full h-full object-cover rounded-full"
                        />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;