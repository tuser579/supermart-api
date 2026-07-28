import { z } from 'zod';
export declare const updateProfileSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    profileImage: z.ZodOptional<z.ZodString>;
    avatar: z.ZodOptional<z.ZodString>;
    photo: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    phone?: string | undefined;
    name?: string | undefined;
    profileImage?: string | undefined;
    avatar?: string | undefined;
    photo?: string | undefined;
}, {
    email?: string | undefined;
    phone?: string | undefined;
    name?: string | undefined;
    profileImage?: string | undefined;
    avatar?: string | undefined;
    photo?: string | undefined;
}>;
export declare const changePasswordSchema: z.ZodObject<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    currentPassword: string;
    newPassword: string;
}, {
    currentPassword: string;
    newPassword: string;
}>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
//# sourceMappingURL=user.validation.d.ts.map