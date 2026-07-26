import { ICreateNotificationDTO } from './notification.interface';
export declare const notificationService: {
    create: (dto: ICreateNotificationDTO) => Promise<{
        message: string;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        createdAt: Date;
        userId: string;
        type: string;
        title: string;
        isRead: boolean;
    }>;
    getUserNotifications: (userId: string, params: any) => Promise<{
        notifications: {
            message: string;
            data: import("@prisma/client/runtime/library").JsonValue | null;
            id: string;
            createdAt: Date;
            userId: string;
            type: string;
            title: string;
            isRead: boolean;
        }[];
        total: number;
        page: any;
        limit: any;
    }>;
    markAsRead: (notificationId: string, userId: string) => Promise<{
        message: string;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        createdAt: Date;
        userId: string;
        type: string;
        title: string;
        isRead: boolean;
    }>;
    markAllAsRead: (userId: string) => Promise<import(".prisma/client").Prisma.BatchPayload>;
};
//# sourceMappingURL=notification.service.d.ts.map