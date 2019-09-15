import { Injectable } from '@angular/core';
import { DataService } from '@app/core/services/data.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ISqlDataBase, IFileDataSource, ISqlDataSource, ISqlField, IFileDataSourceField } from '@app/core';

@Injectable()
export class DataSourceService {
    constructor(private _dataService: DataService) {
    }

    public getSqlDataBasesDictionary(): Observable<Array<{ key: string, value: string }>> {
        return this._dataService.get<ISqlDataBase[]>(`/api/datasource/database`).pipe(
            map(res => res.map(item => {
                const r = { key: item.id.toString(), value: item.name };
                return r;
            })));
    }

    public getSqlDataSourcesDictionary(): Observable<Array<{ key: string, value: string }>> {
        return this._dataService.get<ISqlDataSource[]>(`/api/datasource/sql`).pipe(
            map(res => res.map(item => {
                const r = { key: item.id.toString(), value: item.name };
                return r;
            })));
    }

    public getSqlDataSourceFieldsDictionary(id: number): Observable<Array<{ key: string, value: string }>> {
        return this._dataService.get<ISqlDataSource>(`/api/datasource/sql/${id}`).pipe(
            map(res => res.sqlFields.map(item => {
                const r = { key: item.id.toString(), value: item.name };
                return r;
            })));
    }

    public getSqlDataSourceFields(id: number): Observable<Array<ISqlField>> {
        return this._dataService.get<ISqlDataSource>(`/api/datasource/sql/${id}`).pipe(
            map(res => res.sqlFields));
    }

    public getFileDataSourceFields(id: number): Observable<Array<IFileDataSourceField>> {
        return this._dataService.get<IFileDataSource>(`/api/datasource/file/${id}`).pipe(
            map(res => res.fileDataSourceFields));
    }

    public getFileDataSourceFieldsDictionary(id: number): Observable<Array<{ key: string, value: string }>> {
        return this._dataService.get<IFileDataSource>(`/api/datasource/file/${id}`).pipe(
            map(res => res.fileDataSourceFields.map(item => {
                const r = { key: item.id.toString(), value: item.name };
                return r;
            })));
    }

    public getFileDataSourceDictionary(): Observable<Array<{ key: string, value: string }>> {
        return this._dataService.get<IFileDataSource[]>(`/api/datasource/file`).pipe(
            map(res => res.map(item => {
                const r = { key: item.id.toString(), value: item.name };
                return r;
            })));
    }

    public getSqlDataTablesDictionaryFromSqlDatabase(database: ISqlDataBase): Array<{ key: string, value: string }> {
        return database.sqlTables.map(table => {
            const r = { key: table.id.toString(), value: table.name };
            return r;
        });
    }
}
