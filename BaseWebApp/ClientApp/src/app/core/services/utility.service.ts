import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, fromEvent } from 'rxjs';
import * as moment from 'moment';
import { TreeNode } from 'primeng/api';
import { ICompensationResult, ITraceabilityResult } from '@app/core';

interface Identity {
    id: number;
}

@Injectable()
export class UtilityService {
    public _router: Router;
    constructor(router: Router) {
        this._router = router;
    }

    public convertToUtc(date: Date): Date {
        const m = moment(date);
        return moment(date).add(m.utcOffset(), 'm').utc().toDate();
    }

    public convertDateTime(date: Date) {
        const _formattedDate = new Date(date.toString());
        return _formattedDate.toDateString();
    }

    public navigate(path: string) {
        this._router.navigate([path]);
    }

    public navigateToSignIn() {
        this.navigate('/login');
    }

    public getParams() {
        const searchParams = window.location.search.split('?')[1];
        if (searchParams) {
            const paramsObj: any = {};

            searchParams.split('&').forEach(i => {
                paramsObj[i.split('=')[0]] = i.split('=')[1];
            });
            return paramsObj;
        }
        return undefined;
    }
    public readableColumnName(columnName: string): string {
        // Convert underscores to spaces
        if (typeof (columnName) === 'undefined' || columnName === undefined || columnName === null) { return columnName; }

        if (typeof (columnName) !== 'string') {
            columnName = String(columnName);
        }

        return columnName.replace(/_+/g, ' ')
            // Replace a completely all-capsed word with a first-letter-capitalized version
            .replace(/^[A-Z]+$/, (match) => {
                return ((match.charAt(0)).toUpperCase() + match.slice(1)).toLowerCase();
            })
            // Capitalize the first letter of words
            .replace(/([\w\u00C0-\u017F]+)/g, (match) => {
                return (match.charAt(0)).toUpperCase() + match.slice(1);
            })
            // Put a space in between words that have partial capilizations (i.e. 'firstName' becomes 'First Name')
            // .replace(/([A-Z]|[A-Z]\w+)([A-Z])/g, "$1 $2");
            // .replace(/(\w+?|\w)([A-Z])/g, "$1 $2");
            .replace(/(\w+?(?=[A-Z]))/g, '$1 ');
    }

    public loadStyle(link: string): Observable<any> {
        if (this.isLoadedStyle(link)) {
            return of('');
        } else {
            const head = document.getElementsByTagName('head')[0];
            // Load jquery Ui
            const styleNode = document.createElement('link');
            styleNode.rel = 'stylesheet';
            styleNode.type = 'text/css';
            styleNode.href = link;
            styleNode.media = 'all';
            head.appendChild(styleNode);
            return fromEvent(styleNode, 'load');
        }
    }
    public loadScript(script: string): Observable<any> {
        if (this.isLoadedScript(script)) {
            return of('');
        } else {
            const head = document.getElementsByTagName('head')[0];
            // Load jquery Ui
            const scriptNode = document.createElement('script');
            scriptNode.src = script;
            scriptNode.async = false;
            // scriptNode.type = 'text/javascript';
            // scriptNode.charset = 'utf-8';
            head.insertBefore(scriptNode, head.firstChild);
            return fromEvent(scriptNode, 'load');
        }
    }
    toQueryParams(obj: any): string {
        return Object.keys(obj)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
            .join('&');
    }

    public fromQueryParams(queryString: string): Object {
        const query: any = {};
        const pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i].split('=');
            query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
        }
        return query;
    }

    public formatErrors(errors: any) {
        return errors ? errors.map((err: any) => err.message).join('/n') : '';
    }

    public expandTree(tree: TreeNode[], isExpand: boolean = true) {
        tree.forEach(node => {
            this.expandRecursive(node, isExpand);
        });
    }

    public findNode(tree: TreeNode[], id: string): TreeNode {
        const found = tree.find(n => n.data.id.toString() === id);
        if (found) {
            return found;
        }
        for (const node of tree) {
            if (node.children) {
                const child = this.findNode(node.children, id);
                if (child) {
                    return child;
                }
            }
        }
        return null;
    }

    public getElementValueFromDictionary(dictionary: Array<{ key: string, value: string }>, key: string): string {
        const element = dictionary.find(x => x.key === key);
        if (element) {
            return element.value;
        }

        return '';
    }

    private expandRecursive(node: TreeNode, isExpand: boolean) {
        node.expanded = isExpand;
        if (node.children) {
            node.children.forEach(childNode => {
                this.expandRecursive(childNode, isExpand);
            });
        }
    }

    // Detect if library loaded
    private isLoadedScript(lib: string) {
        return document.querySelectorAll('[src="' + lib + '"]').length > 0;
    }

    private isLoadedStyle(lib: string) {
        return document.querySelectorAll('[href="' + lib + '"]').length > 0;
    }

    public listAvailable<T extends Identity>(allItems: Array<T>, selectedItems: Array<T>): Array<T> {
        return selectedItems ? allItems.filter(x => !selectedItems.find(y => y.id === x.id)) : allItems;
    }

    public listSelected<T extends Identity>(allItems: Array<T>, selectedItems: Array<T>): Array<T> {
        return selectedItems ? allItems.filter(x => selectedItems.find(y => y.id === x.id)) : [];
    }

    public get monthList(): Array<{ key: string, value: string }> {
        return [
            { value: 'Enero', key: '1' },
            { value: 'Febrero', key: '2' },
            { value: 'Marzo', key: '3' },
            { value: 'Abril', key: '4' },
            { value: 'Mayo', key: '5' },
            { value: 'Junio', key: '6' },
            { value: 'Julio', key: '7' },
            { value: 'Agosto', key: '8' },
            { value: 'Septiembre', key: '9' },
            { value: 'Octubre', key: '10' },
            { value: 'Noviembre', key: '11' },
            { value: 'Diciembre', key: '12' }
        ];
    }

    public get quarterList(): Array<{ key: string, value: string }> {
        return [
            { value: 'Trimestre 1', key: '1' },
            { value: 'Trimestre 2', key: '2' },
            { value: 'Trimestre 3', key: '3' },
            { value: 'Trimestre 4', key: '4' }
        ];
    }

    public get calendarSpanish(): any {
        return {
            firstDayOfWeek: 1,
            dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
            dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
            dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
            monthNames: [
                'enero',
                'febrero',
                'marzo',
                'abril',
                'mayo',
                'junio',
                'julio',
                'agosto',
                'septiembre',
                'octubre',
                'noviembre',
                'diciembre'
            ],
            monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
            today: 'Hoy',
            clear: 'Borrar'
        };
    }

    public getMockDataReport(
        startDate: Date,
        endDate: Date,
        identification: string,
        schema: string,
        indicator: string = null): Array<ICompensationResult> {
        let result = this.allDataReport().filter(x => x.filter >= startDate && x.filter <= endDate);
        if (identification && identification !== '') {
            result = result.filter(x => x.indentification.indexOf(identification) >= 0);
        }
        if (schema && schema !== '') {
            result = result.filter(x => x.indicator.replace(' ', '').toUpperCase() === schema.replace(' ', '').toUpperCase());
        }
        if (indicator && indicator !== '') {
            result = result.filter(x => x.paymentTable.replace(' ', '').toUpperCase() === indicator.replace(' ', '').toUpperCase());
        }
        return result;
    }

    public getMockDataTraceabilityReport(
        startDate: Date,
        endDate: Date,
        identification: string,
        schema: string,
        indicator: string = null): Array<ITraceabilityResult> {
        let result = this.allDataTraceability().filter(x => x.filter >= startDate && x.filter <= endDate);
        if (identification && identification !== '') {
            result = result.filter(x => x.indentification.indexOf(identification) >= 0);
        }
        if (schema && schema !== '') {
            result = result.filter(x => x.indicator.replace(' ', '').toUpperCase() === schema.replace(' ', '').toUpperCase());
        }
        if (indicator && indicator !== '') {
            result = result.filter(x => x.paymentTable.replace(' ', '').toUpperCase() === indicator.replace(' ', '').toUpperCase());
        }
        return result;
    }

    private allDataTraceability(): Array<ITraceabilityResult> {
        return [
            {
                position: 'Comercial',
                identificationType: 'Cédula de Ciudadanía',
                indentification: '54000902',
                fullName: 'Margot Osorio',
                period: 'T1',
                schema: 'P&G',
                paymentVariable: 'P&G',
                paymentTable: 'TP-P&G',
                indicator: 'Pago Trimestral',
                thresold: 0,
                valuePaid: 9849600,
                filter: new Date(2018, 6, 1)
            },
            {
                position: 'Comercial',
                identificationType: 'Cédula de Ciudadanía',
                indentification: '81279323',
                fullName: 'Rafael Donado',
                period: 'T1',
                schema: 'P&G',
                paymentVariable: 'P&G',
                paymentTable: 'TP-P&G',
                indicator: 'Pago Trimestral',
                thresold: 0,
                valuePaid: 0,
                filter: new Date(2018, 6, 1)
            },
            {
                position: 'Comercial',
                identificationType: 'Cédula de Ciudadanía',
                indentification: '54000902',
                fullName: 'Margot Osorio',
                period: 'T1',
                schema: 'Anual',
                paymentVariable: 'P&G',
                paymentTable: 'TP-P&G-Anual',
                indicator: 'Pago Anual',
                thresold: 0,
                valuePaid: 36957600,
                filter: new Date(2018, 6, 1)
            },
            {
                position: 'Comercial',
                identificationType: 'Cédula de Ciudadanía',
                indentification: '81279323',
                fullName: 'Rafael Donado',
                period: 'T1',
                schema: 'Anual',
                paymentVariable: 'P&G',
                paymentTable: 'TP-P&G-Anual',
                indicator: 'Pago Anual',
                thresold: 0,
                valuePaid: 0,
                filter: new Date(2018, 6, 1)
            },
            {
                position: 'Jefe',
                identificationType: 'Cédula de Ciudadanía',
                indentification: '49563243',
                fullName: 'Lopez Astrid',
                period: 'T1',
                schema: 'P&G Mesa',
                paymentVariable: 'Pago Trimestral Mesa',
                paymentTable: 'TP-P&G-Consolidado',
                indicator: 'Pago Trimestral Consolidado',
                thresold: 0,
                valuePaid: 9849600,
                filter: new Date(2018, 6, 1)
            }, /// April
            {
                position: 'Comercial',
                identificationType: 'Cédula de Ciudadanía',
                indentification: '54000902',
                fullName: 'Margot Osorio',
                period: 'T2',
                schema: 'P&G',
                paymentVariable: 'P&G',
                paymentTable: 'TP-P&G',
                indicator: 'Pago Trimestral',
                thresold: 0,
                valuePaid: 3369600,
                filter: new Date(2018, 3, 1)
            },
            {
                position: 'Comercial',
                identificationType: 'Cédula de Ciudadanía',
                indentification: '81279323',
                fullName: 'Rafael Donado',
                period: 'T2',
                schema: 'P&G',
                paymentVariable: 'P&G',
                paymentTable: 'TP-P&G',
                indicator: 'Pago Trimestral',
                thresold: 0,
                valuePaid: 0,
                filter: new Date(2018, 3, 1)
            },
            {
                position: 'Jefe',
                identificationType: 'Cédula de Ciudadanía',
                indentification: '49563243',
                fullName: 'Lopez Astrid',
                period: 'T2',
                schema: 'P&G Mesa',
                paymentVariable: 'Pago Trimestral Mesa',
                paymentTable: 'TP-P&G-Consolidado',
                indicator: 'Pago Trimestral Consolidado',
                thresold: 0,
                valuePaid: 3369600,
                filter: new Date(2018, 3, 1)
            }, ///Jan
            {
                position: 'Comercial',
                identificationType: 'Cédula de Ciudadanía',
                indentification: '54000902',
                fullName: 'Margot Osorio',
                period: 'T2',
                schema: 'P&G',
                paymentVariable: 'P&G',
                paymentTable: 'TP-P&G',
                indicator: 'Pago Trimestral',
                thresold: 0,
                valuePaid: 6609600,
                filter: new Date(2018, 0, 1)
            },
            {
                position: 'Comercial',
                identificationType: 'Cédula de Ciudadanía',
                indentification: '81279323',
                fullName: 'Rafael Donado',
                period: 'T2',
                schema: 'P&G',
                paymentVariable: 'P&G',
                paymentTable: 'TP-P&G',
                indicator: 'Pago Trimestral',
                thresold: 0,
                valuePaid: 0,
                filter: new Date(2018, 0, 1)
            },
            {
                position: 'Jefe',
                identificationType: 'Cédula de Ciudadanía',
                indentification: '49563243',
                fullName: 'Lopez Astrid',
                period: 'T2',
                schema: 'P&G Mesa',
                paymentVariable: 'Pago Trimestral Mesa',
                paymentTable: 'TP-P&G-Consolidado',
                indicator: 'Pago Trimestral Consolidado',
                thresold: 0,
                valuePaid: 6609600,
                filter: new Date(2018, 0, 1)
            }, /// Oct
            {
                position: 'Comercial',
                identificationType: 'Cédula de Ciudadanía',
                indentification: '54000902',
                fullName: 'Margot Osorio',
                period: 'T2',
                schema: 'P&G',
                paymentVariable: 'P&G',
                paymentTable: 'TP-P&G',
                indicator: 'Pago Trimestral',
                thresold: 0,
                valuePaid: 4809600,
                filter: new Date(2017, 9, 1)
            },
            {
                position: 'Comercial',
                identificationType: 'Cédula de Ciudadanía',
                indentification: '81279323',
                fullName: 'Rafael Donado',
                period: 'T2',
                schema: 'P&G',
                paymentVariable: 'P&G',
                paymentTable: 'TP-P&G',
                indicator: 'Pago Trimestral',
                thresold: 0,
                valuePaid: 0,
                filter: new Date(2017, 9, 1)
            },
            {
                position: 'Jefe',
                identificationType: 'Cédula de Ciudadanía',
                indentification: '49563243',
                fullName: 'Lopez Astrid',
                period: 'T2',
                schema: 'P&G Mesa',
                paymentVariable: 'Pago Trimestral Mesa',
                paymentTable: 'TP-P&G-Consolidado',
                indicator: 'Pago Trimestral Consolidado',
                thresold: 0,
                valuePaid: 4809600,
                filter: new Date(2017, 9, 1)
            },
        ];
    }

    private allDataReport(): Array<ICompensationResult> {
        return [
            {
                position: 'Comercial',
                indicator: 'P&G',
                identificationType: 'Cédula de Ciudadanía',
                indentification: '54000902',
                fullName: 'Margot Osorio',
                period: 'T1',
                valuePaid: 9849600,
                totalValue: 300000000,
                paymentTable: 'Ingreso',
                filter: new Date(2018, 6, 1)
            },
            {
                position: 'Comercial',
                indicator: 'P&G',
                identificationType: 'Cédula de Ciudadanía',
                indentification: '81279323',
                fullName: 'Rafael Donado',
                period: 'T1',
                valuePaid: 0,
                totalValue: 60000000,
                paymentTable: 'Ingreso',
                filter: new Date(2018, 6, 1)
            },
            {
                position: 'Comercial',
                indicator: 'Anual',
                identificationType: 'Cédula de Ciudadanía',
                indentification: '54000902',
                fullName: 'Margot Osorio',
                period: 'T1',
                valuePaid: 36957600,
                totalValue: 995000000,
                paymentTable: 'Ingreso',
                filter: new Date(2018, 6, 1)
            },
            {
                position: 'Comercial',
                indicator: 'Anual',
                identificationType: 'Cédula de Ciudadanía',
                indentification: '81279323',
                fullName: 'Rafael Donado',
                period: 'T1',
                valuePaid: 0,
                totalValue: 551000000,
                paymentTable: 'Ingreso',
                filter: new Date(2018, 6, 1)
            },
            {
                position: 'Jefe',
                indicator: 'P&G Mesa',
                identificationType: 'Cédula de Ciudadanía',
                indentification: '49563243',
                fullName: 'Lopez Astrid',
                period: 'T1',
                valuePaid: 9849600,
                totalValue: 300000000,
                paymentTable: 'Ingreso',
                filter: new Date(2018, 6, 1)
            },
            {
                position: 'Comercial',
                indicator: 'P&G',
                identificationType: 'Cédula de Ciudadanía',
                indentification: '54000902',
                fullName: 'Margot Osorio',
                period: 'T2',
                valuePaid: 3369600,
                totalValue: 510000000,
                paymentTable: 'Ingreso',
                filter: new Date(2018, 3, 1)
            },
            {
                position: 'Comercial',
                indicator: 'P&G',
                identificationType: 'Cédula de Ciudadanía',
                indentification: '81279323',
                fullName: 'Rafael Donado',
                period: 'T2',
                valuePaid: 0,
                totalValue: 0,
                paymentTable: 'Ingreso',
                filter: new Date(2018, 3, 1)
            },
            {
                position: 'Jefe',
                indicator: 'P&G Mesa',
                identificationType: 'Cédula de Ciudadanía',
                indentification: '49563243',
                fullName: 'Lopez Astrid',
                period: 'T2',
                valuePaid: 3369600,
                totalValue: 510000000,
                paymentTable: 'Ingreso',
                filter: new Date(2018, 3, 1)
            },
            {
                position: 'Comercial',
                indicator: 'P&G',
                identificationType: 'Cédula de Ciudadanía',
                indentification: '54000902',
                fullName: 'Margot Osorio',
                period: 'T2',
                valuePaid: 6609600,
                totalValue: 765000000,
                paymentTable: 'Ingreso',
                filter: new Date(2018, 0, 1)
            },
            {
                position: 'Comercial',
                indicator: 'P&G',
                identificationType: 'Cédula de Ciudadanía',
                indentification: '81279323',
                fullName: 'Rafael Donado',
                period: 'T2',
                valuePaid: 0,
                totalValue: 321000000,
                paymentTable: 'Ingreso',
                filter: new Date(2018, 0, 1)
            },
            {
                position: 'Jefe',
                indicator: 'P&G Mesa',
                identificationType: 'Cédula de Ciudadanía',
                indentification: '49563243',
                fullName: 'Lopez Astrid',
                period: 'T2',
                valuePaid: 6609600,
                totalValue: 765000000,
                paymentTable: 'Ingreso',
                filter: new Date(2018, 0, 1)
            },
            {
                position: 'Comercial',
                indicator: 'P&G',
                identificationType: 'Cédula de Ciudadanía',
                indentification: '54000902',
                fullName: 'Margot Osorio',
                period: 'T2',
                valuePaid: 4809600,
                totalValue: 995000000,
                paymentTable: 'Ingreso',
                filter: new Date(2017, 9, 1)
            },
            {
                position: 'Comercial',
                indicator: 'P&G',
                identificationType: 'Cédula de Ciudadanía',
                indentification: '81279323',
                fullName: 'Rafael Donado',
                period: 'T2',
                valuePaid: 0,
                totalValue: 551000000,
                paymentTable: 'Ingreso',
                filter: new Date(2017, 9, 1)
            },
            {
                position: 'Jefe',
                indicator: 'P&G Mesa',
                identificationType: 'Cédula de Ciudadanía',
                indentification: '49563243',
                fullName: 'Lopez Astrid',
                period: 'T2',
                valuePaid: 4809600,
                totalValue: 995000000,
                paymentTable: 'Ingreso',
                filter: new Date(2017, 9, 1)
            },
        ];
    }
}
