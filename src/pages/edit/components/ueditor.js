import React from 'react';
// import UE from '../ueditor/ueditor.all';
const UE = window.UE;
// let editor=null;
class Ueditor extends React.Component {
  static defaultProps = {
    config: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      content: '',
      editor: '',
      hasInit: false
    };
  }

  componentDidMount() {

    // let defaultData = this.props.defaultData;
    this.initEditor()
  }

  componentWillUnmount() {
    // 组件卸载后，清除放入库的id
    UE.delEditor(this.props.id);
  }

  initEditor() {
    let _this = this;
    /*初始化编辑器*/
    const { id, config } = this.props;
    const ueEditor = UE.getEditor(this.props.id, config);
    const self = this;

    ueEditor.ready((ueditor) => {
      if (!ueditor) {
        UE.delEditor(id);
        self.initEditor();
      }
    });
    let editor = ueEditor;
    this.setState({
      editor,
      hasInit: true
    });
  }
  getVal() {
    /*获取编辑器内容函数*/
    let { editor } = this.state;
    let content = editor.getContent();
    return content;
  }


  // componentWillReceiveProps(nextProps) {
  //   if (this.props.defaultValue !== nextProps.defaultValue) {
  //     this.setState({
  //       defaultValue
  //     })
  //   }
  // }


  setVal(data) {
    /*获取编辑器内容函数*/
    //赋值
    let { hasInit } = this.state;

    if (hasInit) {
      let { editor } = this.state;
      editor.setContent(data);
    }else{
      setTimeout(()=>{
        this.setVal(data);
      },1000)
    }
    // setTimeout(() => {
    //   let { editor } = this.state;
    //   // console.log(editor)
    //   editor.setContent(data);
    // }, 2000)
  }


  render() {
    let { content, id } = this.props;
    return (
      <div >
        <textarea id={id}
          defaultValue={content}
          onChange={this.getVal} />
      </div>
    )
  }
}
export default Ueditor;
