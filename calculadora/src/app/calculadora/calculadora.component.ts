import { Component, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
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
export class CalculadoraComponent implements AfterViewInit {
  dataInicial: string = '';
  dataFinal: string = '';
  primeiroPagamento: string = '';
  valorEmprestimo: number = 0;
  valorEmprestimoFormatado: string = '';
  taxaJuros: number = 0;
  taxaJurosFormatada: string = '';
  resultados: InstallmentDTO[] = [];
  formValido: boolean = false;

  constructor(
    private loanCalculatorService: LoanCalculatorService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    // Força a detecção de mudanças após a view ser inicializada
    this.cdr.detectChanges();
  }

  formatarValorEmprestimo(valor: string) {
    // Remove todos os caracteres não numéricos
    let partes = valor.split(',');
    let numerosSemVirgula = partes[0].replace(/\D/g, '');
    
    // Se não há números antes da vírgula, usa 0
    if (!numerosSemVirgula) {
      numerosSemVirgula = '0';
    }
    
    // Adiciona pontos para milhares na parte antes da vírgula
    let numeroFormatado = '';
    for (let i = 0; i < numerosSemVirgula.length; i++) {
      if (i > 0 && (numerosSemVirgula.length - i) % 3 === 0) {
        numeroFormatado += '.';
      }
      numeroFormatado += numerosSemVirgula[i];
    }

    // Trata a parte decimal
    if (valor.includes(',')) {
      numeroFormatado += ',';
      if (partes[1]) {
        numeroFormatado += partes[1].replace(/\D/g, '');
      }
    }

    // Atualiza o valor numérico (para cálculos)
    this.valorEmprestimo = Number(numeroFormatado.replace(/\./g, '').replace(',', '.'));
    
    // Atualiza o valor formatado (para exibição)
    this.valorEmprestimoFormatado = numeroFormatado;

    this.onInputChange();
  }

  formatarTaxaJuros(valor: string) {
    // Remove o símbolo de % e outros caracteres não numéricos exceto vírgula
    let numero = valor.replace(/[^\d,]/g, '').replace(',', '.');
    
    // Converte para número
    this.taxaJuros = Number(numero);
    
    // Formata para exibição
    this.taxaJurosFormatada = numero + '%';

    this.onInputChange();
  }

  validarFormulario(): boolean {
    // Verifica se todos os campos estão preenchidos
    if (!this.dataInicial || !this.dataFinal || !this.primeiroPagamento) {
      return false;
    }

    // Verifica se os valores numéricos são válidos e maiores que zero
    if (isNaN(this.valorEmprestimo) || this.valorEmprestimo <= 0 ||
        isNaN(this.taxaJuros) || this.taxaJuros <= 0) {
      return false;
    }

    const dInicial = new Date(this.dataInicial);
    const dFinal = new Date(this.dataFinal);
    const dPrimeiroPagamento = new Date(this.primeiroPagamento);

    // Verifica se as datas são válidas
    if (isNaN(dInicial.getTime()) || isNaN(dFinal.getTime()) || isNaN(dPrimeiroPagamento.getTime())) {
      return false;
    }

    // Verifica a lógica das datas
    if (dFinal <= dInicial || dPrimeiroPagamento <= dInicial || dPrimeiroPagamento >= dFinal) {
      return false;
    }

    return true;
  }

  onInputChange(): void {
    this.formValido = this.validarFormulario();
    this.cdr.detectChanges();
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
          // Cria uma nova referência do array para garantir a detecção de mudanças
          this.resultados = [...response];
          // Força a detecção de mudanças imediatamente
          setTimeout(() => {
            this.cdr.detectChanges();
          });
        },
        error: (error) => {
          console.error('Erro ao calcular empréstimo:', error);
        }
      });
  }
} 