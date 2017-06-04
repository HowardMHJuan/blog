import React, { Component } from 'react';
import Reply from './Reply';
import './Comment.css';
import CKEditor from './CKEditor';
import ReactHtmlParser from 'html-react-parser';

class Comment extends Component {
  constructor() {
    super();
    this.state = {
      displayReply: false,
      replyContent: '',
      replies: [],
      fetched: false,
    };
  }
  handleInputChange = (value) => {
    this.setState({replyContent: value});
  }
  handleSend = () => {
    if(this.props.login === false) {
      this.props.Materialize.toast('Please login first', 4000);
    } else if(this.state.replyContent.trim().length === 0) {
      this.props.Materialize.toast('Reply cannot be blank', 4000);
    } else {
      const reply = {
        name: this.props.loginName,
        time: new Date(),
        content: this.state.replyContent,
      };
      let replies = this.state.replies;
      replies.push(reply);
      this.props.addReply(this.props.commentId, reply);
      this.setState({replyContent: '', replies: replies});
      this.toggleReply(true);
    }
  }
  getTime = () => {
    const time = new Date(this.props.time);
    const year = time.getFullYear();
    const month = time.getMonth() + 1;
    const date = time.getDate();
    const hour = (`0${time.getHours()}`).slice(-2);
    const minute = (`0${time.getMinutes()}`).slice(-2);
    return `posted at ${year}/${month}/${date} ${hour}:${minute}`;
  }
  toggleReply = (f) => {
    if(this.state.displayReply === false){
      this.setState({
        displayReply: true,
      });
    } else if(f === true || this.state.replyContent === '') {
      this.setState({
        displayReply: false,
      });
    }
  }
  handleReply = () => {
    if(this.state.displayReply === true) {
      return (
        <form className="col s12">
          <div className="input-field col s11 offset-s1 m7 offset-m3 l5 offset-l4">
            {
            //   <textarea 
            //   id="reply"
            //   className="materialize-textarea"
            //   type="text"
            //   value={this.state.replyContent} 
            //   onChange={this.handleInputChange}
            //   onBlur={this.toggleReply}
            //   autoFocus
            // />
            // <label htmlFor="reply">Type some reply...</label>
            }
            <CKEditor id={this.props.commentId} onChange={this.handleInputChange} CKEDITOR={this.props.CKEDITOR} onBlur={this.toggleReply} autoFocus={true}/>
          </div>
          <a className="waves-effect waves-teal btn-flat col s12 m2 l1" onClick={this.handleSend}>Reply</a>
        </form>
      );
    } else {
      return (
        <div className="col s12">
          <a className="waves-effect waves-teal btn-flat col s12 m2 offset-m3 l1 offset-l4" onClick={this.toggleReply}>Reply</a>
        </div>
      );
    }
  }
  fetchReply = () => {
    if(this.state.fetched === false) {
      fetch(`/api/post/${this.props.commentId}`)
        .then(this.catchStatus)
        .then(response => response.json())
        .then((data) => {
          // console.log(data);
          this.setState({replies: data, fetched: true});
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }
  handleClick = () => {
    this.props.onClick(this.props.commentId);
  }
  render = () => {
    return (
      <div className="Comment">
        <div className="row comment-name" onClick={this.handleClick}>
          <p className="col l2 offset-l3 m3 offset-m2 s5 offset-s1" id="comment-name">{this.props.name}</p>
          <p className="col l3 m4 s6" id="comment-time">{this.getTime()}</p>
        </div>
        <div className="row comment-content" onClick={this.handleClick}>
          <div className="col l6 offset-l3 m8 offset-m2 s11 offset-s1" id="comment-content">{ReactHtmlParser(this.props.content)}</div>
        </div>
        {this.props.single === true ? this.fetchReply() : null}
        {
          this.props.single === true ?
            this.state.replies.map((reply) => <Reply 
              key={reply.time}
              name={reply.name}
              time={reply.time}
              content={reply.content}
            />)
            : null
        }
        {
          this.props.single === true ?
            <div className="row">
              {this.handleReply()}
            </div>
            : null
        }
      </div>
    );
  }
}

export default Comment;
