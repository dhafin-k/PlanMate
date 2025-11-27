import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, ClipboardList, ListTodo, Users } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Lists',
        href: '/lists',
        icon: ClipboardList,
    },
    {
        title: 'Tugas',
        href: '/tasks',
        icon: ListTodo,
    },
    {
        title: 'User Manage',
        href: '/users',
        icon: Users,
    },
];

const siswaNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/siswa/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Tugas Saya',
        href: '/siswa/tasks',
        icon: ListTodo,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { props } = usePage<any>();
    const currentUser = props?.auth?.user;
    // Determine role name: try relation -> string -> id mapping
    const roleName = currentUser?.role?.nama_role ?? currentUser?.role ?? (currentUser?.id_role === 2 ? 'siswa' : undefined);
    const navItemsToShow = roleName === 'siswa' ? siswaNavItems : mainNavItems;
    return (
        <Sidebar collapsible="icon" variant="inset" className='text-'>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="sm" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItemsToShow} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto " />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
