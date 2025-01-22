import { User, Calendar, Shield } from "lucide-react"
import {
        Sidebar,
        SidebarContent,
        SidebarGroup,
        SidebarGroupContent,
        SidebarGroupLabel,
        SidebarMenu,
        SidebarMenuButton,
        SidebarMenuItem,
        SidebarFooter,
        useSidebar,
} from "@/components/ui/sidebar"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { usePathname } from "next/navigation"
import useCurrentUser from "@/hooks/useCurrentUser"

import { ThemeToggleButton } from "@/components/theme-toggle-sidebar-button"

const menu = [
        {
                name: 'Profile',
                icon: User,
                href: '/dashboard',

        },
        {
                name: 'Security',
                icon: Shield,
                href: '/dashboard/security'
        }
]

export function AppSidebar() {
        const { isMobile } = useSidebar();
        const path = usePathname()
        const { user, loading } = useCurrentUser()
        const name = user?.user_metadata?.name
        const email = user?.email

        const initials = name?.split(" ").map((n: string) => n[0]).join("")

        return (
                <Sidebar collapsible="icon" variant="sidebar">
                        <SidebarContent>
                                <SidebarGroup>
                                        <SidebarGroupLabel>Account</SidebarGroupLabel>
                                        <SidebarGroupContent>
                                                <SidebarMenu>
                                                        {menu.map((item, index) => (
                                                                <SidebarMenuItem key={index}>
                                                                        <SidebarMenuButton isActive={path == item.href} className="py-3" asChild>
                                                                                <a href={item.href}>
                                                                                        <item.icon />
                                                                                        <span>{item.name}</span>
                                                                                </a>
                                                                        </SidebarMenuButton>
                                                                </SidebarMenuItem>
                                                        ))}
                                                </SidebarMenu>
                                        </SidebarGroupContent>
                                </SidebarGroup>
                        </SidebarContent>
                        <SidebarFooter>
                                <SidebarMenuItem className="xs:hidden md:block">
                                        <ThemeToggleButton />
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                        <SidebarMenuButton variant={""} className="flex items-center py-3 gap-3 h-fit data-[state=close]:h-fit">
                                                <Avatar className={(isMobile && 'h-1') + ' rounded-sm h-10'} >
                                                        {/* Split name and convert to initials */}
                                                        <AvatarFallback className="bg-primary/15">{initials}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                        <h3 className="font-semibold text-sm">{name}</h3>
                                                        <h3 className="text-xs leading-tight text-muted-foreground truncate">{email}</h3>
                                                </div>
                                        </SidebarMenuButton>
                                </SidebarMenuItem>
                        </SidebarFooter>
                </Sidebar>
        )
}


