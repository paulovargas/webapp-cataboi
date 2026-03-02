import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize, Observable } from 'rxjs';
import { ReportService } from '../../services/report.service';

type ReportType = 'animais' | 'eventos' | 'propriedades' | 'rebanhos';
type ReportCard = { type: ReportType; title: string; subtitle: string; fileName: string };

@Component({
  selector: 'app-reports-animals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports-animals.component.html',
  styleUrl: './reports-animals.component.css'
})
export class ReportsAnimalsComponent {
  downloading: ReportType | null = null;
  readonly reportCards: ReportCard[] = [
    {
      type: 'animais',
      title: 'Total de Animais',
      subtitle: 'Visao geral de status, peso e identificacao.',
      fileName: 'RelatorioAnimais.pdf'
    },
    {
      type: 'eventos',
      title: 'Total de Eventos',
      subtitle: 'Historico consolidado de eventos cadastrados.',
      fileName: 'RelatorioEventos.pdf'
    },
    {
      type: 'propriedades',
      title: 'Total de Propriedades',
      subtitle: 'Resumo das propriedades e localidade.',
      fileName: 'RelatorioPropriedades.pdf'
    },
    {
      type: 'rebanhos',
      title: 'Total de Rebanhos',
      subtitle: 'Panorama de rebanhos e descricao.',
      fileName: 'RelatorioRebanhos.pdf'
    }
  ];

  constructor(private readonly reportService: ReportService) {}

  downloadReport(type: ReportType): void {
    this.downloading = type;

    const requestMap: Record<ReportType, { request: () => Observable<Blob> }> = {
      animais: {
        request: () => this.reportService.downloadAnimalsReport()
      },
      eventos: {
        request: () => this.reportService.downloadEventsReport()
      },
      propriedades: {
        request: () => this.reportService.downloadPropertiesReport()
      },
      rebanhos: {
        request: () => this.reportService.downloadHerdsReport()
      }
    };

    const report = requestMap[type];
    const fileName = this.reportCards.find(card => card.type === type)?.fileName ?? 'relatorio.pdf';
    report.request().pipe(
      finalize(() => {
        this.downloading = null;
      })
    ).subscribe({
      next: (blob: Blob) => this.saveFile(blob, fileName),
      error: (err: unknown) => {
        console.error('Erro ao baixar relatorio', err);
        alert('Nao foi possivel gerar o relatorio agora.');
      }
    });
  }

  isDownloading(type: ReportType): boolean {
    return this.downloading === type;
  }

  private saveFile(file: Blob, fileName: string): void {
    const url = window.URL.createObjectURL(file);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    window.URL.revokeObjectURL(url);
  }
}
