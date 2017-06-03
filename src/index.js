import React from 'react';
import ReactDOM from 'react-dom';
import MessageApp from './MessageApp';
import './index.css';

ReactDOM.render(
  <MessageApp CKEDITOR={window.CKEDITOR} Materialize={window.Materialize}/>,
  document.getElementById('root')
);
