export type DocumentType = 'DNI' | 'CE' | 'PASSPORT';

export type KycStatus = 'approved' | 'rejected' | 'pending';

export interface KycRequest {
  documentType: DocumentType;
  documentNumber: string;
  fullName: string;
  birthDate: string;
}

export interface KycVerification {
  id: string;
  status: KycStatus;
  updatedAt: string;
  message?: string;
  providerReference?: string;
}