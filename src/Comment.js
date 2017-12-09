import React, { Component } from 'react';

export default class Comment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            input:this.props.children
        };
        this.handleChange=this.handleChange.bind(this);
    }

    edit() {
        this.setState({
            editing: true
        })
    }

    delete() {
        this.props.delete(this.props.index);
    }

    save() {
        this.props.update(this.state.input,this.props.index);
        this.setState({
            editing: false
        })
    }

    handleChange(event) {
        this.setState({ input: event.target.value });
       // console.log(this.state.input);
    }

    renderNormal() {
        return (
            <div id="comment_container">
                <div id="comment_txt">{this.props.children}</div>
                <button onClick={() => this.edit()}>Edit</button>
                <button onClick={() => this.delete()}>Delete</button>
            </div>
        );
    }

    renderForm() {
        return (
            <div id="comment_container">
                <textarea id="comment_txt" onChange={this.handleChange} defaultValue={this.props.children}></textarea>
                <button onClick={() => this.save()}>Save</button>
            </div>
        );
    }

    render() {
        if (this.state.editing){
            return this.renderForm();
        }
        else{
            return this.renderNormal();
        }
    }
}