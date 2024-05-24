import { Injectable } from '@angular/core';
import { jsPDF } from "jspdf";
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
                
                const power = this.mapLetterToNumber(oStandToPrint.poder);
                const speed = this.mapLetterToNumber(oStandToPrint.velocidad);
                const range = this.mapLetterToNumber(oStandToPrint.alcance);
                const durability = this.mapLetterToNumber(oStandToPrint.aguante);
                const precision = this.mapLetterToNumber(oStandToPrint.acierto);
                const potential = this.mapLetterToNumber(oStandToPrint.desarollo);
    
               
                const canvas = document.createElement('canvas');
                canvas.width = 300;
                canvas.height = 300;
                const ctx = canvas.getContext('2d');
    
                if (ctx) { 
                   
                    this.drawRadarChart(ctx, power, speed, range, durability, precision, potential);
    
                  
                    const imageData = canvas.toDataURL();
    
                 
                    const doc = new jsPDF();
    
                 
                    doc.addImage(imageData, 'PNG', 10, 10, 180, 180);
    
                 
                    this.addStatsLabels(doc, power, speed, range, durability, precision, potential);
    
                  
                    doc.text(`Stand: ${oStandToPrint.nombre}`, 10, 200);
                    doc.text(`User: ${oStandToPrint.usuario.username}`, 10, 210);
                    doc.text(`Description: ${oStandToPrint.descripcion}`, 10, 220);
    
                    doc.save('stand_stats.pdf');
                } else {
                    console.error('Canvas context is null');
                }
            }
        });
    }
    
    private addStatsLabels(doc: jsPDF, power: number, speed: number, range: number, durability: number, precision: number, potential: number): void {
        const centerX = 150;
        const centerY = 150;
        const radius = 100;
        const angle = Math.PI * 2 / 6;
    
        const labels = ['Poder', 'Velocidad', 'Rango', 'Aguante', 'Precision', 'Potencial'];
        const stats = [power, speed, range, durability, precision, potential];
    
        for (let i = 0; i < 6; i++) {
            const x = centerX + radius * Math.cos(angle * i);
            const y = centerY + radius * Math.sin(angle * i);
            const label = labels[i] + ': ' + stats[i];
            

            const xOffset = doc.getStringUnitWidth(label) / 2;
            const yOffset = 10; 
            
            doc.text(label, x - xOffset, y - radius - yOffset);
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
    
        ctx.beginPath();
        ctx.moveTo(centerX + radius * Math.cos(0), centerY + radius * Math.sin(0));
        for (let i = 1; i <= 6; i++) {
            ctx.lineTo(centerX + radius * Math.cos(angle * i), centerY + radius * Math.sin(angle * i));
        }
        ctx.closePath();
        ctx.strokeStyle = '#000';
        ctx.stroke();
    
        this.drawRadarLine(ctx, centerX, centerY, radius, power, angle * 0);
        this.drawRadarLine(ctx, centerX, centerY, radius, speed, angle * 1);
        this.drawRadarLine(ctx, centerX, centerY, radius, range, angle * 2);
        this.drawRadarLine(ctx, centerX, centerY, radius, durability, angle * 3);
        this.drawRadarLine(ctx, centerX, centerY, radius, precision, angle * 4);
        this.drawRadarLine(ctx, centerX, centerY, radius, potential, angle * 5);
    }
    
    private drawRadarLine(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, value: number, angle: number): void {
        const x = centerX + (radius * value / 5) * Math.cos(angle);
        const y = centerY + (radius * value / 5) * Math.sin(angle);
    
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = '#f00'; 
        ctx.stroke();
    
        ctx.fillStyle = '#f00';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}
