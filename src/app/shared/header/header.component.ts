import { ResultsService } from './../services/results.service';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit , OnDestroy{
  totalTime:number;
  resultTime:number;
  Interval:any;
  intervalResult:any;

  private destroyActu$=new Subject<any>();
  private destroystateGame$=new Subject<any>();
  @Output() timeExceeded = new EventEmitter();
  @Output() timeLevelExceeded = new EventEmitter();
  @Input() levelAct;
  onTimeExceeded(fin) {
    console.log("Evento");
    this.timeExceeded.emit(fin);
  }

  onTimeLevelExceeded(fin) {
    console.log("Evento");
    this.timeLevelExceeded.emit(fin);
  }
  constructor(public _result:ResultsService  ) { }

  ngOnInit(): void {

    this._result.detectChanges$
    .pipe(takeUntil(this.destroyActu$))
    .subscribe((val)=>{
      (val==true)? this._result.rightAnswers++:this._result.wrongAnswers++;
      this.resultTime=6 - this.levelAct;
    })

    this._result.startGame$
    .pipe(takeUntil(this.destroystateGame$))
    .subscribe((val)=>{
      if(val==true){
        this.levelAct=1;
        this.totalTime=60;
        this.resultTime=5;
        //Subject start a true
        this._result.rightAnswers=0;
        this._result.wrongAnswers=0;
        this.getLevelTime();
        this.getResultTime();
      }
    })
  }

  getResultTime(){
    this.intervalResult=setInterval( ()=>{
      this.resultTime=this.resultTime-1
      if (this.resultTime==0){
        this.onTimeExceeded(true)
        this.resultTime=6 - this.levelAct;
        if (this.totalTime==0){
          clearInterval(this.intervalResult);
        }
      }
    },1000);
  }

  getLevelTime(){
    this.Interval=setInterval( ()=>{
      this.totalTime=this.totalTime-1
      if (this.totalTime==0){
        this.onTimeLevelExceeded(true)
        clearInterval(this.Interval);
      }
    },1000);
  }

  ngOnDestroy(){
    this.destroyActu$.next({});
    this.destroyActu$.complete();
    this.destroystateGame$.next({});
    this.destroystateGame$.complete();
  }
}
