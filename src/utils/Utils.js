import moment from 'moment'

exports.request = obj => {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open(obj.method || "get", obj.url);
    xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
    if (obj.headers) {
      Object.keys(obj.headers).forEach(key => {
        xhr.setRequestHeader(key, obj.headers[key]);
      });
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {   // 성공
          resolve(JSON.parse(xhr.response));
      } else {   // 그 외
          reject(xhr.statusText);
      }
      resolve(JSON.parse(xhr.response));    // 모든 결과 return 화면처리는 각각 함수에서
    };
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send(JSON.stringify(obj.body));
  });
};

exports.getImageUrl = function(cid, item_id){
  if(!item_id){
    return '//img.happyshopping.kr/img_shopping/img_goods/img_no/'+cid+'_64.png';
  }

  const dir = Math.ceil(parseInt(item_id,10)/1000)*1000;
  return '//img.happyshopping.kr/img_shopping/img_goods/img_'+dir+'/img_'+item_id+'/140.jpg';
}

exports.setTitle = function(pageName){
  let title = window.document.title;
  let getOrignTitle = title.split('|');
  getOrignTitle = getOrignTitle[getOrignTitle.length-1];
  if(pageName){
    title = pageName+' | '+getOrignTitle.trim();
  } else{
    title = getOrignTitle.trim();
  }
  window.document.title = title;
}

/**************
  String util
*/
exports.comma = function(number) {
  let str = String(number);
  return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
}

exports.format = {
  // 숫자 체크
  isNumber: function(arg_string){
    if(!arg_string) return false;

    const value = arg_string.replace(/^\s*|\s*$/g, '');
    if (value === '' || isNaN(value)) return false;
    return true;
  },

  onlyNumber: function(arg_string){
    return arg_string.replace(/[^0-9]/g,'');
  },

  // 모바일번호 유효성 체크
  isMobile : function(arg_string){
    if(!arg_string) return false;

		const format = /^(\d{2,3})[-]?(\d{3,4})[-]?(\d{4})$/;
    const phoneHead = ['010', '011', '016', '017', '018', '019'];

    if(arg_string.search(format) === -1 || phoneHead.indexOf( arg_string.substring(0,3) ) === -1){
      return false;
    }
    return true;
  },

  // 전화번호 유효성 체크
  isTel : function(arg_string){
    if(!arg_string) return false;

		const format = /^(\d{2,3})[-]?(\d{3,4})[-]?(\d{4})$/;

    if(arg_string.search(format) === -1){
      return false;
    }
    return true;
  },

  // 사업자등록번호 유효성 체크
  isBizNum : function(_bizId){
    const checkId = [1, 3, 7, 1, 3, 7, 1, 3, 5, 1];
    let i, checkSum=0, c2, remander;
    let bizId = _bizId.replace(/-/gi,'');

    for (i=0; i<=7; i++) checkSum += checkId[i] * bizId.charAt(i);
    c2 = "0" + (checkId[8] * bizId.charAt(8));
    c2 = c2.substring(c2.length - 2, c2.length);
    checkSum += Math.floor(c2.charAt(0)) + Math.floor(c2.charAt(1));
    remander = (10 - (checkSum % 10)) % 10 ;

    if (Math.floor(bizId.charAt(9)) === remander) return true ; // OK!
    return false;
  },

  //법인등록번호 유효성 체크
  isRegNum : function(_regId){
  	let regId = _regId.replace(/-/gi,'');
  	if(regId.length !== 13){
  		return false;
  	}
  	const regId_arr = regId.split('');
  	const checkId = [1,2,1,2,1,2,1,2,1,2,1,2];
  	let checkSum = 0, iCheck_digit = 0, i = 0;
  	for (; i < 12; i++){
  		checkSum +=  Number(regId_arr[i]) * Number(checkId[i]);
  	}
  	iCheck_digit = 10 - (checkSum % 10);
  	iCheck_digit %= 10;
  	if (iCheck_digit !== parseInt(regId_arr[12],10)){
  		return false;
  	} 
  	return true;
  },

  // YYYY-MM-DD 포멧 체크 (슬래시 무시)
  isDate : function(arg_string){
    const s = arg_string.replace(/-/gi,'');
    if( !this.isNumber(s) || s.length!==8 ) return false;

    const s1 = parseInt(s.slice(0,4),10);
    const s2 = parseInt(s.slice(4,6),10);
    const s3 = parseInt(s.slice(6,8),10);

    const y = parseInt(moment().format("YYYY"),10);

    if(s1<1900 || s1>y) return false;
    if(s2<1 || s2>12) return false;
    if(s3<1 || s3>31) return false;
    if(s2===2){
      if(s3>29) return false;
    }else if(s2<=7){
      if(s2%2===0){
        if(s3>30) return false;
      }
    }else if(s2>8){
      if(s2%2===1){
        if(s3>30) return false;
      }
    }
    return true;
  },

  // 이메일 형식 체크
  isEmail : function(arg_string){
    if(!arg_string) return false;

		const format = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/

    if(!format.test(arg_string)){
      return false;
    }
    return true;
  },

  // 문자열(arg_string)을 특정 형태(format)로 변환
  setFormat : function(arg_string, format){
    let val;
    switch(format){
      case "YYYY-MM-DD":
        const s = arg_string.replace(/-/gi,'');
        val = s.slice(0,4)+'-'+s.slice(4,6)+'-'+s.slice(6,8);
        break;
      default:
        break;
    }

    return val;
  },

  getPasswordLevel : function(password){
    // [사용 불가]
    // - 6자 미만
    // - 숫자만
    // - 연속된 숫자 및 문자(알파벳, 키보드 배열 등)
    //
    // [체크항목]
    // - 8자 미만 (1점)
    // - 10자 미만 (2점)
    // - 10자 이상 (3점)
    // - 문자만 (1점)
    // - 문자+숫자 (2점)
    // - 문자+숫자+특수문자 or 문자+숫자+대문자 (3점)
    //
    // [return value]
    // 사용불가는 1점 나머지는 체크항목 합
    //
    // [UI]
    // 0:기본, 1:사용불가, 2:위험, 3:보통, 4:안전

    const prohibitSet = 'qwertyuiop[]|asdfghjkl; zxcvbnm,./|abcdefghijklmnopqrstuvwxyz';
    const regRepeat = /(\w)\1\1\1/;   // 같은문자 4자 연속 제한
    const specialChar = /[`~!@#$%^&*|'";:/?]/gi;
    let point = 0;

    // 사용불가 체크
    if(password.length<6
      || prohibitSet.indexOf(password.toLowerCase())!==-1
      || this.isNumber(password)
      || regRepeat.test(password)
    ){
      return 1;
    }

    // 문자 길이 체크
    if(password.length<8){
      point += 1;
    }else if(password.length<10){
      point += 2;
    }else{
      point += 3;
    }

    // 문자 형태 체크
    if(password.search(/[a-z]/ig)){
      point += 1;
    }
    if(password.search(/[0-9]/g)){
      point += 1;
    }
    if(password.search(/[A-Z]/ig) || specialChar.test(password)){
      point += 1;
    }

    if(point === 1) point+=1;
    return point;
  }
}

exports.jsonToQueryString = function(json) {
  return '?' +
    Object.keys(json).map(function(key) {
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
    }).join('&');
}

exports.getParameter = function(paramName){
  let value;
  let url = window.location.href;
  let parameters = (url.slice(url.indexOf('?') + 1, url.length)).split('&');
  for(let i=0;i<parameters.length;i++){
    let varName = parameters[i].split('=')[0];
    if(varName.toUpperCase() === paramName.toUpperCase()){
      value = parameters[i].split('=')[1];
      return decodeURIComponent(value);
    }
  }
}

exports.decodeHTMLEntities = function(text){
  const entities = [
    ['amp', '&'],
    ['apos', '\''],
    ['#x27', '\''],
    ['#x2F', '/'],
    ['#39', '\''],
    ['#47', '/'],
    ['lt', '＜'],  // ㄷ+한자 : 3번
    ['gt', '＞'],  // ㄷ+한자 : 5번
    ['nbsp', ' '],
    ['quot', '"']
  ];

  for (let i = 0, max = entities.length; i < max; ++i)
    text = text.replace(new RegExp('&'+entities[i][0]+';', 'g'), entities[i][1]);

  return text;
}
