import React, {Component} from 'react'

export default class LayerMinishop extends Component{
  static defaultProps = {
    title: '',
    mall_name: '미니샵명',
    f_auth_seller:null,
    beforeOpen:function(){},
  }
  static propTypes = {
    mall_name: React.PropTypes.string.isRequired,
    f_auth_seller: React.PropTypes.number.isRequired,
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
      <div className={"layer-minishop "+this.state.layerClass}>
        <div className="layer-minishop_head">
          <h4 className="tit-h4">{this.state.title}</h4>
        </div>

        <div className="layer-minishop_body">
          <div className="layer-minishop_body_top">
            {this.props.f_auth_seller===1? <span className="mark-new">뉴셀러</span>:null}
            {this.props.f_auth_seller===2? <span className="mark-power">파워셀러</span>:null}
            <h5 className="tit-h5">{this.props.mall_name} {this.state.layerClass==='pop-return'?'반품/교환 안내':null}</h5>
          </div>
          {this.props.children}
        </div>

        <button type="button" className="btn-layer-clse" onClick={this.hide}><span className="ir">닫기</span></button>
      </div>
    )
  }
}
