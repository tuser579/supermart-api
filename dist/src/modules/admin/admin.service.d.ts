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
            avatar: string | null;
            id: string;
            email: string;
            phone: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
            profileImage: string | null;
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
    getQuickOptions: () => Promise<{
        assignedOrdersOptions: {
            totalAssignedOrders: number;
            unassignedPendingOrders: number;
            availableDeliveryStaff: number;
            recentAssignedOrders: {
                user: {
                    phone: string;
                    name: string;
                };
                id: string;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.OrderStatus;
                totalAmount: number;
                orderId: string;
                assignedStaff: {
                    user: {
                        phone: string;
                        name: string;
                    };
                    id: string;
                    staffId: string;
                    position: import(".prisma/client").$Enums.StaffPosition;
                } | null;
            }[];
            staffWorkloadSummary: {
                staffId: string;
                code: string;
                name: string;
                isAvailable: boolean;
                activeAssignedCount: number;
            }[];
        };
        orderCancelOptions: {
            cancellableOrdersCount: number;
            totalCancelledCount: number;
            recentCancelledOrders: {
                user: {
                    email: string;
                    name: string;
                };
                id: string;
                updatedAt: Date;
                totalAmount: number;
                orderId: string;
                cancellationReason: string | null;
            }[];
            quickCancelEligibleStatuses: string[];
        };
        outOfStockOptions: {
            totalOutOfStock: number;
            totalLowStock: number;
            recentOutOfStockProducts: {
                id: string;
                name: string;
                updatedAt: Date;
                price: number;
                category: string;
                stock: number;
                images: string[];
            }[];
            recentLowStockProducts: {
                id: string;
                name: string;
                updatedAt: Date;
                price: number;
                category: string;
                stock: number;
                images: string[];
            }[];
        };
        quickActions: {
            action: string;
            method: string;
            endpoint: string;
        }[];
    }>;
    getAssignedOrders: (params?: any) => Promise<{
        orders: ({
            user: {
                id: string;
                email: string;
                phone: string;
                name: string;
            };
            items: ({
                product: {
                    id: string;
                    name: string;
                    images: string[];
                };
            } & {
                id: string;
                price: number;
                productId: string;
                quantity: number;
                orderId: string;
            })[];
            assignedStaff: ({
                user: {
                    email: string;
                    phone: string;
                    name: string;
                };
            } & {
                shift: import(".prisma/client").$Enums.Shift | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                rating: number;
                staffId: string;
                position: import(".prisma/client").$Enums.StaffPosition;
                joiningDate: Date;
                salary: number | null;
                assignedArea: string[];
                totalDeliveries: number;
                earnings: number;
                isAvailable: boolean;
            }) | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            totalAmount: number;
            orderId: string;
            discount: number;
            deliveryCharge: number;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            transactionId: string | null;
            refundTransactionId: string | null;
            statusHistory: import("@prisma/client/runtime/library").JsonValue | null;
            deliveryAddress: import("@prisma/client/runtime/library").JsonValue;
            deliveredAt: Date | null;
            cancellationReason: string | null;
            returnReason: string | null;
            returnDetails: string | null;
            returnImages: string[];
            notes: string | null;
            assignedStaffId: string | null;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    cancelOrderAsAdmin: (orderId: string, adminId: string, reason?: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalAmount: number;
        orderId: string;
        discount: number;
        deliveryCharge: number;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        transactionId: string | null;
        refundTransactionId: string | null;
        statusHistory: import("@prisma/client/runtime/library").JsonValue | null;
        deliveryAddress: import("@prisma/client/runtime/library").JsonValue;
        deliveredAt: Date | null;
        cancellationReason: string | null;
        returnReason: string | null;
        returnDetails: string | null;
        returnImages: string[];
        notes: string | null;
        assignedStaffId: string | null;
    }>;
    getOutOfStockProducts: (params?: any) => Promise<{
        products: {
            id: string;
            name: string;
            updatedAt: Date;
            price: number;
            discountPrice: number | null;
            category: string;
            brand: string | null;
            stock: number;
            images: string[];
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    restockProduct: (productId: string, stock?: number, addStock?: number) => Promise<{
        id: string;
        name: string;
        updatedAt: Date;
        price: number;
        category: string;
        stock: number;
    }>;
    getAllProductsForAdmin: (params?: any) => Promise<{
        products: {
            id: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            description: string | null;
            price: number;
            discountPrice: number | null;
            category: string;
            brand: string | null;
            stock: number;
            images: string[];
            rating: number;
            ratingCount: number;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    createProductAsAdmin: (dto: any, adminId: string) => Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: number;
        discountPrice: number | null;
        category: string;
        brand: string | null;
        stock: number;
        images: string[];
        rating: number;
        ratingCount: number;
        createdBy: string;
    }>;
    updateProductAsAdmin: (productId: string, dto: any) => Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: number;
        discountPrice: number | null;
        category: string;
        brand: string | null;
        stock: number;
        images: string[];
        rating: number;
        ratingCount: number;
        createdBy: string;
    }>;
    updateProductImages: (productId: string, images: string[] | string) => Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: number;
        discountPrice: number | null;
        category: string;
        brand: string | null;
        stock: number;
        images: string[];
        rating: number;
        ratingCount: number;
        createdBy: string;
    }>;
    deleteProductAsAdmin: (productId: string) => Promise<void>;
};
//# sourceMappingURL=admin.service.d.ts.map