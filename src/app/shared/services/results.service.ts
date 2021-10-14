import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {
  private detectChanges =new BehaviorSubject<boolean>(true);
  private stateGame =new BehaviorSubject<boolean>(false);
  wrongAnswers:number;
  rightAnswers:number;
  errorsOper:number[]=[];

  get detectChanges$(): Observable<boolean>{
    return this.detectChanges.asObservable();
  }

  get startGame$(): Observable<boolean>{
    return this.stateGame.asObservable();
  }

  resultCorret(){
    this.detectChanges.next(true)
  }
  resultWrong(numeroOne,numberTwo){
    this.errorsOper.push(numeroOne,numberTwo)
    this.detectChanges.next(false)
  }
  startGame(){
    this.stateGame.next(true)
  }
  stopGame(){
    this.stateGame.next(false)
  }

  constructor() { }
}
