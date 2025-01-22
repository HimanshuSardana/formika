import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggleButton() {
        const { theme, setTheme } = useTheme();
        const [mounted, setMounted] = useState(false);

        // Avoid hydration mismatch by only rendering after mounting
        useEffect(() => setMounted(true), []);

        if (!mounted) return null; // Wait until after client-side hydration to render

        return (
                <SidebarMenuButton
                        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                        className="p-2 rounded-md focus:outline-none"
                >
                        {theme === 'light' ? <Moon /> : <Sun />} {/* Or use icons for light/dark */}
                        Switch Theme
                </SidebarMenuButton>
        );
}


