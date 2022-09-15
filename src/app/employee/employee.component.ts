import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

export class Employee {
  constructor(
    public Id: number,
    public EmployeeName: string,
    public StarTimeUtc: Date,
    public EndTimeUtc: Date,
    public EntryNotes: string,
    public DeletedOn: string,
    public Pom: number
  ) {
  }
}

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  employees!: Employee[];
  newEmployees!: any[];
  chart: any = [];

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees() {
    this.httpClient.get<any>('https://rc-vault-fap-live-1.azurewebsites.net/api/gettimeentries?code=vO17RnE8vuzXzPJo5eaLLjXjmRW07law99QTD90zat9FfOQJKKUcgQ==').subscribe(
      response => {
        console.log(response);
        this.employees = response;
        this.employees.forEach((employee: any) => {
          employee.Pom = this.getDifferenceInHours(employee.StarTimeUtc, employee.EndTimeUtc);
        });
        const map = new Map();
        for (const { EmployeeName, Pom } of this.employees) {
          const currSum = map.get(EmployeeName) || 0;
          map.set(EmployeeName, currSum + Pom);
        }
        const res = Array.from(map, ([EmployeeName, Pom]) => ({ EmployeeName, Pom }));
        this.newEmployees = res;
      }
    );
  }

  getDifferenceInHours(StarTimeUtc: Date, EndTimeUtc: Date) {
    const pom1 = new Date(StarTimeUtc);
    const pom2 = new Date(EndTimeUtc);
    const diffInMs = Math.abs(pom2.getTime() - pom1.getTime());
    return Math.round(diffInMs / (60 * 60 * 1000));
  }
}