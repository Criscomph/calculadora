import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoanCalculation, InstallmentDTO } from '../models/loan-calculation.model';

@Injectable({
  providedIn: 'root'
})
export class LoanCalculatorService {
  private apiUrl = 'http://localhost:8080/api/emprestimo';

  constructor(private http: HttpClient) {}

  calculateLoan(data: LoanCalculation): Observable<InstallmentDTO[]> {
    return this.http.post<InstallmentDTO[]>(`${this.apiUrl}/calcular`, data)
      .pipe(
        map(response => response.map(item => ({
          ...item,
          dataCompetencia: new Date(item.dataCompetencia)
        })))
      );
  }
} 