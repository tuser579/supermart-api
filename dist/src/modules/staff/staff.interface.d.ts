export interface ICreateStaffDTO {
    name: string;
    email: string;
    phone: string;
    password: string;
    position: 'DELIVERY_BOY' | 'SUPPORT' | 'WAREHOUSE' | 'MANAGER';
    shift?: 'MORNING' | 'EVENING' | 'NIGHT';
    salary?: number;
    assignedArea?: string[];
}
export interface IMarkAttendanceDTO {
    checkIn?: string;
    checkOut?: string;
    status?: 'PRESENT' | 'ABSENT' | 'LEAVE' | 'LATE';
}
export interface IStaffQueryParams {
    page?: number;
    limit?: number;
    position?: string;
    isAvailable?: boolean;
}
//# sourceMappingURL=staff.interface.d.ts.map