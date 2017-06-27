import React, { Component } from 'react'

import Utils from '../../utils/Utils'

// import LayerFrame from './LayerFrame'

export default class Coupon extends Component{
  static defaultProps = {
    coupon:[],
    couponDiscount:0,
  }
  static propTypes = {
    coupon:React.PropTypes.array.isRequired,
    couponDiscount:React.PropTypes.number.isRequired,
  }

  state = {
    useCouponPoint: 5000,
  }

  render(){
    const _couponlist = () => {
      if(this.props.coupon.length>0){
        return this.props.coupon.map((d,index)=>{
          if(d.rslt.toLowerCase()==='success')
            return(
              <div key={index}>
                {'-'+d.coupon_name+' (수량 : '+d.couponCount+'개)'}
              </div>
            )
          else
            return false;
        })
      }else{
        return '-';
      }
    }

    return(
      // 쿠폰 임시 처리
      <article className="order-body_row">
        <h3 className="tit-h3">쿠폰사용</h3>
        <div className="box-board">
          <table className="board thead-lft">
            <caption><span>쿠폰 선택하기</span></caption>
            <colGroup>
              <col style={{width:'150px'}}/>
              <col/>
            </colGroup>
            <tbody>
            <tr>
              <th scope="row"><span>쿠폰 적용</span></th>
              <td>
                <div className="box-td" style={{lineHeight:'20px'}}>
                  {_couponlist()}
                  {/*<button type="button" className="btn-coupon"
                    onMouseDown={() => this.refs.couponDialog.show()}>쿠폰 선택</button>*/}
                </div>
              </td>
            </tr>
            <tr>
              <th scope="row"><span>쿠폰 할인 금액</span></th>
              <td>
                <div className="box-td">
                  <strong className="discounted">{ Utils.comma(this.props.couponDiscount)}</strong>원
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        {/*<LayerFrame
      		hideOnOverlayClicked
      		ref="couponDialog"
          title="쿠폰적용"
      		className="layer-pop_coupon"
        >
          <div className="layer-pop_header">
            <span className="dsc" style={{
              position:'absolute',
              top:'27px',
              left:'110px'
            }}>사용 가능한 쿠폰만 활성화 되어 보여집니다.</span>
          </div>

          <div>
            <div className="box-board">
              <table className="board thead-top">
                <caption><span>쿠폰 리스트</span></caption>
                <thead>
                <tr>
                  <th scope="col">전용쿠폰</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>
                    <ul>
                    {
                      this.props.idx_coupons?
                      <li>
                        <span className="iradio">
                          <input type="radio" id="id-c1" name="name-c1"
                            value="0"
                            data-value={this.state.useCouponPoint}
                            checked={true}
                            onChange={(e)=>{
                              this.setState({
                                selectingCouponPoint:parseInt(e.target.getAttribute('data-value'),10),
                              });
                            }}
                          />
                          <label htmlFor="id-c1"><em>배송비 5000원 할인 쿠폰</em></label>
                        </span>
                      </li>
                      : null
                    }
                    </ul>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <div className="total">
              <strong>
                총 할인금액 <span>{ this.props.idx_coupons? Utils.comma(this.state.useCouponPoint) : 0}</span><em>원</em>
              </strong>
            </div>
          </div>

          <div className="button-group ctr">
            <button type="button" className="btn-pop-cncl" onMouseDown={() => this.refs.couponDialog.hide()}>취소</button>
            <button type="button" className="btn-pop-coupon-submit" onMouseDown={()=>{
              this.refs.couponDialog.hide();
              // 단일 쿠폰 임시 처리
              // this.setState({
              //   useCouponIdx: this.state.selectingCouponIdx,
              //   useCouponPoint: this.state.selectingCouponPoint,
              // });
            }}>쿠폰 적용</button>
          </div>
        </LayerFrame>*/}
      </article>
    )
  }
}
