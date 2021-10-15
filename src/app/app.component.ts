import { ResultsService } from './shared/services/results.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalconfComponent } from './shared/modalconf/modalconf.component';
import { multiplicar } from './multiplicar';
import { Component, OnDestroy, OnInit } from '@angular/core';

interface ErrorsData{
  num: number,
  tot: number
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,OnDestroy{
  title = 'multiprim';
  level:1;
  multiplicacion:any;
  numCenterFirst:number;
  numCenterSecond:number;
  num=[1,2,3,4,5,6,7,8,9,10,11,12];
  styleA=['btop','bleft','bright','bbotom','bbottomsec','btopsec','brightsec','bleftsec','bleftthird','btopthird','brightthird','bbottomthird'];
  result:number;
  resultString: string;
  colorResult:string;
  errorTable:ErrorsData[]=[{num:0,tot:0}];

  constructor(public dialog: MatDialog,
              private _result:ResultsService) {}

  ngOnInit(){
    this.openDialogConf();
  }

  openDialogConf(): void {
    const dialogRef = this.dialog.open(ModalconfComponent, {
      width: '250px',
      disableClose: true,
      data: {title:'Choose level',type:'conf',levelact:this.level}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.level = result.level;
      if (result.level.type=='level'){
        this.ngOnInit();
      }else if (result.type=='conf'){
        this.newOperation();
        this._result.startGame();
      }

    });
  }

  newOperation(){
    this.multiplicacion=new multiplicar();
    this.numCenterFirst=this.multiplicacion.dameNumero(1,10);
    this.numCenterSecond=this.multiplicacion.dameNumero(1,10);
    //Result
    this.result=this.numCenterFirst*this.numCenterSecond;
    this.num.length=0;
    //add or subract a number from the result
    for(let i=0;i<this.level*4;i++){
      this.num.push(this.result +this.multiplicacion.dameNumero(-10,10))
    }
    //Result in one of then
    this.num[this.multiplicacion.dameNumero(0,(4*this.level)-1)]=this.result;
  }

  setTimeExceed(evento){
    if (evento==true){
      this._result.resultWrong(this.numCenterFirst,this.numCenterSecond);
      this.newOperation();
    }
  }

  setTimeLevelExceed(evento){
    if (evento==true){
      this._result.stopGame();
      this.giveMeResult();
      const dialogRefResult = this.dialog.open(ModalconfComponent, {
        width: '250px',
        height: (240 + this.errorTable.length * 20) + 'px',
        disableClose: true,
        data: {errorTable: this.errorTable,title:'Result',type: 'result',level:this.level,right:this._result.rightAnswers,wrong:this._result.wrongAnswers,result:this.resultString,color:this.colorResult}
      });

      dialogRefResult.afterClosed().subscribe(result => {
        this._result.errorsOper=[];
        this.ngOnInit();
      });
    }

  }
    evalResult(numberEval:number){
      if (this.result==numberEval){
        this._result.resultCorret();
      }else{
        this._result.errorsOper.push(this.numCenterFirst,this.numCenterSecond)
        this._result.resultWrong(this.numCenterFirst,this.numCenterSecond);
      }
      this.newOperation();
    }

    giveMeResult(){
      this.errorTable=[];
      //Group by num
      this._result.errorsOper.forEach((data)=>{
        this.errorTable.find(element=>element.num==data)==undefined? this.errorTable.push({num:data,tot:1}):this.errorTable[this.errorTable.findIndex((item) => item.num==data)]['tot']+=1
      })
      //Sort by num
      this.errorTable.sort((item,item2)=>{
        if(item.num>item2.num) return 1
        if(item.num<item2.num) return -1
        return 0
      })
      if(this._result.rightAnswers>24 && this._result.wrongAnswers<1){
        this.resultString= "Good Work"
        this.colorResult="green";
      }else if(this._result.rightAnswers>15 && this._result.wrongAnswers<4){
        this.resultString= "Excellent Work"
        this.colorResult="lime";
      }else{
        if (this._result.wrongAnswers>6){
          this.resultString= "Bad Work - Too many errors"
          this.colorResult="red";
        }else{
          this.resultString= "Bad Work - Too slowly"
          this.colorResult="red";
        }
      }
    }

  ngOnDestroy():void{


  }

}
