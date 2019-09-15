import { Component, OnInit } from '@angular/core';
import { DataService } from '@app/core';
import { Router } from '@angular/router';
import { IProcessingFile } from '@app/core/models/ProcessingFile';

@Component({
  selector: 'app-process-file-list',
  templateUrl: './process-file-list.component.html',
  styleUrls: ['./process-file-list.component.scss']
})
export class ProcessFileListComponent implements OnInit {

  items: Array<IProcessingFile> = [];

  constructor(private _dataService: DataService,
    private _router: Router) { }

  ngOnInit() {
    this.getItems();
  }

  onSelect(item: IProcessingFile): void {
    this._router.navigate(['/process-config/files/', item.id]);
  }

  onCreate() {
    this._router.navigate(['/process-config/files/new']);
  }

  getItems() {
    this._dataService.get<IProcessingFile[]>('/api/file/processing-file').subscribe(
      data => this.items = data
    );
  }

}
