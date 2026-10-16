export interface Wallet {
  wallet_id: string;
  status: 'active';
  payments_enabled: boolean;
  createdAt: string;
}

export const WALLET_ID_PATTERN = /^wallet_[0-9a-f]{16}$/;