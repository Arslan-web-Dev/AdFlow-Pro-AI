export type UserRole = 'user' | 'admin';

export interface RolePermissions {
  canCreateAds: boolean;
  canEditOwnAds: boolean;
  canDeleteOwnAds: boolean;
  canViewAllAds: boolean;
  canApproveAds: boolean;
  canRejectAds: boolean;
  canManageUsers: boolean;
  canViewAnalytics: boolean;
  canManageSystem: boolean;
  canViewLogs: boolean;
  canSyncDatabase: boolean;
  canManageFeatures: boolean;
  canReviewAds: boolean;
  canVerifyPayments: boolean;
  canPublishAds: boolean;
  canScheduleAds: boolean;
  canFeatureAds: boolean;
}

export const rolePermissions: Record<UserRole, RolePermissions> = {
  user: {
    canCreateAds: true,
    canEditOwnAds: true,
    canDeleteOwnAds: true,
    canViewAllAds: false,
    canApproveAds: false,
    canRejectAds: false,
    canManageUsers: false,
    canViewAnalytics: true,
    canManageSystem: false,
    canViewLogs: false,
    canSyncDatabase: false,
    canManageFeatures: false,
    canReviewAds: false,
    canVerifyPayments: false,
    canPublishAds: false,
    canScheduleAds: false,
    canFeatureAds: false,
  },
  admin: {
    canCreateAds: true,
    canEditOwnAds: true,
    canDeleteOwnAds: true,
    canViewAllAds: true,
    canApproveAds: true,
    canRejectAds: true,
    canManageUsers: true,
    canViewAnalytics: true,
    canManageSystem: true,
    canViewLogs: true,
    canSyncDatabase: true,
    canManageFeatures: true,
    canReviewAds: true,
    canVerifyPayments: true,
    canPublishAds: true,
    canScheduleAds: true,
    canFeatureAds: true,
  },
};

export function hasPermission(role: UserRole, permission: keyof RolePermissions): boolean {
  return rolePermissions[role][permission];
}

export function canAccessRoute(role: UserRole, route: string): boolean {
  const routeAccess: Record<string, UserRole[]> = {
    '/dashboard/user': ['user', 'admin'],
    '/dashboard/admin': ['admin'],
    '/user': ['user', 'admin'],
    '/admin': ['admin'],
  };

  for (const [routePattern, allowedRoles] of Object.entries(routeAccess)) {
    if (route.startsWith(routePattern)) {
      return allowedRoles.includes(role);
    }
  }

  return true; // Default allow for public routes
}

export function getDashboardRoute(role: UserRole): string {
  const dashboardRoutes: Record<UserRole, string> = {
    user: '/dashboard/user',
    admin: '/dashboard/admin',
  };

  return dashboardRoutes[role];
}

export function canEditAd(userRole: UserRole, adUserId: string, currentUserId: string): boolean {
  if (userRole === 'admin') {
    return true;
  }
  
  return adUserId === currentUserId;
}

export function canDeleteAd(userRole: UserRole, adUserId: string, currentUserId: string): boolean {
  if (userRole === 'admin') {
    return true;
  }
  
  return adUserId === currentUserId;
}
