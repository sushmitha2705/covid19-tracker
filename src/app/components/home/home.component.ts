import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { GlobalDataSummary } from 'src/app/models/globalData';
import { GoogleChartInterface } from 'ng2-google-charts';
import { Chart } from 'chart.js';
//import { CssSelector } from '@angular/compiler';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  globalData: GlobalDataSummary[];
  
  @ViewChild('myPieChart') myPieChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('myLineChart') myLineChart!: ElementRef<HTMLCanvasElement>;

  chart!: Chart;
  lineChart!: Chart;
  constructor(private dataService : DataServiceService) {
  }

  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe(
      {
        next : (result)=>{
          console.log(result);
          this.globalData=result;
          result.forEach(cs => {
            if (!Number.isNaN(cs.confirmed)) {
              this.totalActive += cs.active
              this.totalConfirmed += cs.confirmed
              this.totalDeaths += cs.deaths
              this.totalRecovered += cs.active
            }
      });
      // setTimeout(() => this.initChart('c'), 500);
      this.initChart('c');
    }
  });

  }

  getNRandomColors(n) {
    let colors = [];
    while(n > 0) {
      colors.push(this.getRandomColor());
      n -= 1;
    }
    console.log('colors = ', colors);
    return colors;
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  generateChart(labels, datasets) {
    console.log(labels, datasets);
    if (this.chart)
      this.chart.destroy();
    this.chart = new Chart(this.myPieChart.nativeElement, {
      type: 'pie',
      data: {
          labels,
          datasets: [
              {
                  data: datasets,
                  backgroundColor: this.getNRandomColors(labels.length),
                  borderColor: '#3cba9f',
              },
          ],
      },
      options: {
        legend: {
          display: false
        },
        maintainAspectRatio: false,
        responsive: true,
      }
    });
    if (this.lineChart) 
      this.lineChart.destroy();
    this.lineChart = new Chart(this.myLineChart.nativeElement, {
      type: 'line',
      data: {
          labels,
          datasets: [
              {
                  data: datasets,
                  backgroundColor: this.getNRandomColors(labels.length),
                  borderColor: '#3cba9f',
              },
          ],
      },
      options: {
        legend: {
          display: false
        },
        maintainAspectRatio: false,
        responsive: true,
      }
    });
  }

  initChart(caseType : string){
    let labels = [];
    let dataset = [];
    this.globalData.forEach(cs=> {
          if(caseType == 'c'){
            if(cs.confirmed >= 2000){
                labels.push(cs.country);
                dataset.push(cs.confirmed);
              }
            }
            if(caseType == 'r'){
              if(cs.recovered >= 2000){
                labels.push(cs.country);
                dataset.push(cs.recovered);
              }
            }

            if(caseType == 'd'){
                if(cs.deaths >= 1000) {
                  labels.push(cs.country);
                  dataset.push(cs.deaths);
                }
            }
            if(caseType == 'a'){
                if(cs.active >= 2000){
                  labels.push(cs.country);
                  dataset.push(cs.active);
                }
            }
    });
    this.generateChart(labels, dataset);    
  }


  updateChart(input : HTMLInputElement){
    console.log(input.value);
    this.initChart(input.value);
  }
}
