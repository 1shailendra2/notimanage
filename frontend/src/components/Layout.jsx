import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Bell } from 'lucide-react';

export default function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex flex-col">
            <header className="border-b bg-card">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center space-x-2 font-bold text-xl">
                        <Bell className="h-6 w-6" />
                        <span>Notification System</span>
                    </Link>

                    <nav className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <span className="text-sm text-muted-foreground">Welcome, {user.name}</span>
                                <Button variant="outline" onClick={handleLogout}>Logout</Button>
                            </>
                        ) : (
                            <>
                                <Link to="/login"><Button variant="ghost">Login</Button></Link>
                                <Link to="/register"><Button>Register</Button></Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>
            <main className="flex-1 container mx-auto px-4 py-8">
                <Outlet />
            </main>
        </div>
    );
}
