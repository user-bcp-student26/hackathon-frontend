export interface ContactRequest {
  name: string;
  phone: string;
  wallet_id: string;
}

export interface Contact extends ContactRequest {
  id: string;
  createdAt: string;
}