import {
  Briefcase,
  Database,
  File,
  GalleryVerticalEnd,
  Home,
  Lock,
  MessageCircle,
  Settings,
  Settings2,
  Shield,
  Users,
} from 'lucide-react';
import { type ComponentProps } from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';
import { NavItems } from '@/features/app/nav-items';
import { NavUser } from '@/features/app/nav-user';
import { useOrganizations } from '@/features/organization/organization-hooks';
import { OrganizationSwitcher } from '@/features/organization/organization-switcher';
import { authClient } from '@/lib/auth/auth-client';
import { canManageUsers, type UserRole } from '@/lib/auth/permissions';

const navigationItems = [
  {
    name: 'Overview',
    url: '/dashboard',
    icon: Home,
  },
  {
    name: 'TanStack DB Example',
    url: '/dashboard/tanstack-db-example',
    icon: Database,
  },
  {
    name: 'Workspace',
    url: '/dashboard/workspace',
    icon: Briefcase,
  },
  {
    name: 'Settings',
    url: '/dashboard/settings',
    icon: Settings2,
  },
  {
    name: 'Enhanced Settings',
    url: '/dashboard/settings-enhanced',
    icon: Settings,
  },
  {
    name: 'Chat',
    url: '/dashboard/chat',
    icon: MessageCircle,
  },
  {
    name: 'RAG',
    url: '/dashboard/chat/rag',
    icon: File,
  },
  {
    name: 'Vercel',
    url: '/dashboard/chat/vercel',
    icon: MessageCircle,
  },
  {
    name: 'Protect Examples',
    url: '/dashboard/protect-examples',
    icon: Lock,
  },
];

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const { data: session } = authClient.useSession();
  const { data: organizations } = useOrganizations();

  const currentUserRole = (session?.user?.role as UserRole) || 'user';

  const userData = session?.user
    ? {
        name: session.user.name || session.user.email,
        email: session.user.email,
        avatar: session.user.image || '/placeholder-user.jpg',
      }
    : undefined;

  const organizationData =
    organizations?.map((org) => ({
      name: org.name,
      logo: GalleryVerticalEnd,
      plan: 'Free', // TODO: Add plan information to organization data
    })) || [];

  // Admin navigation items - only show if user has admin permissions
  const adminItems = canManageUsers(currentUserRole)
    ? [
        {
          name: 'Admin Dashboard',
          url: '/dashboard/admin',
          icon: Shield,
        },
        {
          name: 'User Management',
          url: '/dashboard/admin/users',
          icon: Users,
        },
      ]
    : [];

  const allNavigationItems = [...navigationItems, ...adminItems];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <OrganizationSwitcher organizations={organizationData} />
      </SidebarHeader>
      <SidebarContent>
        <NavItems items={allNavigationItems} label="" />
      </SidebarContent>
      <SidebarFooter>{userData && <NavUser user={userData} />}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
