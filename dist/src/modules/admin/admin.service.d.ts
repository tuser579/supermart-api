export declare const adminService: {
    getDashboardStats: () => Promise<{
        users: {
            total: number;
            active: number;
            newToday: number;
        };
        orders: {
            total: number;
            pending: number;
            delivered: number;
            cancelled: number;
            revenue: number;
        };
        products: {
            total: number;
            outOfStock: number;
        };
        staff: {
            total: number;
            available: number;
        };
    }>;
    getSalesReport: (period?: "daily" | "weekly" | "monthly", days?: number) => Promise<{
        orders: number;
        revenue: number;
        date: string;
    }[]>;
    getTopProducts: (limit?: number) => Promise<{
        product: {
            id: string;
            name: string;
            price: number;
            category: string;
            images: string[];
            rating: number;
        } | undefined;
        totalSold: number;
        totalOrders: number;
    }[]>;
    getAllUsers: (params: any) => Promise<{
        users: {
            id: string;
            email: string;
            phone: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
            isVerified: boolean;
            isActive: boolean;
            lastLogin: Date | null;
            createdAt: Date;
        }[];
        total: number;
        page: any;
        limit: any;
    }>;
    toggleUserStatus: (userId: string) => Promise<{
        id: string;
        email: string;
        name: string;
        isActive: boolean;
    }>;
    getStaffPerformance: () => Promise<{
        id: string;
        staffId: string;
        name: string;
        email: string;
        position: import(".prisma/client").$Enums.StaffPosition;
        rating: number;
        totalDeliveries: number;
        earnings: number;
        isAvailable: boolean;
    }[]>;
};
//# sourceMappingURL=admin.service.d.ts.map