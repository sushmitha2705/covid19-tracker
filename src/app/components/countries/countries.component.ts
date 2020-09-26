import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DateWiseData } from 'src/app/models/date-wise-data';
import { GlobalDataSummary } from 'src/app/models/globalData';
import { DataServiceService } from 'src/app/services/data-service.service';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { Chart } from 'chart.js';
@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {
  data : GlobalDataSummary[];
  countries : string[] = [];
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  dateWiseData;
  selectedCountryData : DateWiseData[];
  loading = true;
  options: {
    height : 500, 
    animation:{
      duration: 1000,
      easing: 'out',
    },
  }

  @ViewChild('myLineChart') myLineChart!: ElementRef<HTMLCanvasElement>;
  lineChart!: Chart;
  constructor(private service : DataServiceService) { }

  ngOnInit(): void {

    merge(
      this.service.getDateWiseData().pipe(
        map(result=>{
          this.dateWiseData = result;
        })
      ), 
      this.service.getGlobalData().pipe(map(result=>{
        this.data = result;
        this.data.forEach(cs=>{
          this.countries.push(cs.country)
        })
      }))
    ).subscribe(
      {
        complete : ()=>{
         this.updateValues('India')
         this.loading = false;
         this.initChart();
        }
      }
    )
    
    

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
  initChart(){
    let labels = [];
    let dataset = [];
    this.selectedCountryData.forEach(cs=>{
      labels.push(cs.country);
      dataset.push(cs.cases);
    })
    this.generateChart(labels, dataset);    
  }
  updateChart(){
    this.initChart();
  }

  updateValues(country : string){
    console.log(country);
    this.data.forEach(cs=>{
      if(cs.country == country){
        this.totalActive = cs.active
        this.totalDeaths = cs.deaths
        this.totalRecovered = cs.recovered
        this.totalConfirmed = cs.confirmed
      }
    })

    this.selectedCountryData  = this.dateWiseData[country]
    // console.log(this.selectedCountryData);
    this.updateChart();
    
  }

}
