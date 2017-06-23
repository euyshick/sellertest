import React, {Component} from 'react'

import TermAgreement from './terms/TermAgreement'
import TermCollectPersonalInfo from './terms/TermCollectPersonalInfo'
import TermProcessPersonalInfo from './terms/TermProcessPersonalInfo'
import TermTelecomService from './terms/TermTelecomService'
import TermFinancial from './terms/TermFinancial'

export default class LayerTerms extends Component{
	render(){
		const _context = () => {
			switch (this.props.viewTermId) { 
				default:
				case 'd1':		//판매이용약관(필수)
					return(
						<TermAgreement />
					)
				case 'd2':		// 전자금융거래 이용약관
					return(
					<TermFinancial />
					)
				case 'd3':		//개인정보 수집 및 이용
					return(
						<TermCollectPersonalInfo />
					)
				case 'a1':		//행복쇼핑 ECO플래폼 이용약관 (선택)
					return(
						<TermTelecomService />
					)
				case 'a2':		//행복쇼핑 ECO플래폼 개인정보 수집 및 이용(선택)
					return(
						<TermFinancial />
					)
			}
		}

    return(
      <div className="layer-pop">
        <div className="layer_terms">
					{_context()}
          <button type="button" className="btn-layer-pop_clse"
						onClick={(e)=>{this.props.setProps({viewTermLayer:false})}}
					><img src="//img.happyshopping.kr/img_static/img_pres/_v3/btn_layer_pop_clse.png" alt="닫기"/></button>
        </div>
      </div>
    )
  }
}
