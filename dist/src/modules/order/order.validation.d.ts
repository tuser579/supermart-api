import { z } from 'zod';
export declare const createOrderSchema: z.ZodObject<{
    deliveryAddress: z.ZodObject<{
        fullName: z.ZodString;
        phone: z.ZodString;
        addressLine1: z.ZodString;
        addressLine2: z.ZodOptional<z.ZodString>;
        city: z.ZodString;
        area: z.ZodString;
        postalCode: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        phone: string;
        fullName: string;
        addressLine1: string;
        city: string;
        area: string;
        addressLine2?: string | undefined;
        postalCode?: string | undefined;
    }, {
        phone: string;
        fullName: string;
        addressLine1: string;
        city: string;
        area: string;
        addressLine2?: string | undefined;
        postalCode?: string | undefined;
    }>;
    notes: z.ZodOptional<z.ZodString>;
    paymentMethod: z.ZodEnum<["COD", "BKASH", "ROCKET", "NOGOD", "BANK_TRANSFER", "CARD"]>;
    transactionId: z.ZodOptional<z.ZodString>;
    items: z.ZodOptional<z.ZodArray<z.ZodObject<{
        productId: z.ZodString;
        quantity: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        productId: string;
        quantity: number;
    }, {
        productId: string;
        quantity: number;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    paymentMethod: "COD" | "BKASH" | "ROCKET" | "NOGOD" | "BANK_TRANSFER" | "CARD";
    deliveryAddress: {
        phone: string;
        fullName: string;
        addressLine1: string;
        city: string;
        area: string;
        addressLine2?: string | undefined;
        postalCode?: string | undefined;
    };
    items?: {
        productId: string;
        quantity: number;
    }[] | undefined;
    transactionId?: string | undefined;
    notes?: string | undefined;
}, {
    paymentMethod: "COD" | "BKASH" | "ROCKET" | "NOGOD" | "BANK_TRANSFER" | "CARD";
    deliveryAddress: {
        phone: string;
        fullName: string;
        addressLine1: string;
        city: string;
        area: string;
        addressLine2?: string | undefined;
        postalCode?: string | undefined;
    };
    items?: {
        productId: string;
        quantity: number;
    }[] | undefined;
    transactionId?: string | undefined;
    notes?: string | undefined;
}>;
export declare const updateOrderStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURN_REQUESTED", "RETURNED"]>;
    cancellationReason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURN_REQUESTED" | "RETURNED";
    cancellationReason?: string | undefined;
}, {
    status: "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURN_REQUESTED" | "RETURNED";
    cancellationReason?: string | undefined;
}>;
export declare const returnOrderSchema: z.ZodObject<{
    reason: z.ZodString;
    details: z.ZodOptional<z.ZodString>;
    images: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    reason: string;
    images?: string[] | undefined;
    details?: string | undefined;
}, {
    reason: string;
    images?: string[] | undefined;
    details?: string | undefined;
}>;
export declare const assignDeliverySchema: z.ZodObject<{
    staffId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    staffId: string;
}, {
    staffId: string;
}>;
export declare const orderQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    status: z.ZodOptional<z.ZodEnum<["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURN_REQUESTED", "RETURNED"]>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    status?: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURN_REQUESTED" | "RETURNED" | undefined;
}, {
    limit?: number | undefined;
    page?: number | undefined;
    status?: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURN_REQUESTED" | "RETURNED" | undefined;
}>;
export declare const payOrderSchema: z.ZodObject<{
    paymentMethod: z.ZodEnum<["COD", "BKASH", "ROCKET", "NOGOD", "BANK_TRANSFER", "CARD"]>;
    transactionId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    paymentMethod: "COD" | "BKASH" | "ROCKET" | "NOGOD" | "BANK_TRANSFER" | "CARD";
    transactionId?: string | undefined;
}, {
    paymentMethod: "COD" | "BKASH" | "ROCKET" | "NOGOD" | "BANK_TRANSFER" | "CARD";
    transactionId?: string | undefined;
}>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type ReturnOrderInput = z.infer<typeof returnOrderSchema>;
export type PayOrderInput = z.infer<typeof payOrderSchema>;
//# sourceMappingURL=order.validation.d.ts.map