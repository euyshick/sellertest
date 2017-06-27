import React, { Component } from 'react'

import {request} from '../../utils/Utils'

import LayerFrame from './LayerFrame'

export default class LayerOfficeMap extends Component{
  static propTypes = {
    apiUrl: React.PropTypes.string.isRequired,
    datas: React.PropTypes.array,
    map_info_public: React.PropTypes.string.isRequired,
    map_info_parking: React.PropTypes.string.isRequired,
    addr_1: React.PropTypes.string.isRequired,
    addr_2: React.PropTypes.string.isRequired,
  }

  state = {
    datas:this.props.datas,
  }

  _executeBeforeModalOpen = () => {
    request({
      url:this.props.apiUrl+'/geocode',
      method:'post',
      body:{
        addr:this.props.addr_1+' '+this.props.addr_2
      }
    }).then(rsData=>{
      const lng = rsData.data.addressInfo.channel.item[0].lng;
      const lat = rsData.data.addressInfo.channel.item[0].lat;

      const mapContainer = this.refs.officeDaumMap;
      const mapOption = {
        center: new window.daum.maps.LatLng(lat,lng),
        level: 3
      };
      const map = new window.daum.maps.Map(mapContainer, mapOption);
      const marker = new window.daum.maps.Marker({
        position:map.getCenter()
      });
      marker.setMap(map);

      const tooltipContext = '<div class="layer-tooltip-map">'
        +'<strong>'+this.props.addr_1+'</strong><br>'
        +'<span>'+this.props.addr_2+'</span>'
        +'</div>';
      new window.daum.maps.CustomOverlay({
        map:map,
        position: marker.getPosition(),
        content: tooltipContext,
      });
    })
  }

  _printModal = () => {
    const printArea = document.querySelector('.layer-pop_minishop').parentNode.innerHTML;
    let win = window.open();
    self.focus();
    win.document.open();
    win.document.write('<html><head><style>');
    win.document.write('body{ font-family: dotum; font-size: 12px;}');
    win.document.write('.btn-layer-pop_clse,.layer-pop_minishop .map-detail .button-group{display:none;}');
    win.document.write('.layer-pop_minishop{padding:10px;border:1px solid #333;background:#fff;}');
    win.document.write('</style></head><body>');
    win.document.write(printArea);
    win.document.write('</body></html>');
    win.document.close();
    win.print();
    win.close();
  }

  render(){
    return(
      <div>
      	<h4 className="tit-h4">직접수령 진행 순서</h4>
      	<button type="button" className="btn-pop-service" onMouseDown={() => this.refs.officeMapDialog.show()}>매장 약도<i className="icon-angle-right"></i></button>

      	<LayerFrame
          hideOnOverlayClicked
          ref="officeMapDialog"
      		title="찾아오시는 길"
          className="layer-pop_minishop"
          beforeOpen={this._executeBeforeModalOpen}
      	>
    			<div className="map-detail">
    				<div className="map-detail_map" style={{height:'298px'}} ref="officeDaumMap">
    					{/* <img src="http://img.happyshopping.kr/img_static/img_pres/_v3/map.jpg" alt="약도"/> */}
    				</div>
    				<dl className="map-detail_publictransport">
    					<dt>대중교통 이용시</dt>
    					<dd>{this.props.map_info_public}</dd>
    				</dl>
    				<dl className="map-detail_parking">
    					<dt>주차장 안내</dt>
    					<dd>{this.props.map_info_parking}</dd>
    				</dl>

    				<div className="button-group ctr">
    					<button type="button" className="btn-map-print" onMouseDown={this._printModal}>인쇄하기</button>
    				</div>
    			</div>
      	</LayerFrame>
      </div>
    );
  }
}
