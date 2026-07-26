import { z } from 'zod';
export declare const createStaffSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
    password: z.ZodString;
    position: z.ZodEnum<["DELIVERY_BOY", "SUPPORT", "WAREHOUSE", "MANAGER"]>;
    shift: z.ZodOptional<z.ZodEnum<["MORNING", "EVENING", "NIGHT"]>>;
    salary: z.ZodOptional<z.ZodNumber>;
    assignedArea: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    email: string;
    phone: string;
    name: string;
    password: string;
    position: "DELIVERY_BOY" | "SUPPORT" | "WAREHOUSE" | "MANAGER";
    shift?: "MORNING" | "EVENING" | "NIGHT" | undefined;
    salary?: number | undefined;
    assignedArea?: string[] | undefined;
}, {
    email: string;
    phone: string;
    name: string;
    password: string;
    position: "DELIVERY_BOY" | "SUPPORT" | "WAREHOUSE" | "MANAGER";
    shift?: "MORNING" | "EVENING" | "NIGHT" | undefined;
    salary?: number | undefined;
    assignedArea?: string[] | undefined;
}>;
export declare const markAttendanceSchema: z.ZodObject<{
    checkIn: z.ZodOptional<z.ZodString>;
    checkOut: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["PRESENT", "ABSENT", "LEAVE", "LATE"]>>;
}, "strip", z.ZodTypeAny, {
    status?: "PRESENT" | "ABSENT" | "LEAVE" | "LATE" | undefined;
    checkIn?: string | undefined;
    checkOut?: string | undefined;
}, {
    status?: "PRESENT" | "ABSENT" | "LEAVE" | "LATE" | undefined;
    checkIn?: string | undefined;
    checkOut?: string | undefined;
}>;
export declare const updateAvailabilitySchema: z.ZodObject<{
    isAvailable: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    isAvailable: boolean;
}, {
    isAvailable: boolean;
}>;
export type CreateStaffInput = z.infer<typeof createStaffSchema>;
export type MarkAttendanceInput = z.infer<typeof markAttendanceSchema>;
//# sourceMappingURL=staff.validation.d.ts.map