import React, { Component } from 'react';
import './MessageApp.css';
import CommentContainer from './CommentContainer';
import 'disable-react-devtools';

class MessageApp extends Component {
  constructor() {
    super();
    this.state = {
      login: false,
      name: '',
    };
  }
  componentDidMount = () => {
      window.fbAsyncInit = () => {
        window.FB.init({
          appId      : '1407855145994811',
          cookie     : true,
          xfbml      : true,
          version    : 'v2.9'
        });
        window.FB.AppEvents.logPageView();
        window.FB.Event.subscribe('auth.statusChange', this.statusChangeCallback);
      };
      (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
  }
  didLogin = () => {
    window.FB.api('/me', (res) => {
      this.setState({
        login: true,
        name: res.name,
      });
    });
  }
  didNotLogin = () => {
    this.props.setState({
      login: false,
      name: '',
    });
  }
  statusChangeCallback = (response) => {
    if (response.status === 'connected') {
      this.didLogin();
    } else {
      this.didNotLogin();
    }
  }
  checkLoginState = () => {
    window.FB.getLoginStatus(function(response) {
      this.statusChangeCallback(response);
    });
  }
  loginSection = () => {
    if(this.state.login === false) {
      return (
        <div className="fb-login-button"
          data-max-rows="1"
          data-size="medium"
          data-button-type="continue_with"
          data-show-faces="false"
          data-auto-logout-link="false"
          data-use-continue-as="true"
        />
      );
    } else {
      return (
        <a className="btn cyan">Hi, {this.state.name}</a>
      );
    }
  }
  render = () => {
    return (
      <div className="App">
        <div className="login-section">{this.loginSection()}</div>
        <div className="App-header">
          <p>Blog</p>
        </div>
        <div className="App-content">
          <CommentContainer name={this.state.name} login={this.state.login} CKEDITOR={this.props.CKEDITOR} Materialize={this.props.Materialize}/>
        </div>
      </div>
    );
  }
}

export default MessageApp;
