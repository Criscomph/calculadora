import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoanCalculation, InstallmentDTO } from '../models/loan-calculation.model';

@Injectable({
  providedIn: 'root'
})
export class LoanCalculatorService {
  private apiUrl = 'http://localhost:8080/api/emprestimo';

  constructor(private http: HttpClient) { }

  calculateLoan(loanCalculation: LoanCalculation): Observable<InstallmentDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post<InstallmentDTO[]>(`${this.apiUrl}/calcular`, loanCalculation, { headers });
  }
} 