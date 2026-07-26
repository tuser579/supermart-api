export interface IDeliveryAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  area: string;
  postalCode?: string;
}

export interface ICreateOrderDTO {
  deliveryAddress: IDeliveryAddress;
  notes?: string;
  paymentMethod: string;
  transactionId?: string;
}

export interface IUpdateOrderStatusDTO {
  status: string;
  cancellationReason?: string;
}

export interface IReturnOrderDTO {
  reason: string;
  details?: string;
  images?: string[];
}

export interface IPayOrderDTO {
  paymentMethod: string;
  transactionId?: string;
}

export interface IAssignDeliveryDTO {
  staffId: string;
}

export interface IOrderQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  userId?: string;
}
