import { ICreateStaffDTO, IMarkAttendanceDTO } from './staff.interface';
export declare const staffService: {
    createStaff: (dto: ICreateStaffDTO) => Promise<{
        staffProfile: {
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
        } | null;
    } & {
        id: string;
        email: string;
        phone: string;
        name: string;
        passwordHash: string;
        role: import(".prisma/client").$Enums.Role;
        profileImage: string | null;
        expoPushToken: string | null;
        isVerified: boolean;
        isActive: boolean;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllStaff: (params: any) => Promise<{
        staff: ({
            user: {
                id: string;
                email: string;
                phone: string;
                name: string;
                profileImage: string | null;
                isActive: boolean;
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
        })[];
        total: number;
        page: any;
        limit: any;
    }>;
    getStaffProfile: (userId: string) => Promise<{
        user: {
            id: string;
            email: string;
            phone: string;
            name: string;
            profileImage: string | null;
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
    }>;
    getStaffOrders: (userId: string, params: any) => Promise<{
        orders: ({
            user: {
                id: string;
                phone: string;
                name: string;
            };
            items: ({
                product: {
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
        page: any;
        limit: any;
    }>;
    markAttendance: (userId: string, dto: IMarkAttendanceDTO) => Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.AttendanceStatus;
        date: Date;
        staffId: string;
        checkIn: Date;
        checkOut: Date | null;
    }>;
    getAttendance: (userId: string, role: string, targetStaffId?: string) => Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.AttendanceStatus;
        date: Date;
        staffId: string;
        checkIn: Date;
        checkOut: Date | null;
    }[]>;
    getEarnings: (userId: string) => Promise<{
        deliveredOrders: number;
        rating: number;
        salary: number | null;
        totalDeliveries: number;
        earnings: number;
    }>;
    updateAvailability: (userId: string, isAvailable: boolean) => Promise<{
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
    }>;
};
//# sourceMappingURL=staff.service.d.ts.map