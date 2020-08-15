import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

@Component({
    templateUrl: './user.component.html'
})
export class UserComponent {
    public nCluster: string = "0";
    public maxIterate: string = "0";
    public tolerance: string = "0";
    public randomState: string = "0";
    public trainFile: File;
    public testFile: File;
    public fileName: string = "";
    public Loading: boolean = false;
    public PredicatedData: any = [];
    public currentPage: number = 0;
    public endPage: number = 0;
    public totalRecordSize: number = 0;
    public itemPerPage: number = 0;
    public itemPerPageSelected: string = "";
    public perPages: any = [{pageSize:5},{pageSize:10},{pageSize:15}];
    public totalRecord: any = [];
    public PredicatedColumns: any = [];
    constructor(public title: Title, public http: HttpClient) {
        this.title.setTitle("User | Dynamic Preventative Maintenance");

        this.trainFile = JSON.parse(localStorage.getItem("train_file"));
        console.log(JSON.stringify(this.trainFile));
        this.nCluster = localStorage.getItem("nCluster");
        this.maxIterate = localStorage.getItem("maxIterate");
        this.tolerance = localStorage.getItem("tolerance");
        this.randomState = localStorage.getItem("randomState");
        this.itemPerPageSelected = this.perPages[0].pageSize;
       
    }
    fileTrainChange(event) {
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            this.trainFile = fileList[0];
            this.fileName = this.trainFile.name;
            // this.Submit();
        }
    }
    fileTestChange(event) {
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            this.testFile = fileList[0];
            this.fileName = this.testFile.name;
           // this.Submit();
        }
    }
    Submit() {
        if (this.testFile != undefined) {
            let formData = new FormData();
            console.log(JSON.stringify(this.trainFile));
            formData.append('trainFile', this.trainFile);
            formData.append('testFile', this.testFile);

            this.Loading = true;
            this.http.post('/Predicted?n_clusters=' + this.nCluster + '&iterate=' + this.maxIterate + '&tolerance=' + this.tolerance + '&random_state=' + this.randomState, formData, { responseType: 'json' })
                .subscribe((res: any) => {
                    console.log(res);
                    this.PredicatedColumns = res[0];
                    this.totalRecord = res[1];
                    this.endPage = parseInt(this.itemPerPageSelected);
                    this.totalRecordSize = this.totalRecord.length;
                    this.PredicatedData = this.totalRecord.slice(0, this.endPage);
                    this.SelectItemPer(this.itemPerPageSelected);
                    this.Loading = false;
                }, err => {
                    alert(err);
                })
        } else {
            alert("Kindly Select Cluster, Iterate and File");
        }
    }

    SelectItemPer(value) {
        this.currentPage = 0;
        this.endPage = parseInt(value);
        this.PredicatedData = this.totalRecord.slice(this.currentPage, this.endPage)
    }
    next() {
        this.currentPage = this.endPage;
        this.endPage += parseInt(this.itemPerPageSelected);
        let records = this.totalRecord.slice(this.currentPage, this.endPage);
        this.PredicatedData = records
    }

    previous() {
        this.currentPage -= parseInt(this.itemPerPageSelected);
        this.endPage -= parseInt(this.itemPerPageSelected);
        let records = this.totalRecord.slice(this.currentPage, this.endPage);
        this.PredicatedData = records
    }

}