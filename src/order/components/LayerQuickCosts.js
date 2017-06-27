import React, { Component } from 'react'

import {request,comma} from '../../utils/Utils'

import LayerFrame from './LayerFrame'

let DATA_COSTS = null;

export default class LayerQuickCosts extends Component{
  static propTypes = {
    apiUrl: React.PropTypes.string.isRequired,
  }

  state = {
    datas:[],
    searchString: '',
  }

  _dialogDefault = () => {
    this.setState({ searchString: '' });

    const setData = (d) => {
      this.setState({
        datas: d
      });
    }

    if(DATA_COSTS){
      setData(DATA_COSTS);
      return;
    }

    request({
      url:this.props.apiUrl+'/quickServiceCosts',
      method:'post',
    }).then(rsData=>{
      DATA_COSTS = rsData.data.quickServiceCosts;
      setData(rsData.data.quickServiceCosts)
    })
  }

  render(){
    let listDatas = this.state.datas;

    if(this.state.searchString.length>0){
      listDatas = listDatas.filter(lists => {
        return lists.addr_dstn.match( this.state.searchString );
      })
    }

    return(
      <div>
        <h4 className="tit-h4">퀵서비스 진행 순서</h4>
        <button type="button" className="btn-pop-service" onMouseDown={() => this.refs.quickCostsDialog.show()}>지역별 운송료<i className="icon-angle-right"></i></button>

        <LayerFrame
          hideOnOverlayClicked
          ref="quickCostsDialog"
          title="퀵서비스 운송료(서울/경기)"
          className="layer-pop_quickservice"
          beforeOpen={this._dialogDefault}
        >
            <div className="search">
              <p className="dsc">
                <label htmlFor="id-office-search2">
                  <strong>제품을 받으실 <span>동/읍/면</span>을 입력해주세요.</strong>
                </label>
                <br/>
                (예) 종로3가, 신사동, 철원읍
              </p>
              <input type="text" id="id-office-search2" className="istyle" style={{width:'311px'}}
                value={this.state.searchString}
                onChange={(e)=>{this.setState({ searchString: e.target.value });}}
              />

              <ul className="search_quickservice_noti">
                <li>ㆍ퀵서비스 받으실 장소의 대략적인 운송료를 검색하실수 있습니다.</li>
                <li>ㆍ실제 운송료와 다를 수 있으니 담당자와 연락하여 확인하시기 바랍니다.</li>
              </ul>
            </div>

            <div className="search-result">
              <div className="box-board">
                <table className="board thead-top">
                  <caption><span>영업소 검색</span></caption>
                  <colGroup>
                    <col style={{width:'274px'}}/>
                    <col style={{width:'101px'}}/>
                  </colGroup>
                  <thead>
                  <tr>
                    <th scope="col">목적지</th>
                    <th scope="col">가격(원)</th>
                  </tr>
                  </thead>
                  <tbody>
                    {
                      listDatas.length > 0 ?
                        listDatas.map(lists => {
                          return(
                            <tr key={lists.pr_idx}>
                              <td>
                                <div className="box-td">{lists.addr_dstn}</div>
                              </td>
                              <td>
                                <div className="box-td">{comma(lists.price_dstn)}</div>
                              </td>
                            </tr>
                          )
                        })
                        :
                        <tr>
                          <td colSpan="2">
                            <div className="notfound">검색하신 결과가 없습니다.</div>
                          </td>
                        </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
        </LayerFrame>
      </div>
    )
  }
}
