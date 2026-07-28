import { ICreateOrderDTO, IUpdateOrderStatusDTO, IReturnOrderDTO, IPayOrderDTO, IOrderQueryParams } from './order.interface';
export declare const orderService: {
    createOrder: (userId: string, dto: ICreateOrderDTO) => Promise<{
        user: {
            id: string;
            email: string;
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
    }>;
    getOrders: (userId: string, role: string, params: IOrderQueryParams) => Promise<{
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
                    price: number;
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
    getOrderById: (orderId: string, userId: string, role: string) => Promise<{
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
                description: string | null;
                price: number;
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
    }>;
    updateOrderStatus: (orderId: string, dto: IUpdateOrderStatusDTO, userId: string, role: string) => Promise<{
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
    assignDelivery: (orderId: string, staffId: string) => Promise<{
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
    cancelOrder: (orderId: string, userId: string, role?: string, reason?: string) => Promise<{
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
    returnOrder: (orderId: string, userId: string, dto: IReturnOrderDTO) => Promise<{
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
    payOrder: (orderId: string, userId: string, dto: IPayOrderDTO) => Promise<{
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
};
//# sourceMappingURL=order.service.d.ts.map