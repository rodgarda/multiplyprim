import { ResultsService } from './shared/services/results.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalconfComponent } from './shared/modalconf/modalconf.component';
import { multiplicar } from './multiplicar';
import { Component, OnDestroy, OnInit } from '@angular/core';



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

  constructor(public dialog: MatDialog,
              private _result:ResultsService) {}

  ngOnInit(){
    this.openDialogConf();
  }

  openDialogConf(): void {
    const dialogRef = this.dialog.open(ModalconfComponent, {
      width: '250px',
      data: {title:'Choose level',type:'conf',levelact:this.level}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      this.level = result.level;
      if (result.level.type=='level'){
        this.ngOnInit();
      }else if (result.type=='conf'){
        this.generaOperacion();
        this._result.startGame();
      }

    });
  }


  generaOperacion(){
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
      //this.generaOperacion();
      this._result.resultWrong();
      this.generaOperacion();
    }
  }

  setTimeLevelExceed(evento){
    if (evento==true){
      this._result.stopGame();
      this.giveMeResult();
      console.log("ACABO EL TIEMPO");
      const dialogRefResult = this.dialog.open(ModalconfComponent, {
        width: '250px',
        data: {title:'Result',type: 'result',level:this.level,right:this._result.rightAnswers,wrong:this._result.wrongAnswers,result:this.resultString,color:this.colorResult}
      });

      dialogRefResult.afterClosed().subscribe(result => {
        this.ngOnInit();
      });
    }

  }
    evalResult(numberEval:number){
      if (this.result==numberEval){
        this._result.resultCorret();
      }else{
        this._result.resultWrong();
      }
      this.generaOperacion();
    }

    giveMeResult(){
      if(this._result.rightAnswers>10){
        this.resultString= "Excellent Work"
        this.colorResult="green";
      }else{
        this.resultString= "Bad Work"
        this.colorResult="red";
      }
    }

      //this._result.resultCorret
     /* this._result.detectChanges$
      .pipe(takeUntil(this.destroyActu$))
      .subscribe((val)=>{
        if(val==true){
          this.ngOnInit();
        }
      })*/

  ngOnDestroy():void{


  }

}
