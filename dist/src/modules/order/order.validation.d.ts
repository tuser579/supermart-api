import { z } from 'zod';
export declare const createOrderSchema: z.ZodObject<{
    deliveryAddress: z.ZodObject<{
        fullName: z.ZodEffects<z.ZodString, string, unknown>;
        phone: z.ZodEffects<z.ZodString, string, unknown>;
        addressLine1: z.ZodEffects<z.ZodString, string, unknown>;
        addressLine2: z.ZodOptional<z.ZodString>;
        city: z.ZodEffects<z.ZodString, string, unknown>;
        area: z.ZodEffects<z.ZodString, string, unknown>;
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
        phone?: unknown;
        fullName?: unknown;
        addressLine1?: unknown;
        addressLine2?: string | undefined;
        city?: unknown;
        area?: unknown;
        postalCode?: string | undefined;
    }>;
    notes: z.ZodOptional<z.ZodString>;
    paymentMethod: z.ZodEffects<z.ZodEnum<["COD", "BKASH", "ROCKET", "NOGOD", "BANK_TRANSFER", "CARD"]>, "COD" | "BKASH" | "ROCKET" | "NOGOD" | "BANK_TRANSFER" | "CARD", unknown>;
    transactionId: z.ZodOptional<z.ZodString>;
    items: z.ZodOptional<z.ZodEffects<z.ZodArray<z.ZodObject<{
        productId: z.ZodEffects<z.ZodString, string, unknown>;
        quantity: z.ZodEffects<z.ZodNumber, number, unknown>;
    }, "strip", z.ZodTypeAny, {
        productId: string;
        quantity: number;
    }, {
        productId?: unknown;
        quantity?: unknown;
    }>, "many">, {
        productId: string;
        quantity: number;
    }[], unknown>>;
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
    deliveryAddress: {
        phone?: unknown;
        fullName?: unknown;
        addressLine1?: unknown;
        addressLine2?: string | undefined;
        city?: unknown;
        area?: unknown;
        postalCode?: string | undefined;
    };
    items?: unknown;
    paymentMethod?: unknown;
    transactionId?: string | undefined;
    notes?: string | undefined;
}>;
export declare const updateOrderStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED", "RETURN_REQUESTED", "RETURNED"]>;
    cancellationReason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED" | "RETURN_REQUESTED" | "RETURNED";
    cancellationReason?: string | undefined;
}, {
    status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED" | "RETURN_REQUESTED" | "RETURNED";
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
    status: z.ZodOptional<z.ZodEnum<["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED", "RETURN_REQUESTED", "RETURNED"]>>;
    staffId: z.ZodOptional<z.ZodString>;
    assigned: z.ZodOptional<z.ZodEnum<["true", "false"]>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    status?: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED" | "RETURN_REQUESTED" | "RETURNED" | undefined;
    staffId?: string | undefined;
    assigned?: "true" | "false" | undefined;
}, {
    limit?: number | undefined;
    page?: number | undefined;
    status?: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED" | "RETURN_REQUESTED" | "RETURNED" | undefined;
    staffId?: string | undefined;
    assigned?: "true" | "false" | undefined;
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