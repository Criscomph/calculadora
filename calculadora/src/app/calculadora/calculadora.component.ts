import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LoanCalculatorService } from '../services/loan-calculator.service';
import { InstallmentDTO } from '../models/loan-calculation.model';

@Component({
  selector: 'app-calculadora',
  templateUrl: './calculadora.component.html',
  styleUrls: ['./calculadora.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  providers: [LoanCalculatorService]
})
export class CalculadoraComponent {
  dataInicial: string = '';
  dataFinal: string = '';
  primeiroPagamento: string = '';
  valorEmprestimo: number = 0;
  taxaJuros: number = 0;
  resultados: InstallmentDTO[] = [];
  formValido: boolean = false;

  constructor(
    private loanCalculatorService: LoanCalculatorService,
    private cdr: ChangeDetectorRef
  ) {}

  validarFormulario(): boolean {
    if (!this.dataInicial || !this.dataFinal || !this.primeiroPagamento || 
        !this.valorEmprestimo || !this.taxaJuros) {
      return false;
    }

    const dInicial = new Date(this.dataInicial);
    const dFinal = new Date(this.dataFinal);
    const dPrimeiroPagamento = new Date(this.primeiroPagamento);

    if (dFinal <= dInicial) {
      return false;
    }

    if (dPrimeiroPagamento <= dInicial || dPrimeiroPagamento >= dFinal) {
      return false;
    }

    if (this.valorEmprestimo <= 0 || this.taxaJuros <= 0) {
      return false;
    }

    return true;
  }

  onInputChange(): void {
    this.formValido = this.validarFormulario();
  }

  calcular(): void {
    if (!this.validarFormulario()) {
      return;
    }

    const calculationData = {
      dataInicial: this.dataInicial,
      dataFinal: this.dataFinal,
      primeiroPagamento: this.primeiroPagamento,
      valorEmprestimo: this.valorEmprestimo,
      taxaJuros: this.taxaJuros
    };

    this.loanCalculatorService.calculateLoan(calculationData)
      .subscribe({
        next: (response) => {
          this.resultados = [...response]; // Cria uma nova referência do array
          this.cdr.detectChanges(); // Força a detecção de mudanças
        },
        error: (error) => {
          console.error('Erro ao calcular empréstimo:', error);
          // Aqui você pode adicionar uma lógica para mostrar mensagem de erro para o usuário
        }
      });
  }
} 