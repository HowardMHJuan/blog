import React, { Component } from 'react';
import 'babel-polyfill';
import fetch from 'isomorphic-fetch';
import Comment from './Comment';
import './CommentContainer.css';
import CKEditor from './CKEditor';

class CommentContainer extends Component {
  constructor() {
    super();
    this.state = {
      comments: [],
      commentContent: '',
      single: false,
      singleID: 0,
    };
  }
  catchStatus = (response) => {
    if (response.ok) {
      return response;
    } else {
      let error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  }
  componentWillMount = () => {
    fetch('/api/posts')
      .then(this.catchStatus)
      .then(response => response.json())
      .then((data) => {
        // console.log(data);
        this.setState({comments: data});
      })
      .catch((error) => {
        console.error(error);
      });
  }
  handleInputChange = (value) => {
    this.setState({commentContent: value});
  }
  addComment = () => {
    let comments = this.state.comments;
    const comment = {
      name: this.props.name,
      time: new Date(),
      content: this.state.commentContent,
      postID: comments.length,
      replies: [],
    };
    comments.push(comment);
    this.setState({
      comments: comments,
      commentContent: '',      
    })
    fetch('/api/posts', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(comment),
    });
  }
  addReply = (commentId, replyContent) => {
    const reply = {
      name: this.props.name,
      time: new Date(),
      content: replyContent,
    };
    // let comments = this.state.comments;
    // comments[commentId].replies.push(reply);
    // this.setState({
    //   comments: comments,
    // })
    fetch(`/api/post/${commentId}`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reply),
    });
  }
  handleSend = () => {
    if(this.props.login === false) {
      this.props.Materialize.toast('Please login first', 4000);
    } else if(this.state.commentContent.trim().length === 0) {
      this.props.Materialize.toast('Comment cannot be blank', 4000);
    } else {
      this.addComment();
    }
  }
  handleClick = (ID) => {
    this.setState({single: true, singleID: ID});
  }
  displayComment = () => {
    if(this.state.single === true) {
      const comment = this.state.comments[this.state.singleID];
      return (
        <Comment
          commentId={this.state.singleID}
          key={this.state.singleID}
          name={comment.name}
          time={comment.time}
          content={comment.content}
          replies={comment.replies}
          addReply={this.addReply}
          CKEDITOR={this.props.CKEDITOR}
          Materialize={this.props.Materialize}
          login={this.props.login}
          onClick={this.handleClick}
          single={true}
        />
      );
    } else {
      return this.state.comments.map((comment, i) =>
        <Comment 
          commentId={i}
          key={i}
          name={comment.name}
          time={comment.time}
          content={comment.content}
          replies={comment.replies}
          addReply={this.addReply}
          CKEDITOR={this.props.CKEDITOR} 
          Materialize={this.props.Materialize}
          login={this.props.login}
          onClick={this.handleClick}
        />
      );
    }
  }
  handleHome = () => {
    this.setState({single: false});
  }
  render = () => {
    return (
      <div className="CommentContainer">
        {
          this.state.single === true ? null :
            <div className="row">
              <form className="col s12">
                <div className="input-field col s12 m8 offset-m2 l6 offset-l3">
                  {
                  // <textarea 
                  //   id="comment"
                  //   className="materialize-textarea"
                  //   type="text"
                  //   value={this.state.commentContent} 
                  //   onChange={this.handleInputChange}
                  // />
                  // <label htmlFor="comment">Add a comment...</label>
                  }
                  <CKEditor 
                    id="comment"
                    onChange={this.handleInputChange}
                    CKEDITOR={this.props.CKEDITOR}
                    reset={this.state.commentContent === '' ? true : false}
                    autoFocus={false}
                  />
                </div>
                <a className="waves-effect waves-teal btn-flat col s12 m2 l1" onClick={this.handleSend}>Post</a>
              </form>
            </div>
        }
        {
          this.state.single === true ? 
          <a className="waves-effect waves-teal btn-flat col s1" onClick={this.handleHome}>Back to Homepage</a>
           : <p>Click on the posts to see comments</p>
        }
        {this.displayComment()}
      </div>
    );
  }
}

export default CommentContainer;
