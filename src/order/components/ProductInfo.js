import React, { Component } from 'react'

import Utils from '../../utils/Utils'

export default class ProductInfo extends Component{
  static defaultProps = {
    linkShopping:'http://shopping.pping.kr',
    deliv_price_total:0,
    cartItems:[],
    plusday:{},
    deliv_price_add:0,
  }
  static propTypes = {
    linkShopping: React.PropTypes.string,
    deliv_price_total: React.PropTypes.number.isRequired,
    cartItems: React.PropTypes.array.isRequired,
    plusday: React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      cartDatas: this.props.cartItems,
    }
  }

  // onErrorImg(cate_id){
  //   return Utils.getImageUrl(cate_id);
  // }

  render(){
    const items = () => {
      return this.state.cartDatas.map((item,index) => {
        return(
          <tr key={item.item_id}>
            <td>
              <div className="order-items">
                <div className="order-items_table">
                  <div className="order-items_row">
                    <div className="order-items_cell">
                      <span className="order-items_photo">
                        <a href={this.props.linkShopping+'/'+item.cate_id+'/'+item.item_id} target="_blank">
                          <img src={Utils.getImageUrl(item.cate_id,item.item_id)}
                            onError={()=>{
                              let cateId = item.cate_id
                              if(cateId===2010100000) cateId = 2010000000;  // 표준 PC 카테로리 아이디 이미지와 매치 안됨
                              this.refs["prodImg"+index].src = Utils.getImageUrl(cateId)
                            }}
                            ref={"prodImg"+index}
                            alt={item.item_name}
                            width="100"
                            height="100"
                          />
                        </a>
                      </span>
                    </div>

                    <div className="order-items_item">
                      {/* <span className="mark-event"><Link to={"#"}>이벤트</Link></span> */}
                      <a href={this.props.linkShopping+'/'+item.cate_id+'/'+item.item_id} className="name" target="_blank"><strong>{item.maker_name}&nbsp;{item.item_name}</strong></a>
                      <span className="order-items_item_cnt">{Utils.comma(item.cnt_item)}개</span>

                      {/* <ul className="order-items_item_lst">
                        <li>
                          Supermicro 슈퍼오 C7-B250-CB-ML STCOM
                          <span className="cnt">1개</span>
                        </li>
                      </ul> */}
                    </div>
                  </div>
                </div>
              </div>
            </td>
            <td>
              <span className="order-item-amount"><strong>{Utils.comma(item.price)}</strong>원</span>
            </td>
            {
              index === 0 ?
                <td rowSpan={this.state.cartDatas.length}>
                  {
                    this.props.f_trans===3||this.props.f_trans===6?
                    "착불" : null
                  }
                  {
                    this.props.f_trans===1?
                      this.props.deliv_price_total === 0?
                      <span className="free-delivery">무료배송</span>
                      : <span className="delivery-cost"><strong>{Utils.comma(this.props.deliv_price_total+this.props.deliv_price_add)}</strong>원</span>
                    : null
                  }
                  {
                    this.props.f_trans===4?
                    "직접수령" : null
                  }

                  {this.props.f_trans===1?<br/>:null}
                  {
                    this.props.f_trans===1?
                    <span className="delivery-date"><strong>{this.props.plusday.dvdate?this.props.plusday.dvdate.replace('요일','').replace(' ', ''):''}</strong> 도착 예정</span>
                    : null
                  }
                </td>
              : null
            }
          </tr>
        );
      })
    }

    return(
      <article className="order-body_row">
        <div className="order-body_row_head">
          <h3 className="tit-h3">주문상품 정보</h3>

          <span className="order-body_row_head_span">
            <a href="http://shopping.minishop.pping.kr/main/cart/" className="btn-product-change">상품 수정하기</a>
            <span className="order-body_row_head_span_noti">상품 수량 및 옵션 변경은 장바구니에서 가능합니다.</span>
          </span>
        </div>

        <div className="box-board">
          <table className="board thead-top">
            <caption><span>주문상품</span></caption>
            <colGroup>
              <col/>
              <col style={{width:'180px'}}/>
              <col style={{width:'180px'}}/>
            </colGroup>
            <thead>
            <tr>
              <th scope="col">상품</th>
              <th scope="col">금액</th>
              <th scope="col">배송비</th>
            </tr>
            </thead>
            <tbody>
              { items() }
            </tbody>
          </table>
        </div>
      </article>
    );
  }
}
