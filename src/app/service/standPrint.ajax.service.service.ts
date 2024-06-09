import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { StandAjaxService } from './stand.ajax.service.service';
import { IStand } from '../model/model.interfaces';

@Injectable({
    providedIn: 'root'
})
export class StandPrintAjaxService {
    constructor(private standAjaxService: StandAjaxService) { }

    printStandStats(standId: number): void {
        this.standAjaxService.getOne(standId).subscribe({
            next: (oStandToPrint: IStand) => {
                const power = oStandToPrint.poder;
                const speed = oStandToPrint.velocidad;
                const range = oStandToPrint.alcance;
                const durability = oStandToPrint.aguante;
                const precision = oStandToPrint.acierto;
                const potential = oStandToPrint.desarollo;

                const canvas = document.createElement('canvas');
                canvas.width = 300;
                canvas.height = 300;
                const ctx = canvas.getContext('2d');

                if (ctx) {
                    this.drawRadarChart(ctx, this.mapLetterToNumber(power), this.mapLetterToNumber(speed), this.mapLetterToNumber(range), this.mapLetterToNumber(durability), this.mapLetterToNumber(precision), this.mapLetterToNumber(potential));

                    const imageData = canvas.toDataURL();

                    const doc = new jsPDF();
                    
                    // Agrega un título en la parte superior del PDF
                    doc.setFontSize(20);
                    doc.setFont('helvetica', 'bold');
                    doc.text('Propiedades del Stand', 105, 20, { align: 'center' });

                    doc.addImage(imageData, 'PNG', 10, 30, 180, 180);

                    // Añadir la imagen del stand desde la base de datos en la esquina superior izquierda
                    if (oStandToPrint.imagen) {
                         // Calcula el ancho proporcional a la altura para mantener el aspecto original
                        doc.addImage(oStandToPrint.imagen, 'JPEG', 160, 230, 30, 80);
                    }

                    this.addStatsLabels(doc, power, speed, range, durability, precision, potential);

                    doc.setFontSize(14);
                    doc.setFont('helvetica', 'normal');
                    doc.text(`Stand: ${oStandToPrint.nombre}`, 10, 230);
                    doc.text(`User: ${oStandToPrint.usuario.username}`, 10, 240);
                    doc.text(`Description: ${oStandToPrint.descripcion}`, 10, 250);

                    doc.save('stand_stats.pdf');
                } else {
                    console.error('Canvas context is null');
                }
            }
        });
    }

    private addStatsLabels(doc: jsPDF, power: string, speed: string, range: string, durability: string, precision: string, potential: string): void {
        const labels = ['Poder', 'Velocidad', 'Rango', 'Aguante', 'Precisión', 'Potencial'];
        const stats = [power, speed, range, durability, precision, potential];

        const startX = 10;
        const startY = 260;
        const lineHeight = 10;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'italic');

        for (let i = 0; i < labels.length; i++) {
            const label = `${labels[i]}: ${stats[i]}`;
            doc.text(label, startX, startY + (i * lineHeight));
        }
    }

    private mapLetterToNumber(letter: string): number {
        switch (letter.toUpperCase()) {
            case 'S':
                return 5;
            case 'A':
                return 4;
            case 'B':
                return 3;
            case 'C':
                return 2;
            case 'D':
                return 1;
            case 'E':
                return 0;
            default:
                return 0;
        }
    }

    private drawRadarChart(ctx: CanvasRenderingContext2D, power: number, speed: number, range: number, durability: number, precision: number, potential: number): void {
        const centerX = 150;
        const centerY = 150;
        const radius = 100;
        const angle = Math.PI * 2 / 6;
        const labels = ['Poder', 'Velocidad', 'Rango', 'Aguante', 'Precisión', 'Potencial'];

        // Draw grid
        ctx.strokeStyle = '#B0B0B0';
        ctx.lineWidth = 1;
        for (let i = 1; i <= 5; i++) {
            ctx.beginPath();
            for (let j = 0; j <= 6; j++) {
                const x = centerX + (radius * i / 5) * Math.cos(angle * j);
                const y = centerY + (radius * i / 5) * Math.sin(angle * j);
                ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();
        }

        // Draw axes
        ctx.strokeStyle = '#000';
        for (let i = 0; i < 6; i++) {
            const x = centerX + radius * Math.cos(angle * i);
            const y = centerY + radius * Math.sin(angle * i);
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.stroke();

            // Draw labels
            ctx.fillStyle = '#000';
            ctx.font = '12px Helvetica';
            ctx.fillText(labels[i], x + 5 * Math.cos(angle * i), y + 5 * Math.sin(angle * i));
        }

        // Draw data
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const value = [power, speed, range, durability, precision, potential][i];
            const x = centerX + (radius * value / 5) * Math.cos(angle * i);
            const y = centerY + (radius * value / 5) * Math.sin(angle * i);
            ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    }
}
