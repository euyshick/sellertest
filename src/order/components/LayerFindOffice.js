import React, { Component } from 'react'

import {request} from '../../utils/Utils'

import LayerFrame from './LayerFrame'

let DATA_STATUS = false;

export default class LayerFindOffice extends Component{
  static propTypes = {
    apiUrl: React.PropTypes.string.isRequired,
  }

  state = {
    datas:[],
    selectedName: '',
    selectedIdx: null,
    searchString: '',
    viewMap: false,
  }

  componentWillUpdate(nextProps,nextState){
    if(nextState.viewMap){
      request({
        url:this.props.apiUrl+'/geocode',
        method:'post',
        body:{
          addr:nextState.selectAddr,
        }
      }).then(rsData=>{
        const lng = rsData.data.addressInfo.channel.item[0].lng;
        const lat = rsData.data.addressInfo.channel.item[0].lat;

        const daum = window.daum;
        const mapContainer = document.getElementById('officeMapDiv');
        const mapOption = {
            center: new daum.maps.LatLng(lat,lng),
            level: 3
        };
        const map = new daum.maps.Map(mapContainer, mapOption);
        const marker = new window.daum.maps.Marker({
          position:map.getCenter()
        });
        marker.setMap(map);

        const tooltipContext = '<div class="layer-tooltip-map">'
          +'<strong>'+nextState.selectAddr+'</strong><br>'
          //+'<span>'+this.props.managerInfo.addr_2+'</span>'
          +'</div>';
        new window.daum.maps.CustomOverlay({
          map:map,
          position: marker.getPosition(),
          content: tooltipContext,
        });
      })
    }
  }

  _dialogDefault = () => {
    if(document.querySelector('.map-detail')){
      document.querySelector('.map-detail').style.display = "none";
    }
    this.setState({
      searchString: '',
    });

    if(DATA_STATUS) return;
    request({
      url:this.props.apiUrl+'/freightOffices',
      method:'post',
    }).then(rsData=>{
      DATA_STATUS = true;
      this.setState({
        datas:rsData.data.offices
      });
    })
  }

  render(){
    let listDatas = this.state.datas;

    if(this.state.searchString.length>0){
      listDatas = listDatas.filter(offices => {
        return offices.nm_office.match( this.state.searchString );
      })
    }

    return(
      <div className="box-td">
      	<input type="text" id="id-office"
      		className={this.props.check_validation_recipient['id_deliv_6']?"istyle ialert":"istyle"}
      		data-idx={this.state.selectedIdx}
      		value={this.state.selectedName}
      		style={{width:'300px'}}
      		readOnly={true}
      		onMouseDown={() => this.refs.findOfficeDialog.show()}/>
      	<input type="button" value="영업소 찾기" className="btn-office-find"
      		onMouseDown={() => this.refs.findOfficeDialog.show()}/>

      		{
      			this.props.check_validation_recipient['id_deliv_6']?
      			<div className="alert-msg fail">방문 영업소를 선택해 주세요.</div>:null
      		}

      	<ul className="officefind-noti">
      		<li>- 선택하신 영업소로 직접 방문 수령시 정확한 화물비 확인이 가능합니다.</li>
      		<li>- 크기 및 무게에 따라 화물비가 정산됩니다.</li>
      		<li>- 영업소 보관료 별도/도서지역 별도 비용추가</li>
      	</ul>

      	<LayerFrame
      		hideOnOverlayClicked
      		ref="findOfficeDialog"
      		title="영업소 찾기(경동화물)"
      		className="layer-pop_office"
      		beforeOpen={this._dialogDefault}
      	>
      		<div className="search">
      			<p className="dsc">
      				<label htmlFor="id-office-search">
      					<strong>찾으시려는 경동화물 영업소의 <span>시/군/구</span> 이름을 입력하세요.</strong>
      				</label>
      				<br/>
      				(예) 포항시, 강동구, 홍천군
      			</p>
      			<input type="text" id="id-office-search" className="istyle" style={{width:'311px'}}
      				value={this.state.searchString}
      				onChange={(e)=>{this.setState({ searchString: e.target.value });}}
      			/>
      		</div>

      		<div className="search-result">
      			<div className="box-board">
      			  <table className="board thead-top">
      				<caption><span>영업소 검색</span></caption>
      				<colGroup>
      				  <col style={{width:'168px'}}/>
      				  <col style={{width:'104px'}}/>
      				  <col style={{width:'280px'}}/>
      				  <col style={{width:'81px'}}/>
      				</colGroup>
      				<thead>
      				  <tr>
      					<th scope="col">영업소명</th>
      					<th scope="col">전화번호</th>
      					<th scope="col">주소</th>
      					<th scope="col">약도</th>
      				  </tr>
      				</thead>
      				<tbody>
      				  {
      					listDatas.length > 0 ?
      					  listDatas.map(offices => {
      						return(
      						  <tr key={offices.pr_idx}>
      							<td>
      							  <div className="box-td">
      								<span className="iradio">
      								  <input type="radio" id={"id-off/"+offices.pr_idx} name="name-offi"
      									checked={parseInt(this.state.selectedIdx,10) === parseInt(offices.pr_idx,10)}
      									value={offices.pr_idx}
      									onChange={(e) => {
      									  this.refs.findOfficeDialog.hide();
      									  this.setState({
      										selectedName: e.target.getAttribute("data-value"),
      										selectedIdx: e.target.value
      									  });
      									}}
      									data-value={offices.nm_office}
      								  />
      								  <label htmlFor={"id-off/"+offices.pr_idx}><em>{offices.nm_office}</em></label>
      								</span>
      							  </div>
      							</td>
      							<td>
      							  <div className="box-td">{offices.num_callcenter}</div>
      							</td>
      							<td><div className="box-td">{offices.addr_office}</div></td>
      							<td>
      							  <div className="box-td">
      								<button type="button" className="btn-map" onClick={(e) =>{
      								  this.setState({
      									selectAddr: e.target.getAttribute('data-addr'),
      									viewMap: true,
      								  })
      								}} data-addr={offices.addr_office}>약도</button>
      							  </div>
      							</td>
      						  </tr>
      						)
      					  })
      					  :
      					  <tr>
      						<td colSpan="4">
      						  <div className="notfound">검색하신 결과가 없습니다.</div>
      						</td>
      					  </tr>
      				  }
      				</tbody>
      			  </table>
      			</div>
      		</div>

      		{
      			this.state.viewMap?
      			<div className="map-detail">
      				<div className="map-detail_map" id="officeMapDiv" style={{height:'298px',backgroundColor:'#fff'}}></div>
      				<button type="button" className="btn-layer-pop_map_clse"
      				style={{zIndex:2}}
      				onClick={()=>{
      				  this.setState({
      					viewMap:false
      				  })
      				}}
      			  >
      				<img src="http://img.happyshopping.kr/img_static/img_pres/_v3/btn_layer_pop_clse2.png" alt="닫기"/>
      			  </button>
      			</div>
      			: null
      		}
      	</LayerFrame>
      </div>
    );
  }
}
