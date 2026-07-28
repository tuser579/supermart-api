export declare const getSavedPaymentMethods: (userId: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    type: string;
    details: import("@prisma/client/runtime/library").JsonValue | null;
    provider: string;
    last4: string | null;
    isDefault: boolean;
}[]>;
export declare const addSavedPaymentMethod: (data: {
    userId: string;
    type: string;
    provider: string;
    last4?: string;
    isDefault?: boolean;
}) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    type: string;
    details: import("@prisma/client/runtime/library").JsonValue | null;
    provider: string;
    last4: string | null;
    isDefault: boolean;
}>;
export declare const deleteSavedPaymentMethod: (userId: string, id: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    type: string;
    details: import("@prisma/client/runtime/library").JsonValue | null;
    provider: string;
    last4: string | null;
    isDefault: boolean;
}>;
//# sourceMappingURL=payment-method.service.d.ts.map