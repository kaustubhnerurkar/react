import React, { Component } from 'react';
import axios from "../node_modules/axios/dist/axios.js"
import './App.css';

class App extends Component {
  state={
    cards:[]
  }

  addNewCard=(cardInfo)=>{
    this.setState(prevState=>({
      cards:prevState.cards.concat(cardInfo)
    }))
  }

  render() {
    return (
      <div className="App">
        <Form onSubmit={this.addNewCard}/>
        <CardList cards={this.state.cards}/>
      </div>
    );
  }
}

class Form extends React.Component{
state={
  userName:''
}

  handleSubmit=(event)=>{
    event.preventDefault();
    axios.get(`https://api.github.com/users/${this.state.userName}`).then((resp)=>{
      this.props.onSubmit(resp.data);
    });
  }

  render(){
    return(
      <form onSubmit={this.handleSubmit}>
        <input value={this.state.userName} onChange={(event)=>this.setState({userName:event.target.value})} type="text" placeholder="Enter Git Username"/>
        <button type="submit">Add</button>
      </form>
    );
  }
}

const Card = (props) => {
  return (
    <div style={{ margin: '1em' }}>
      <img width="75" src={props.avatar_url} alt="human" />
      <div style={{ display: 'inline-block', marginLeft: 15, marginTop: '15px' }}>
        <div style={{ fontSize: '1.25em', fontWeight: 'bold' }}>{props.name}</div>
        <div>{props.company}</div>
      </div>
    </div>
  );
}

const CardList = (props) => {
  return (
    <div>
      {props.cards.map(card=><Card {...card} />)}
    </div>
  );
}

export default App;
