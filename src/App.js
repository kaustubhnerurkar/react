import React, { Component } from 'react';
import './App.css';


//lodash lib
var _ = require('lodash');

class App extends Component {
  render() {
    return (
      <div className="App">
        <Game />
      </div>
    );
  }
}

var possibleCombinationSum = function(arr, n) {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length, combinationsCount = (1 << listSize)
  for (var i = 1; i < combinationsCount ; i++ ) {
    var combinationSum = 0;
    for (var j=0 ; j < listSize ; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum) { return true; }
  }
  return false;
};

class Game extends Component {
  static randomNumber = () => 1 + Math.floor(Math.random() * 9);
  static initialState=()=>({
    selectedNumbers: [],
    usedNumbers: [],
    randomNumberOfStars: Game.randomNumber(),
    answerIsCorrect: null,
    redraws: 5,
    doneStatus: null
  })


  state = Game.initialState();

  resetGame=()=> this.setState(Game.initialState());

  selectNumber = (clickedNumber) => {
    //console.log(this.state.selectedNumbers.indexOf(clickedNumber) >= 0, this.state.usedNumbers.indexOf(clickedNumber)>=0);
    if ((this.state.selectedNumbers.indexOf(clickedNumber)>=0) || (this.state.usedNumbers.indexOf(clickedNumber)>=0)) {
      return;
    }
    this.setState(prevState => ({
      selectedNumbers: prevState.selectedNumbers.concat(clickedNumber),
      answerIsCorrect: null
    }));
    
  };

  unselectNumber = (clickedNumber) => {
    // if(this.state.selectedNumbers.indexOf(clickedNumber)>=0) return;
    this.setState(prevState => ({
      selectedNumbers: prevState.selectedNumbers.filter(number => number !== clickedNumber),
      answerIsCorrect: null
    }));
  };

  checkAnswer = () => {
    this.setState(prevState => ({
      answerIsCorrect: prevState.randomNumberOfStars === prevState.selectedNumbers.reduce((acc, n) => acc + n, 0)
    }));
  }

  acceptAnswer = () => {
    this.setState(prevState => ({
      usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
      selectedNumbers: [],
      answerIsCorrect: null,
      randomNumberOfStars: Game.randomNumber()
    }), this.updateDoneStatus);
  }

  redraw = () => {
    if (this.state.redraws === 0) return;
    this.setState(prevState => ({
      selectedNumbers: [],
      answerIsCorrect: null,
      randomNumberOfStars: Game.randomNumber(),
      redraws: prevState.redraws - 1
    }),this.updateDoneStatus);
  }

   possibleSolutions=({randomNumberOfStars,usedNumbers})=>{
    const possibleNumbers=_.range(1,10).filter(number=>
    usedNumbers.indexOf(number)===-1);

      return possibleCombinationSum(possibleNumbers,randomNumberOfStars);
  }

  updateDoneStatus=()=>{
    this.setState(prevState=>{
      if(prevState.usedNumbers.length===9){
        return { doneStatus:'Done, Nice!'};
      }
      if(prevState.redraws===0 && !this.possibleSolutions(prevState)){
        return {doneStatus:'Game Over!'};
      }
    });
  }

  render() {
    const { selectedNumbers, randomNumberOfStars, answerIsCorrect, usedNumbers, redraws, doneStatus } = this.state;
    return (
      <div className="container">
        <h1>Play Nine</h1>
        <hr />
        <div className="row">
          <Stars numberOfStars={randomNumberOfStars} />
          <Button redraws={redraws} redraw={this.redraw} answerIsCorrect={answerIsCorrect} acceptAnswer={this.acceptAnswer} checkAnswer={this.checkAnswer} selectedNumbers={selectedNumbers} />
          <Answer selectedNumbers={selectedNumbers} unselectNumber={this.unselectNumber} />
        </div>
        <br />
        {doneStatus ?
          <DoneFrame resetGame={this.resetGame} doneStatus={doneStatus} /> :
          <Numbers selectNumber={this.selectNumber} selectedNumbers={selectedNumbers} usedNumbers={usedNumbers} />
        }
      </div>
    );
  }
}

const DoneFrame = (props) => {
  return (
    <div className="text-center">
      <h2>{props.doneStatus}</h2>
      <button className="btn btn-secondary" onClick={props.resetGame}>Play Again</button>
    </div>
  );
}

const Stars = (props) => {
  return (
    <div className="col-md-5">
      {_.range(props.numberOfStars).map(i =>
        <i key={i} className="fa fa-star"></i>
      )}
    </div>
  );
}

const Button = (props) => {
  let button;
  switch (props.answerIsCorrect) {
    case true:
      button = <button className="btn btn-success" onClick={props.acceptAnswer}><i className="fa fa-check"></i></button>;
      break;

    case false:
      button = <button className="btn btn-danger"><i className="fa fa-times"></i></button>;
      break;

    default:
      button = <button className="btn" onClick={props.checkAnswer} disabled={props.selectedNumbers.length === 0}>=</button>;
      break;
  }
  return (
    <div className="col-md-2">
      {button}
      <br /><br />
      <button className="btn btn-warning btn-sm" onClick={props.redraw} disabled={props.redraws === 0}>
        <i className="fa fa-refresh">{props.redraws}</i>
      </button>
    </div>
  );
}

const Answer = (props) => {
  return (
    <div className="col-md-5">
      {props.selectedNumbers.map((number, i) =>
        <span key={i} onClick={() => props.unselectNumber(number)}>{number}</span>
      )}
    </div>
  );
}

const Numbers = (props) => {

  const numberClassName = (number) => {
    if (props.usedNumbers.indexOf(number) >= 0) {
      return 'used';
    }
    if (props.selectedNumbers.indexOf(number) >= 0) {
      return 'selected';
    }
  }

  return (
    <div className="card text-center">
      <div>
        {
          Numbers.list.map((number, i) =>
            <span key={i} className={numberClassName(number)} onClick={() => props.selectNumber(number)}>{number}</span>
          )}
      </div>
    </div>
  );
}

//lodash library (_range thing)
Numbers.list = _.range(1, 10);

export default App;
