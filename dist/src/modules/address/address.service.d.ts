import { ICreateAddressDTO, IUpdateAddressDTO } from './address.interface';
export declare const addressService: {
    list: (userId: string) => Promise<{
        id: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        fullName: string;
        addressLine1: string;
        addressLine2: string | null;
        city: string;
        area: string;
        postalCode: string | null;
        isDefault: boolean;
        label: string;
    }[]>;
    create: (userId: string, dto: ICreateAddressDTO) => Promise<{
        id: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        fullName: string;
        addressLine1: string;
        addressLine2: string | null;
        city: string;
        area: string;
        postalCode: string | null;
        isDefault: boolean;
        label: string;
    }>;
    update: (userId: string, addressId: string, dto: IUpdateAddressDTO) => Promise<{
        id: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        fullName: string;
        addressLine1: string;
        addressLine2: string | null;
        city: string;
        area: string;
        postalCode: string | null;
        isDefault: boolean;
        label: string;
    }>;
    delete: (userId: string, addressId: string) => Promise<void>;
    setDefault: (userId: string, addressId: string) => Promise<{
        id: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        fullName: string;
        addressLine1: string;
        addressLine2: string | null;
        city: string;
        area: string;
        postalCode: string | null;
        isDefault: boolean;
        label: string;
    } | null>;
};
//# sourceMappingURL=address.service.d.ts.map