
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Added usePathname
import { Car, LogIn, LogOut, UserCircle, UserPlus, CalendarCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const Header = () => {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const pathname = usePathname(); // Get current pathname

  const UserAvatar = () => (
    <Avatar className="h-8 w-8">
      {/* In a real app, user.avatarUrl would be used if available */}
      {/* <AvatarImage src={user?.avatarUrl} alt={user?.name || 'User'} /> */}
      <AvatarFallback className="bg-primary text-primary-foreground">
        {user?.name ? user.name.charAt(0).toUpperCase() : <UserCircle size={20} />}
      </AvatarFallback>
    </Avatar>
  );

  const showBrowseVehiclesLink = !['/login', '/register'].includes(pathname);

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
          <Car className="h-8 w-8" />
          <span className="font-headline text-3xl font-bold">Vehicle-Rental-APP</span>
        </Link>
        <nav>
          <ul className="flex items-center space-x-4 md:space-x-6">
            {showBrowseVehiclesLink && (
              <li>
                <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium">
                  Browse Vehicles
                </Link>
              </li>
            )}
            {isLoading ? (
              <>
                <li><Skeleton className="h-8 w-20" /></li>
                <li><Skeleton className="h-8 w-24" /></li>
              </>
            ) : isAuthenticated && user ? (
              <li> {/* Added li wrapper for consistency and future complex items */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-auto py-1 px-2">
                      <UserAvatar />
                      <span className="ml-2 hidden md:inline">{user.name || user.email}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/my-bookings">
                        <CalendarCheck className="mr-2 h-4 w-4" />
                        My Bookings
                      </Link>
                    </DropdownMenuItem>
                    {/* Add profile/settings links here if needed */}
                    {/* <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <UserCircle className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem> */}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            ) : (
              <>
                {!showBrowseVehiclesLink && pathname === '/login' && ( // Show Sign Up on Login page
                  <li>
                    <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                      <Link href="/register">
                        <UserPlus className="mr-0 md:mr-2 h-4 w-4" /> <span className="hidden md:inline">Sign Up</span>
                      </Link>
                    </Button>
                  </li>
                )}
                {!showBrowseVehiclesLink && pathname === '/register' && ( // Show Sign In on Register page
                  <li>
                    <Button variant="outline" asChild>
                      <Link href="/login">
                        <LogIn className="mr-0 md:mr-2 h-4 w-4" /> <span className="hidden md:inline">Sign In</span>
                      </Link>
                    </Button>
                  </li>
                )}
                {/* If on other pages and not logged in, show both */}
                {showBrowseVehiclesLink && (
                   <>
                    <li>
                      <Button variant="outline" asChild>
                        <Link href="/login">
                          <LogIn className="mr-0 md:mr-2 h-4 w-4" /> <span className="hidden md:inline">Login</span>
                        </Link>
                      </Button>
                    </li>
                    <li>
                      <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Link href="/register">
                          <UserPlus className="mr-0 md:mr-2 h-4 w-4" /> <span className="hidden md:inline">Sign Up</span>
                        </Link>
                      </Button>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
