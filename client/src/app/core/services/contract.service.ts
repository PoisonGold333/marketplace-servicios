import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ContractService {
  private apiUrl = 'http://localhost:5000/api/contracts';

  constructor(private http: HttpClient) {}

  createContract(data: any) {
    return this.http.post(`${this.apiUrl}`, data);
  }

  getContractByBooking(bookingId: string) {
    return this.http.get(`${this.apiUrl}/booking/${bookingId}`);
  }

  signContract(contractId: string, role: 'client' | 'provider') {
    return this.http.put(`${this.apiUrl}/${contractId}/sign`, { role });
  }
}