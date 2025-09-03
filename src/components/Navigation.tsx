'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ArrowRight, Coins, LogOut, User, Settings } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

interface User {
    id: string
    name: string
    email: string
    photoUrl?: string
    phoneNumberVerified: boolean
    redirectUrl?: string
}

interface Session {
    user: User
    session: {
        id: string
        token: string
        expiresAt: string
        userId: string
    }
}

export default function Navigation() {
    const {
        data: session,
        isPending,
        error,
    } = authClient.useSession() as {
        data: Session | null
        isPending: boolean
        error: Error | null
    }

    const handleLogout = async (): Promise<void> => {
        try {
            await authClient.signOut()
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    const getUserInitials = (name: string): string => {
        if (!name || typeof name !== 'string') return 'U'

        return name
            .split(' ')
            .map(part => part.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2) || 'U'
    }

    return (
        <header className="relative z-10 border-b border-border/50 backdrop-blur-sm bg-background/80">
            <div className="container mx-auto px-4 py-4">
                <nav className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <Coins className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold text-foreground">CoinVest</span>
                    </Link>

                    <div className="flex items-center space-x-3">
                        {isPending ? (
                            <div className="flex items-center space-x-2">
                                <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
                                <div className="h-8 w-8 bg-muted animate-pulse rounded-full"></div>
                            </div>
                        ) : session?.user ? (
                            <div className="flex items-center space-x-3">
                                <Link href="/dashboard">
                                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                                        Dashboard
                                    </Button>
                                </Link>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage
                                                    src={session.user.photoUrl || ''}
                                                    alt={session.user.name || 'User'}
                                                />
                                                <AvatarFallback className="text-xs">
                                                    {getUserInitials(session.user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="end" forceMount>
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    {session.user.name || 'User'}
                                                </p>
                                                <p className="text-xs leading-none text-muted-foreground">
                                                    {session.user.email || ''}
                                                </p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {/* <DropdownMenuItem asChild>
                                            <Link href="/profile" className="flex items-center">
                                                <User className="mr-2 h-4 w-4" />
                                                Profile
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/settings" className="flex items-center">
                                                <Settings className="mr-2 h-4 w-4" />
                                                Settings
                                            </Link>
                                        </DropdownMenuItem> */}
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="text-red-600 focus:text-red-600 cursor-pointer"
                                            onClick={handleLogout}
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Log out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ) : (
                            <>
                                <Link href="/sign-in">
                                    <Button variant="ghost" size="sm">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/sign-up">
                                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                                        Get Started
                                    </Button>
                                </Link>
                            </>
                        )}

                        {error && (
                            <div className="text-sm text-red-500">
                                Session error occurred
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    )
}