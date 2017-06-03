import React, {Component} from "react";

export default class CKEditor extends Component {
  constructor(props) {
    super(props);
    this.elementName = "editor_" + this.props.id;
  }

  render() {
    return (
      <div >
        <textarea name={this.elementName} defaultValue={this.props.value}></textarea>
      </div>
    )
  }

  componentDidMount = () => {
    this.props.CKEDITOR.inline(this.elementName,{startupFocus : this.props.autoFocus});
    this.props.CKEDITOR.instances[this.elementName].on("change", () => {
      let data = this.props.CKEDITOR.instances[this.elementName].getData();
      this.props.onChange(data);
    });
    if(this.props.id !== 'comment') this.props.CKEDITOR.instances[this.elementName].on("blur", this.props.onBlur);
  }

  componentWillUpdate = (props) => {
    if(props.reset === true) this.props.CKEDITOR.instances[this.elementName].setData('');
  }
}