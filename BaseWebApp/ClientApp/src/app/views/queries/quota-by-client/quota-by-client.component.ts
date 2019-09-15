import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-quota-by-client',
  templateUrl: './quota-by-client.component.html',
  styleUrls: ['./quota-by-client.component.css']
})
export class QuotaByClientComponent implements OnInit {

  searchForm: FormGroup;
  logs: Array<any> = [];

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.searchForm = this._formBuilder.group({
    });
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    this.mockData();
  }

  mockData() {
    this.logs = [
      {
        variable: 'Cliente 1',
        value1: '1600',
        value2: '1123',
        total: '17943',
      },
      {
        variable: 'Cliente 2',
        value1: '1400',
        value2: '1323',
        total: '15943',
      },
      {
        variable: 'Cliente 3',
        value1: '1410',
        value2: '1223',
        total: '15943',
      },
    ];
  }
}

