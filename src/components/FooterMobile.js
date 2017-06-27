import React, { Component } from 'react'

import '../css/footer.css'

export default class FooterMobile extends Component{
  render(){
    return(
      <footer id="footer-m">
          <div className="footer-m_body">
              <ul className="footer-m_body_menu">
                  <li><a href="//www.pping.co/" target="_blank">회사소개</a></li>
                  <li><a href="//www.pping.co/recruit/apply" target="_blank">인재채용</a></li>
                  <li><a href="http://help.minishop.pping.kr/main/faq_write/?cat=14" target="_blank">입점제휴문의</a></li>
                  <li><a href="//pping.kr/policy" target="_blank">이용약관</a></li>
              </ul>
              <p className="copyright">Copyright&copy;HappyShopping Inc. All Right Reserved.</p>


          </div>
      </footer>
    );
  }
}
