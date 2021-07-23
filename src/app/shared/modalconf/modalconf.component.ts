import { Component, Inject, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-modalconf',
  templateUrl: './modalconf.component.html',
  styleUrls: ['./modalconf.component.css']
})
export class ModalconfComponent implements OnInit {
  public level:number;
  type:string;
  constructor(  public _dialogRef: MatDialogRef<ModalconfComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.type=this.data?.type;
  }

  getLevel(){
    this.data.levelact=this.level;
    this.close();
  }
  close() {
    this._dialogRef.close({level:this.level,type:this.type});
  }
}
