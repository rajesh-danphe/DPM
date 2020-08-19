import { Component, ChangeDetectorRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import * as xlsx from 'xlsx'
import * as moment from 'moment';
@Component({
    templateUrl: './admin.component.html'
})
export class AdminComponent {

    public centroids: any = [];
    public columns: any = [];
    public nCluster: number = 0;
    public maxIterate: number = 0;
    public tolerance: number = 0;
    public randomState: number = 0;
    public file: File;
    public fileName: string = "";
    public Loading: boolean = false;
    public currentPage: number = 0;
    public endPage: number = 0;
    public totalRecordSize: number = 0;
    public itemPerPage: number = 0;
    public itemPerPageSelected: string = "";
    public perPages: any = [{ pageSize: 5 }, { pageSize: 10 }, { pageSize: 15 }];
    public totalRecord: any = [];
    public CentroidColumns: any = [];
    constructor(public title: Title,
        public http: HttpClient,
        public changeDetectorRef:ChangeDetectorRef) {
        this.title.setTitle("Admin | Dynamic Preventative Maintenance")
        this.itemPerPageSelected = this.perPages[0].pageSize;
    }

    fileChange(event) {
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            this.file = fileList[0];
            this.fileName = this.file.name;
            // this.Submit();
        }
    }

    Submit() {
        if (this.file != undefined && this.nCluster != 0 && this.maxIterate != 0) {
            let formData = new FormData();
            formData.append('uploadFile', this.file);
            console.log(this.file);
            let obj = new Object();
            obj['lastModified'] = this.file.lastModified;
            obj['name'] = this.file.name;
            obj['size'] = this.file.size;
            obj['type'] = this.file.type;

            localStorage.setItem("train_file", JSON.stringify(obj));
            localStorage.setItem("nCluster", this.nCluster.toString());
            localStorage.setItem("maxIterate", this.maxIterate.toString());
            localStorage.setItem("tolerance", this.tolerance.toString());
            localStorage.setItem("randomState", this.randomState.toString());
            this.Loading = true;
            this.http.post('/Centroids?n_clusters=' + this.nCluster + '&iterate=' + this.maxIterate + '&tolerance=' + this.tolerance + '&random_state=' + this.randomState, formData, { responseType: 'json' })
                .subscribe((res: any) => {
                    console.log(res);
                    this.CentroidColumns = res[0];
                    this.totalRecord = res[1];
                    this.Loading = false;
                }, err => {
                    alert(err);
                })
        } else {
            alert("Kindly Select Cluster, Iterate and File");
        }
    }
    AdminSelectRecords(event) {
        this.centroids = event;
        this.changeDetectorRef.detectChanges();
    }
    exportCSV() {
        if (this.centroids.length > 0) {
            var content = '';
            content +=
                '<tr>'
            this.CentroidColumns.forEach(header => {
                content += '<th>' + header + '</th>'
            });
            content += '</tr>';
            this.totalRecord.forEach(data => {
                content += '<tr>'
                this.CentroidColumns.forEach(col => {
                    content += '<td>' + data[col] + '</td>'
                });
                content += '</tr>'
            });

            var s = document.createElement("table");
            s.innerHTML = content;

            const ws: xlsx.WorkSheet = xlsx.utils.table_to_sheet(s);
            const wb: xlsx.WorkBook = xlsx.utils.book_new();

            xlsx.utils.book_append_sheet(wb, ws, 'Train_Data');
            xlsx.writeFile(wb, 'Train_Data' + moment().format('DD-MMM-YYYY') + '.csv');

        } else {
            alert("you haven't selected the train file.")
        }
    }

}