export type PaymentProviderType = 'stripe' | 'unsupported';

export interface PaymentToken {
  provider: PaymentProviderType;
  token: string;
}

export interface PaymentProviderProps {
  onSuccess: (token: PaymentToken) => void;
  onError: (error: Error) => void;
  isProcessing: boolean;
  amount: number;
  currency: string;
  providerAccountId: string | null;
}
