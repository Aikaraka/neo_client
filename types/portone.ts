export interface PortOnePaymentResponse {
  id: string;
  storeId: string;
  paymentId: string;
  orderName: string;
  totalAmount: number;
  balanceAmount: number;
  status: "PAID" | "READY" | "FAILED" | "CANCELLED";
  customer: {
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  amount: {
    total: number;
    taxFree: number;
    vat: number;
    discount: number;
    point: number;
  };
  currency: string;
  paymentMethod: string;
  customData?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export type PortOne = any; 