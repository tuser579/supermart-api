export interface ICreateAddressDTO {
  label: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  area: string;
  postalCode?: string;
  isDefault?: boolean;
}

export interface IUpdateAddressDTO {
  label?: string;
  fullName?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  area?: string;
  postalCode?: string;
  isDefault?: boolean;
}

export interface IAddress {
  id: string;
  userId: string;
  label: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  area: string;
  postalCode?: string | null;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}
