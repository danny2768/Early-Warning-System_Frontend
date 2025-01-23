import { Component, Input, OnChanges, SimpleChanges, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexMarkers,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
} from 'ng-apexcharts';

interface ChartData {
  value: number; // Value
  date: string; // Timestamp
}

@Component({
  selector: 'admin-timeseries-chart',
  templateUrl: './timeseries-chart.component.html',
  styleUrls: ['./timeseries-chart.component.css'],
})
export class TimeseriesChartComponent implements OnChanges, OnDestroy {
  @Input({ required: true })
  public chartTitle!: string;

  @Input({ required: true })
  public yAxisLabel!: string;

  @Input({ required: true })
  public chartData!: ChartData[];

  public chart?: ApexChart;
  public series?: ApexAxisChartSeries;
  public dataLabels?: ApexDataLabels;
  public markers?: ApexMarkers;
  public title?: ApexTitleSubtitle;
  public fill?: ApexFill;
  public yaxis?: ApexYAxis;
  public xaxis?: ApexXAxis;
  public tooltip?: ApexTooltip;

  private mouseWheelListener: () => void;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.mouseWheelListener = this.renderer.listen(this.el.nativeElement, 'wheel', this.disableMouseWheel);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartData'] && this.chartData) {
      this.initChartData();
    }
  }

  ngOnDestroy(): void {
    if (this.mouseWheelListener) {
      this.mouseWheelListener();
    }
  }

  private disableMouseWheel(event: WheelEvent): void {
    event.preventDefault();
  }

  public initChartData(): void {
    this.series = [
      {
        name: 'Sensor Reading',
        data: this.chartData.map((data) => {
          return {
            x: new Date(data.date).getTime(),
            y: data.value,
          };
        })
      },
    ];

    this.chart = {
      type: 'area',
      stacked: false,
      height: 400,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true,
      },
      toolbar: {
        autoSelected: 'zoom',
      },
    };

    this.dataLabels = {
      enabled: false,
    };

    this.markers = {
      size: 0,
    };

    this.title = {
      text: this.chartTitle,
      align: 'left',
    };

    this.fill = {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    };

    this.yaxis = {
      labels: {
        formatter: (value: number) => {
          return value.toFixed(2);
        },
      },
      title: {
        text: this.yAxisLabel,
      },
    };

    this.xaxis = {
      type: 'datetime',
    };

    this.tooltip = {
      shared: false,
      y: {
        formatter: (value: number) => {
          return value.toFixed(2);
        },
      },
    };
  }
}
