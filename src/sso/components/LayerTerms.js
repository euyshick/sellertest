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
				case 'd1':		//이용약관 동의
					return(
						<TermAgreement />
					)
				case 'd2':		//개인정보 수집 및 이용동의
					return(
						<TermCollectPersonalInfo />
					)
				case 'a1':		//(보호자)개인정보처리방침
					return(
						<TermProcessPersonalInfo />
					)
				case 'a2':		//(보호자)통신과금서비스 이용약관
					return(
						<TermTelecomService />
					)
				case 'a3':		//(보호자)전자금융거래 이용약관
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
