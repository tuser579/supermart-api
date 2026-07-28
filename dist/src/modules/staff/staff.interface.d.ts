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
export interface ITodayAttendanceStatus {
    attendanceId?: string;
    status: string | null;
    checkIn: Date | null;
    checkOut: Date | null;
    canCheckIn: boolean;
    canCheckOut: boolean;
}
export interface IStaffWorkloadSummary {
    totalAssignedOrders: number;
    activeDeliveriesCount: number;
    completedDeliveriesTodayCount: number;
}
export interface IStaffQuickAction {
    action: string;
    method: string;
    endpoint: string;
    description: string;
}
export interface IStaffQuickOptions {
    profile: {
        staffId: string;
        position: string;
        shift: string | null;
        rating: number;
        isAvailable: boolean;
        totalDeliveries: number;
        earnings: number;
    };
    todayAttendance: ITodayAttendanceStatus;
    workload: IStaffWorkloadSummary;
    recentAssignedOrders: Array<any>;
    quickActions: IStaffQuickAction[];
}
//# sourceMappingURL=staff.interface.d.ts.map