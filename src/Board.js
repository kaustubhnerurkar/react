import React, { Component } from 'react';
import Comment from './Comment.js';

export default class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [
                'Comment-1',
                'Comment-2',
                'Comment-3'
            ]
        };
        this.removeComment=this.removeComment.bind(this);
        this.updateComment=this.updateComment.bind(this);
        this.addComment=this.addComment.bind(this);
        //console.log(this.state.comments);
    }

    addComment(){
        const current=this.state.comments;
        current.push(this.state.input);
        this.setState({
            comments:current
        })
    }

    removeComment(index){
        const current=this.state.comments;
        current.splice(index,1);
        this.setState({
            comments:current
        })
    }

    updateComment(newText, index){
        const current=this.state.comments;
        current[index]=newText;
        this.setState({
            comments:current
        }) 
    }

    handleValChange(value){
            this.setState({ input: value });
    }

    render(){
        return(
            <div id="comment_container">
                <textarea  onChange={(e) => this.handleValChange(e.target.value)}></textarea>
                <button onClick={this.addComment}>Add</button>
                {this.state.comments.map((text,i)=>{
                    return (<Comment key={i} index={i} update={this.updateComment} delete={this.removeComment}>{text}</Comment>)
                })}
            </div>
        );
    }
}