import { z } from 'zod';
export declare const createAddressSchema: z.ZodObject<{
    label: z.ZodString;
    fullName: z.ZodString;
    phone: z.ZodString;
    addressLine1: z.ZodString;
    addressLine2: z.ZodOptional<z.ZodString>;
    city: z.ZodString;
    area: z.ZodString;
    postalCode: z.ZodOptional<z.ZodString>;
    isDefault: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    phone: string;
    fullName: string;
    addressLine1: string;
    city: string;
    area: string;
    label: string;
    addressLine2?: string | undefined;
    postalCode?: string | undefined;
    isDefault?: boolean | undefined;
}, {
    phone: string;
    fullName: string;
    addressLine1: string;
    city: string;
    area: string;
    label: string;
    addressLine2?: string | undefined;
    postalCode?: string | undefined;
    isDefault?: boolean | undefined;
}>;
export declare const updateAddressSchema: z.ZodObject<{
    label: z.ZodOptional<z.ZodString>;
    fullName: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    addressLine1: z.ZodOptional<z.ZodString>;
    addressLine2: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    area: z.ZodOptional<z.ZodString>;
    postalCode: z.ZodOptional<z.ZodString>;
    isDefault: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    phone?: string | undefined;
    fullName?: string | undefined;
    addressLine1?: string | undefined;
    addressLine2?: string | undefined;
    city?: string | undefined;
    area?: string | undefined;
    postalCode?: string | undefined;
    isDefault?: boolean | undefined;
    label?: string | undefined;
}, {
    phone?: string | undefined;
    fullName?: string | undefined;
    addressLine1?: string | undefined;
    addressLine2?: string | undefined;
    city?: string | undefined;
    area?: string | undefined;
    postalCode?: string | undefined;
    isDefault?: boolean | undefined;
    label?: string | undefined;
}>;
export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
//# sourceMappingURL=address.validation.d.ts.map