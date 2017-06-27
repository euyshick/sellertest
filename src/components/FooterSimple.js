import React, { Component } from 'react'

import '../css/footer.css'

export default class FooterSimple extends Component{
  render(){
    return(
      <footer id="footer-mini">
        <div className="footer-mini_body">
          <p className="copyright">Copyright&copy;HappyShopping Inc. All Right Reserved.</p>
        </div>
      </footer>
    );
  }
}
