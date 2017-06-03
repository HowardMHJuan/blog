import React, { Component } from 'react';
import './Reply.css';
import ReactHtmlParser from 'html-react-parser';

class Reply extends Component {
  getTime = () => {
    const time = new Date(this.props.time);
    const year = time.getFullYear();
    const month = time.getMonth() + 1;
    const date = time.getDate();
    const hour = (`0${time.getHours()}`).slice(-2);
    const minute = (`0${time.getMinutes()}`).slice(-2);
    return `commented at ${year}/${month}/${date} ${hour}:${minute}`;
  }
  render = () => {
    return (
      <div className="Reply">
        <div className="row reply-name">
          <p className="col l2 offset-l4 m3 offset-m3 s5 offset-s2" id="reply-name">{this.props.name}</p>
          <p className="col l3 m4 s5" id="reply-time">{this.getTime()}</p>
        </div>
        <div className="row reply-content">
          <div className="col l5 offset-l4 m7 offset-m3 s10 offset-s2" id="reply-content">{ReactHtmlParser(this.props.content)}</div>
        </div>
      </div>
    );
  }
}

export default Reply;
