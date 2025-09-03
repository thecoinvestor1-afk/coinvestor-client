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
import {
    Users,
    FileCheck,
    TrendingUp,
    Settings,
    Eye,
    EyeOff,
    Check,
    X,
    Clock,
    Upload,
    Edit,
    Save,
    MapPin,
    Hash,
    Mail,
    Phone,
    User,
    Coins,
    Download,
    QrCode,
    Smartphone,
    Building2,
    Copy,
    Search,
    SortAsc,
    SortDesc
} from 'lucide-react';

type DocumentStatus = 'verified' | 'pending' | 'rejected';
type RequestStatus = 'pending' | 'successful' | 'failed';
type UserStatus = 'active' | 'suspended' | 'pending';

type UserData = {
    id: string;
    name: string;
    coinvestorId: string;
    email: string;
    phone: string;
    ipAddress: string;
    documentsStatus: DocumentStatus;
    registrationDate: Date;
    totalCoins: number;
    totalValue: number;
    status: UserStatus;
};

type BuyRequest = {
    id: string;
    userId: string;
    userName: string;
    coinvestorId: string;
    amount: number;
    paymentMethod: string;
    status: RequestStatus;
    requestDate: Date;
    proofDocument?: string;
};

type WithdrawRequest = {
    id: string;
    userId: string;
    userName: string;
    coinvestorId: string;
    amount: number;
    reason?: string;
    status: RequestStatus;
    requestDate: Date;
};

type PaymentMethod = {
    id: string;
    type: 'upi' | 'bank' | 'qr';
    title: string;
    details: Record<string, string>;
    isActive: boolean;
};

export default function AdminComponent() {
    const [activeTab, setActiveTab] = useState('users');
    const [editingPaymentMethod, setEditingPaymentMethod] = useState<string | null>(null);

    // Search states
    const [searchUsers, setSearchUsers] = useState('');
    const [searchDocuments, setSearchDocuments] = useState('');
    const [searchBuyRequests, setSearchBuyRequests] = useState('');
    const [searchWithdrawRequests, setSearchWithdrawRequests] = useState('');
    const [sortRequestsBy, setSortRequestsBy] = useState<'newest' | 'oldest'>('newest');

    // Mock data - replace with API calls
    const [users, setUsers] = useState<UserData[]>([
        {
            id: '1',
            name: 'John Doe',
            coinvestorId: '12345678',
            email: 'john@example.com',
            phone: '+91 98765 43210',
            ipAddress: '192.168.1.100',
            documentsStatus: 'pending',
            registrationDate: new Date('2024-08-01'),
            totalCoins: 2500,
            totalValue: 2625,
            status: 'active'
        },
        {
            id: '2',
            name: 'Jane Smith',
            coinvestorId: '87654321',
            email: 'jane@example.com',
            phone: '+91 98765 43211',
            ipAddress: '192.168.1.101',
            documentsStatus: 'verified',
            registrationDate: new Date('2024-08-05'),
            totalCoins: 5000,
            totalValue: 5250,
            status: 'active'
        }
    ]);

    const [buyRequests, setBuyRequests] = useState<BuyRequest[]>([
        {
            id: '1',
            userId: '1',
            userName: 'John Doe',
            coinvestorId: '12345678',
            amount: 1000,
            paymentMethod: 'UPI',
            status: 'pending',
            requestDate: new Date('2024-09-01'),
            proofDocument: 'payment_proof_1.jpg'
        },
        {
            id: '2',
            userId: '2',
            userName: 'Jane Smith',
            coinvestorId: '87654321',
            amount: 2000,
            paymentMethod: 'Bank Transfer',
            status: 'pending',
            requestDate: new Date('2024-09-02'),
            proofDocument: 'payment_proof_2.jpg'
        }
    ]);

    const [withdrawRequests, setWithdrawRequests] = useState<WithdrawRequest[]>([
        {
            id: '1',
            userId: '1',
            userName: 'John Doe',
            coinvestorId: '12345678',
            amount: 500,
            reason: 'Emergency funds needed',
            status: 'pending',
            requestDate: new Date('2024-09-01')
        }
    ]);

    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
        {
            id: '1',
            type: 'upi',
            title: 'PhonePe UPI',
            details: {
                upiId: 'merchant1@paytm',
                merchantName: 'InvestCoins Pvt Ltd'
            },
            isActive: true
        },
        {
            id: '2',
            type: 'upi',
            title: 'Google Pay UPI',
            details: {
                upiId: 'merchant2@okaxis',
                merchantName: 'InvestCoins Pvt Ltd'
            },
            isActive: true
        },
        {
            id: '3',
            type: 'bank',
            title: 'HDFC Bank Account',
            details: {
                accountName: 'InvestCoins Private Limited',
                accountNumber: '1234567890123456',
                ifscCode: 'HDFC0001234',
                bankName: 'HDFC Bank'
            },
            isActive: true
        }
    ]);

    // Filter functions
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchUsers.toLowerCase()) ||
        user.coinvestorId.includes(searchUsers) ||
        user.phone.includes(searchUsers)
    );

    const filteredDocumentUsers = users.filter(user =>
        user.documentsStatus === 'pending' && (
            user.name.toLowerCase().includes(searchDocuments.toLowerCase()) ||
            user.coinvestorId.includes(searchDocuments) ||
            user.phone.includes(searchDocuments)
        )
    );

    const filteredBuyRequests = buyRequests
        .filter(request =>
            request.status === 'pending' && (
                request.userName.toLowerCase().includes(searchBuyRequests.toLowerCase()) ||
                request.coinvestorId.includes(searchBuyRequests)
            )
        )
        .sort((a, b) => {
            if (sortRequestsBy === 'newest') {
                return b.requestDate.getTime() - a.requestDate.getTime();
            } else {
                return a.requestDate.getTime() - b.requestDate.getTime();
            }
        });

    const filteredWithdrawRequests = withdrawRequests
        .filter(request =>
            request.status === 'pending' && (
                request.userName.toLowerCase().includes(searchWithdrawRequests.toLowerCase()) ||
                request.coinvestorId.includes(searchWithdrawRequests)
            )
        )
        .sort((a, b) => {
            if (sortRequestsBy === 'newest') {
                return b.requestDate.getTime() - a.requestDate.getTime();
            } else {
                return a.requestDate.getTime() - b.requestDate.getTime();
            }
        });

    // Utility functions
    const getStatusColor = (status: DocumentStatus | RequestStatus | UserStatus) => {
        switch (status) {
            case 'successful':
            case 'verified':
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
            case 'rejected':
            case 'suspended':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: DocumentStatus | RequestStatus | UserStatus) => {
        switch (status) {
            case 'successful':
            case 'verified':
            case 'active':
                return <Check className="w-3 h-3 sm:w-4 sm:h-4" />;
            case 'pending':
                return <Clock className="w-3 h-3 sm:w-4 sm:h-4" />;
            case 'failed':
            case 'rejected':
            case 'suspended':
                return <X className="w-3 h-3 sm:w-4 sm:h-4" />;
            default:
                return null;
        }
    };

    const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    // Handler functions
    const handleDocumentStatusUpdate = (userId: string, newStatus: DocumentStatus) => {
        setUsers(users.map(user =>
            user.id === userId ? { ...user, documentsStatus: newStatus } : user
        ));
    };

    const handleBuyRequestStatusUpdate = (requestId: string, newStatus: RequestStatus, coinsToAdd?: number) => {
        setBuyRequests(buyRequests.map(request =>
            request.id === requestId ? { ...request, status: newStatus } : request
        ));

        if (newStatus === 'successful' && coinsToAdd) {
            const request = buyRequests.find(r => r.id === requestId);
            if (request) {
                setUsers(users.map(user =>
                    user.id === request.userId
                        ? { ...user, totalCoins: user.totalCoins + coinsToAdd, totalValue: (user.totalCoins + coinsToAdd) * 1.05 }
                        : user
                ));
            }
        }
    };

    const handleWithdrawRequestStatusUpdate = (requestId: string, newStatus: RequestStatus) => {
        setWithdrawRequests(withdrawRequests.map(request =>
            request.id === requestId ? { ...request, status: newStatus } : request
        ));

        if (newStatus === 'successful') {
            const request = withdrawRequests.find(r => r.id === requestId);
            if (request) {
                setUsers(users.map(user =>
                    user.id === request.userId
                        ? {
                            ...user,
                            totalCoins: Math.max(0, user.totalCoins - request.amount),
                            totalValue: Math.max(0, user.totalValue - request.amount)
                        }
                        : user
                ));
            }
        }
    };

    const handlePaymentMethodUpdate = (methodId: string, newDetails: Record<string, string>) => {
        setPaymentMethods(paymentMethods.map(method =>
            method.id === methodId ? { ...method, details: { ...method.details, ...newDetails } } : method
        ));
        setEditingPaymentMethod(null);
    };


    return (
        <div className="bg-custom bg-fixed bg-cover bg-center bg-no-repeat w-full">
            <div className="min-h-screen container mx-auto">
                {/* Admin Header */}
                <div className="w-full px-3 sm:px-4 lg:px-8 pt-4 sm:pt-6 lg:pt-8">
                    <div className="mb-4 sm:mb-6 lg:mb-8">
                        <div className="text-center sm:text-left">
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">
                                Admin Dashboard
                            </h1>
                            <p className="opacity-70 mt-1 text-sm sm:text-base">
                                Manage users, verify documents, and update payment methods
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <main className="w-full px-3 sm:px-4 lg:px-8 pb-8">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
                        {/* Tab Navigation */}
                        <div className="w-full">
                            <TabsList className="grid grid-cols-2 grid-rows-2 w-full sm:flex sm:w-full h-24 sm:h-12 p-1 gap-1">
                                <TabsTrigger value="users" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4">
                                    <Users className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                    <span className="text-xs sm:text-sm whitespace-nowrap">Users</span>
                                </TabsTrigger>
                                <TabsTrigger value="documents" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4">
                                    <FileCheck className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                    <span className="text-xs sm:text-sm whitespace-nowrap">Documents</span>
                                </TabsTrigger>
                                <TabsTrigger value="requests" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4">
                                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                    <span className="text-xs sm:text-sm whitespace-nowrap">Requests</span>
                                </TabsTrigger>
                                <TabsTrigger value="payments" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4">
                                    <Settings className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                    <span className="text-xs sm:text-sm whitespace-nowrap">Payments</span>
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {/* Users Tab */}
                        <TabsContent value="users" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg sm:text-xl">Users Management</CardTitle>
                                    <CardDescription>View and manage all registered users</CardDescription>
                                    {/* Search Bar */}
                                    <div className="flex items-center gap-2 pt-2">
                                        <div className="relative flex-1">
                                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <Input
                                                placeholder="Search by name, ID, or phone..."
                                                value={searchUsers}
                                                onChange={(e) => setSearchUsers(e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {filteredUsers.map((user) => (
                                            <Card key={user.id} className="p-4 sm:p-6">
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                                        <div className="space-y-2 flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <h3 className="font-semibold text-base sm:text-lg">{user.name}</h3>
                                                                <Badge className={getStatusColor(user.status)}>
                                                                    {getStatusIcon(user.status)}
                                                                    <span className="ml-1 capitalize text-xs">{user.status}</span>
                                                                </Badge>
                                                            </div>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                                                <div className="flex items-center gap-2">
                                                                    <Hash className="w-3 h-3 text-gray-400" />
                                                                    <span className="text-xs text-gray-600">ID: {user.coinvestorId}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Mail className="w-3 h-3 text-gray-400" />
                                                                    <span className="text-xs text-gray-600">{user.email}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Phone className="w-3 h-3 text-gray-400" />
                                                                    <span className="text-xs text-gray-600">{user.phone}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <MapPin className="w-3 h-3 text-gray-400" />
                                                                    <span className="text-xs text-gray-600">{user.ipAddress}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm opacity-60">Registered</p>
                                                            <p className="text-xs">{user.registrationDate.toLocaleDateString()}</p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-3 gap-2 sm:gap-4">
                                                        <div className="text-center p-2 sm:p-3 bg-blue-50 rounded-lg">
                                                            <p className="text-xs text-blue-600 opacity-70">Total Coins</p>
                                                            <p className="font-bold text-sm sm:text-lg text-blue-600">
                                                                {user.totalCoins.toLocaleString()}
                                                            </p>
                                                        </div>
                                                        <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg">
                                                            <p className="text-xs text-green-600 opacity-70">Total Value</p>
                                                            <p className="font-bold text-sm sm:text-lg text-green-600">
                                                                {formatCurrency(user.totalValue)}
                                                            </p>
                                                        </div>
                                                        <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                                                            <p className="text-xs text-gray-600 opacity-70">Documents</p>
                                                            <Badge className={`${getStatusColor(user.documentsStatus)} text-xs`}>
                                                                {getStatusIcon(user.documentsStatus)}
                                                                <span className="ml-1 capitalize">{user.documentsStatus}</span>
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Document Verification Tab */}
                        <TabsContent value="documents" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg sm:text-xl">Document Verification</CardTitle>
                                    <CardDescription>Review and verify user documents</CardDescription>
                                    {/* Search Bar */}
                                    <div className="flex items-center gap-2 pt-2">
                                        <div className="relative flex-1">
                                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <Input
                                                placeholder="Search by name, ID, or phone..."
                                                value={searchDocuments}
                                                onChange={(e) => setSearchDocuments(e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {filteredDocumentUsers.map((user) => (
                                            <Card key={user.id} className="p-4 sm:p-6">
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                        <div>
                                                            <h3 className="font-semibold text-base sm:text-lg">{user.name}</h3>
                                                            <p className="text-sm text-gray-600">Coinvestor ID: {user.coinvestorId}</p>
                                                            <p className="text-sm text-gray-600">{user.email}</p>
                                                        </div>
                                                        <Badge className={getStatusColor(user.documentsStatus)}>
                                                            {getStatusIcon(user.documentsStatus)}
                                                            <span className="ml-1 capitalize text-xs">{user.documentsStatus}</span>
                                                        </Badge>
                                                    </div>

                                                    <div className="p-4 bg-gray-50 rounded-lg">
                                                        <h4 className="font-medium mb-3">Uploaded Documents</h4>
                                                        <div className="flex flex-col sm:flex-row gap-3">
                                                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                                                <Eye className="w-3 h-3" />
                                                                View Aadhar Card
                                                            </Button>
                                                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                                                <Eye className="w-3 h-3" />
                                                                View PAN Card
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row gap-3">
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button className="flex-1 bg-green-600 hover:bg-green-700">
                                                                    <Check className="w-4 h-4 mr-2" />
                                                                    Verify Documents
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent className="mx-4 sm:mx-0 max-w-lg">
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Verify Documents</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Are you sure you want to verify the documents for {user.name}?
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => handleDocumentStatusUpdate(user.id, 'verified')}
                                                                        className="bg-green-600 hover:bg-green-700"
                                                                    >
                                                                        Verify
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>

                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="outline" className="flex-1 border-red-600 text-red-600 hover:bg-red-50">
                                                                    <X className="w-4 h-4 mr-2" />
                                                                    Reject Documents
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent className="mx-4 sm:mx-0 max-w-lg">
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Reject Documents</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Are you sure you want to reject the documents for {user.name}?
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => handleDocumentStatusUpdate(user.id, 'rejected')}
                                                                        className="bg-red-600 hover:bg-red-700"
                                                                    >
                                                                        Reject
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}

                                        {filteredDocumentUsers.length === 0 && (
                                            <div className="text-center py-8">
                                                <FileCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                                <p className="text-gray-600">
                                                    {searchDocuments ? 'No documents found for your search' : 'No pending document verifications'}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Requests Management Tab */}
                        <TabsContent value="requests" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                            <Tabs defaultValue="buy-requests" className="space-y-4 sm:space-y-6">
                                {/* Sub Tab Navigation */}
                                <div className="w-full">
                                    <TabsList className="grid grid-cols-2 w-full sm:w-auto h-12 p-1 gap-1">
                                        <TabsTrigger value="buy-requests" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4">
                                            <Coins className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                            <span className="text-xs sm:text-sm whitespace-nowrap">Buy Requests</span>
                                        </TabsTrigger>
                                        <TabsTrigger value="withdrawal-requests" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4">
                                            <Download className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                            <span className="text-xs sm:text-sm whitespace-nowrap">Withdrawal Requests</span>
                                        </TabsTrigger>
                                    </TabsList>
                                </div>

                                {/* Buy Requests Sub Tab */}
                                <TabsContent value="buy-requests" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg sm:text-xl">Buy Requests</CardTitle>
                                            <CardDescription>Manage coin purchase requests</CardDescription>
                                            {/* Search and Sort Bar */}
                                            <div className="flex flex-col sm:flex-row gap-2 pt-2">
                                                <div className="relative flex-1">
                                                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                    <Input
                                                        placeholder="Search by name or ID..."
                                                        value={searchBuyRequests}
                                                        onChange={(e) => setSearchBuyRequests(e.target.value)}
                                                        className="pl-10"
                                                    />
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setSortRequestsBy(sortRequestsBy === 'newest' ? 'oldest' : 'newest')}
                                                    className="flex items-center gap-2 whitespace-nowrap"
                                                >
                                                    {sortRequestsBy === 'newest' ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
                                                    {sortRequestsBy === 'newest' ? 'Newest First' : 'Oldest First'}
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {filteredBuyRequests.map((request) => (
                                                    <Card key={request.id} className="p-4 sm:p-6">
                                                        <div className="flex flex-col gap-4">
                                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                                <div>
                                                                    <h3 className="font-semibold text-base sm:text-lg">{request.userName}</h3>
                                                                    <p className="text-sm text-gray-600">ID: {request.coinvestorId}</p>
                                                                    <p className="text-sm text-gray-600">
                                                                        {formatCurrency(request.amount)} - {request.paymentMethod}
                                                                    </p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <Badge className={getStatusColor(request.status)}>
                                                                        {getStatusIcon(request.status)}
                                                                        <span className="ml-1 capitalize text-xs">{request.status}</span>
                                                                    </Badge>
                                                                    <p className="text-xs text-gray-500 mt-1">
                                                                        {request.requestDate.toLocaleDateString()}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {request.proofDocument && (
                                                                <div className="p-3 bg-gray-50 rounded-lg">
                                                                    <p className="text-sm font-medium mb-2">Payment Proof</p>
                                                                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                                                                        <Eye className="w-3 h-3" />
                                                                        View {request.proofDocument}
                                                                    </Button>
                                                                </div>
                                                            )}

                                                            <div className="flex flex-col sm:flex-row gap-3">
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger asChild>
                                                                        <Button className="flex-1 bg-green-600 hover:bg-green-700">
                                                                            <Check className="w-4 h-4 mr-2" />
                                                                            Approve & Add Coins
                                                                        </Button>
                                                                    </AlertDialogTrigger>
                                                                    <AlertDialogContent className="mx-4 sm:mx-0 max-w-lg">
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle>Approve Buy Request</AlertDialogTitle>
                                                                            <AlertDialogDescription>
                                                                                This will add {request.amount} coins to {request.userName}'s account.
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                            <AlertDialogAction
                                                                                onClick={() => handleBuyRequestStatusUpdate(request.id, 'successful', request.amount)}
                                                                                className="bg-green-600 hover:bg-green-700"
                                                                            >
                                                                                Approve
                                                                            </AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>

                                                                <AlertDialog>
                                                                    <AlertDialogTrigger asChild>
                                                                        <Button variant="outline" className="flex-1 border-red-600 text-red-600 hover:bg-red-50">
                                                                            <X className="w-4 h-4 mr-2" />
                                                                            Reject Request
                                                                        </Button>
                                                                    </AlertDialogTrigger>
                                                                    <AlertDialogContent className="mx-4 sm:mx-0 max-w-lg">
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle>Reject Buy Request</AlertDialogTitle>
                                                                            <AlertDialogDescription>
                                                                                Are you sure you want to reject this buy request?
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                            <AlertDialogAction
                                                                                onClick={() => handleBuyRequestStatusUpdate(request.id, 'failed')}
                                                                                className="bg-red-600 hover:bg-red-700"
                                                                            >
                                                                                Reject
                                                                            </AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                ))}

                                                {filteredBuyRequests.length === 0 && (
                                                    <div className="text-center py-8">
                                                        <Coins className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                                        <p className="text-gray-600">
                                                            {searchBuyRequests ? 'No buy requests found for your search' : 'No pending buy requests'}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Withdrawal Requests Sub Tab */}
                                <TabsContent value="withdrawal-requests" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg sm:text-xl">Withdrawal Requests</CardTitle>
                                            <CardDescription>Manage withdrawal requests</CardDescription>
                                            {/* Search and Sort Bar */}
                                            <div className="flex flex-col sm:flex-row gap-2 pt-2">
                                                <div className="relative flex-1">
                                                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                    <Input
                                                        placeholder="Search by name or ID..."
                                                        value={searchWithdrawRequests}
                                                        onChange={(e) => setSearchWithdrawRequests(e.target.value)}
                                                        className="pl-10"
                                                    />
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setSortRequestsBy(sortRequestsBy === 'newest' ? 'oldest' : 'newest')}
                                                    className="flex items-center gap-2 whitespace-nowrap"
                                                >
                                                    {sortRequestsBy === 'newest' ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
                                                    {sortRequestsBy === 'newest' ? 'Newest First' : 'Oldest First'}
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {filteredWithdrawRequests.map((request) => (
                                                    <Card key={request.id} className="p-4 sm:p-6">
                                                        <div className="flex flex-col gap-4">
                                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                                <div>
                                                                    <h3 className="font-semibold text-base sm:text-lg">{request.userName}</h3>
                                                                    <p className="text-sm text-gray-600">ID: {request.coinvestorId}</p>
                                                                    <p className="text-sm text-gray-600">
                                                                        Withdrawal: {formatCurrency(request.amount)}
                                                                    </p>
                                                                    {request.reason && (
                                                                        <p className="text-sm text-gray-600">Reason: {request.reason}</p>
                                                                    )}
                                                                </div>
                                                                <div className="text-right">
                                                                    <Badge className={getStatusColor(request.status)}>
                                                                        {getStatusIcon(request.status)}
                                                                        <span className="ml-1 capitalize text-xs">{request.status}</span>
                                                                    </Badge>
                                                                    <p className="text-xs text-gray-500 mt-1">
                                                                        {request.requestDate.toLocaleDateString()}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-col sm:flex-row gap-3">
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger asChild>
                                                                        <Button className="flex-1 bg-green-600 hover:bg-green-700">
                                                                            <Check className="w-4 h-4 mr-2" />
                                                                            Approve Withdrawal
                                                                        </Button>
                                                                    </AlertDialogTrigger>
                                                                    <AlertDialogContent className="mx-4 sm:mx-0 max-w-lg">
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle>Approve Withdrawal</AlertDialogTitle>
                                                                            <AlertDialogDescription>
                                                                                This will deduct {formatCurrency(request.amount)} from {request.userName}'s account.
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                            <AlertDialogAction
                                                                                onClick={() => handleWithdrawRequestStatusUpdate(request.id, 'successful')}
                                                                                className="bg-green-600 hover:bg-green-700"
                                                                            >
                                                                                Approve
                                                                            </AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>

                                                                <AlertDialog>
                                                                    <AlertDialogTrigger asChild>
                                                                        <Button variant="outline" className="flex-1 border-red-600 text-red-600 hover:bg-red-50">
                                                                            <X className="w-4 h-4 mr-2" />
                                                                            Reject Withdrawal
                                                                        </Button>
                                                                    </AlertDialogTrigger>
                                                                    <AlertDialogContent className="mx-4 sm:mx-0 max-w-lg">
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle>Reject Withdrawal</AlertDialogTitle>
                                                                            <AlertDialogDescription>
                                                                                Are you sure you want to reject this withdrawal request?
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                            <AlertDialogAction
                                                                                onClick={() => handleWithdrawRequestStatusUpdate(request.id, 'failed')}
                                                                                className="bg-red-600 hover:bg-red-700"
                                                                            >
                                                                                Reject
                                                                            </AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                ))}

                                                {filteredWithdrawRequests.length === 0 && (
                                                    <div className="text-center py-8">
                                                        <Download className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                                        <p className="text-gray-600">
                                                            {searchWithdrawRequests ? 'No withdrawal requests found for your search' : 'No pending withdrawal requests'}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </TabsContent>

                        {/* Payment Methods Tab */}
                        <TabsContent value="payments" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg sm:text-xl">Payment Methods Configuration</CardTitle>
                                    <CardDescription>Update payment method details and QR codes</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {paymentMethods.map((method) => (
                                            <Card key={method.id} className="p-4 sm:p-6">
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                        <div className="flex items-center gap-3">
                                                            {method.type === 'upi' && <Smartphone className="w-5 h-5 text-blue-600" />}
                                                            {method.type === 'bank' && <Building2 className="w-5 h-5 text-blue-600" />}
                                                            {method.type === 'qr' && <QrCode className="w-5 h-5 text-blue-600" />}
                                                            <div>
                                                                <h3 className="font-semibold text-base sm:text-lg">{method.title}</h3>
                                                                <p className="text-sm text-gray-600 capitalize">{method.type} Payment</p>
                                                            </div>
                                                        </div>
                                                        <Badge className={method.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                                            {method.isActive ? 'Active' : 'Inactive'}
                                                        </Badge>
                                                    </div>

                                                    {editingPaymentMethod === method.id ? (
                                                        <div className="space-y-4">
                                                            {method.type === 'upi' && (
                                                                <div className="space-y-3">
                                                                    <div className="space-y-2">
                                                                        <Label htmlFor={`upiId-${method.id}`}>UPI ID</Label>
                                                                        <Input
                                                                            id={`upiId-${method.id}`}
                                                                            defaultValue={method.details.upiId}
                                                                            placeholder="merchant@paytm"
                                                                        />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <Label htmlFor={`merchantName-${method.id}`}>Merchant Name</Label>
                                                                        <Input
                                                                            id={`merchantName-${method.id}`}
                                                                            defaultValue={method.details.merchantName}
                                                                            placeholder="InvestCoins Pvt Ltd"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {method.type === 'bank' && (
                                                                <div className="space-y-3">
                                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                                        <div className="space-y-2">
                                                                            <Label htmlFor={`accountName-${method.id}`}>Account Name</Label>
                                                                            <Input
                                                                                id={`accountName-${method.id}`}
                                                                                defaultValue={method.details.accountName}
                                                                                placeholder="InvestCoins Private Limited"
                                                                            />
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            <Label htmlFor={`accountNumber-${method.id}`}>Account Number</Label>
                                                                            <Input
                                                                                id={`accountNumber-${method.id}`}
                                                                                defaultValue={method.details.accountNumber}
                                                                                placeholder="1234567890123456"
                                                                            />
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            <Label htmlFor={`ifscCode-${method.id}`}>IFSC Code</Label>
                                                                            <Input
                                                                                id={`ifscCode-${method.id}`}
                                                                                defaultValue={method.details.ifscCode}
                                                                                placeholder="HDFC0001234"
                                                                            />
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            <Label htmlFor={`bankName-${method.id}`}>Bank Name</Label>
                                                                            <Input
                                                                                id={`bankName-${method.id}`}
                                                                                defaultValue={method.details.bankName}
                                                                                placeholder="HDFC Bank"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {method.type === 'qr' && (
                                                                <div className="space-y-3">
                                                                    <div className="space-y-2">
                                                                        <Label>QR Code Image</Label>
                                                                        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                                                                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                                            <p className="text-sm text-gray-600 mb-2">Upload new QR code</p>
                                                                            <input
                                                                                type="file"
                                                                                accept="image/*"
                                                                                className="hidden"
                                                                                id={`qr-upload-${method.id}`}
                                                                            />
                                                                            <Label htmlFor={`qr-upload-${method.id}`}>
                                                                                <Button variant="outline" size="sm" asChild>
                                                                                    <span className="cursor-pointer">Choose File</span>
                                                                                </Button>
                                                                            </Label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            <div className="flex flex-col sm:flex-row gap-3 pt-3">
                                                                <Button
                                                                    className="flex-1 bg-primary"
                                                                    onClick={() => {
                                                                        handlePaymentMethodUpdate(method.id, {});
                                                                    }}
                                                                >
                                                                    <Save className="w-4 h-4 mr-2" />
                                                                    Save Changes
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    className="flex-1"
                                                                    onClick={() => setEditingPaymentMethod(null)}
                                                                >
                                                                    Cancel
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-4">
                                                            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                                                                {method.type === 'upi' && (
                                                                    <div className="space-y-2">
                                                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                                                            <span className="text-sm font-medium">UPI ID:</span>
                                                                            <div className="flex items-center gap-2">
                                                                                <code className="bg-white px-2 py-1 rounded text-sm">
                                                                                    {method.details.upiId}
                                                                                </code>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    className="h-8 w-8 p-0"
                                                                                    onClick={() => copyToClipboard(method.details.upiId)}
                                                                                >
                                                                                    <Copy className="w-3 h-3" />
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                                                            <span className="text-sm font-medium">Merchant:</span>
                                                                            <span className="text-sm">{method.details.merchantName}</span>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {method.type === 'bank' && (
                                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                                                        <div>
                                                                            <span className="font-medium text-gray-600">Account Name:</span>
                                                                            <p className="font-medium">{method.details.accountName}</p>
                                                                        </div>
                                                                        <div>
                                                                            <span className="font-medium text-gray-600">Account Number:</span>
                                                                            <p className="font-medium">{method.details.accountNumber}</p>
                                                                        </div>
                                                                        <div>
                                                                            <span className="font-medium text-gray-600">IFSC Code:</span>
                                                                            <p className="font-medium">{method.details.ifscCode}</p>
                                                                        </div>
                                                                        <div>
                                                                            <span className="font-medium text-gray-600">Bank Name:</span>
                                                                            <p className="font-medium">{method.details.bankName}</p>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {method.type === 'qr' && (
                                                                    <div className="text-center">
                                                                        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-3">
                                                                            <QrCode className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                                                                        </div>
                                                                        <p className="text-sm text-gray-600">Current QR Code</p>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <Button
                                                                variant="outline"
                                                                className="w-full sm:w-auto"
                                                                onClick={() => setEditingPaymentMethod(method.id)}
                                                            >
                                                                <Edit className="w-4 h-4 mr-2" />
                                                                Edit Details
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </main>
            </div>
        </div>
    );
};