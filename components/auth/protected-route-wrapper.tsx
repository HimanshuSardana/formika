import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
        user: User | null;
        loading: boolean;
        children: ReactNode;
}

const ProtectedRoute = ({ user, loading, children }: ProtectedRouteProps) => {
        const router = useRouter();

        // Show a loading spinner or placeholder while fetching user data
        if (loading) {
                return <div className='w-screen h-screen flex justify-center items-center'><Loader2 size="70" className='animate-spin text-primary' /></div>; // You can replace this with a more styled loading indicator
        }

        // Redirect to login if user is not authenticated and not loading
        if (!user) {
                router.push('/login');
                return null; // Prevent rendering children while redirecting
        }

        // Render the protected content if the user is authenticated
        return <>{children}</>;
};

export default ProtectedRoute;

