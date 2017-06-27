import React, {Component} from 'react'

export default class LayerFrame extends Component{
  static defaultProps = {
    title: '',
    beforeOpen:function(){},
  }
  static propTypes = {
    beforeOpen: React.PropTypes.func,
  }
  state = {
    title: this.props.title,
    layerClass: this.props.className,
    isVisible: false,
  }

  componentWillUpdate(nextProps,nextState){
    if(this.state.isVisible!==nextState.isVisible && nextState.isVisible){
      this.props.beforeOpen();
    }
  }

  hide = ()=> {
    this.setState({ isVisible: false });
  }
  show = () => {
    this.setState({ isVisible: true });
  }

  render(){
    if(!this.state.isVisible){
      return false;
    }

    return(
      <div className="layer-pop" onMouseDown={(e)=>{
        if(this.props.hideOnOverlayClicked && e.target.className==='layer-pop') this.hide();
      }}>
        <div className={this.state.layerClass}>
          <h4 className="tit-h4" style={{height:'40px'}}>{this.state.title}</h4>
          {this.props.children}
          <button type="button" className="btn-layer-pop_clse" onClick={this.hide}>
            <img src="//img.happyshopping.kr/img_static/img_pres/_v3/btn_layer_pop_clse.png" alt="닫기" />
          </button>
        </div>
      </div>
    )
  }
}
