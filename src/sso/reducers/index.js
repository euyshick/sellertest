import { combineReducers } from 'redux'
import * as actions from '../actions'
import { format } from '../../utils/Utils'

const initialValue = {
  data : {
    apiUrl:{
      // 로그인 설정
      login:window.API_URL+'/front/v1/member/login',
      logout:window.API_URL+'/front/v1/member/logout',
      memberInfo:window.API_URL+'/front/v1/member/memberInfoByToken',
      shopList:window.API_URL+'/front/v1/member/shopList',
      reqSms:window.API_URL+'/front/v1/member/reqSms',
      authSms:window.API_URL+'/front/v1/member/authSms',
      reqCaptcha:window.API_URL+'/front/v1/member/reqCaptcha',
      showCaptcha:window.API_URL+'/front/v1/member/showCaptcha',
      authCaptcha:window.API_URL+'/front/v1/member/authCaptcha',
      loginFailreset:window.API_URL+'/front/v1/member/loginFailreset/',
      nicknmcheck:window.API_URL+'/front/v1/member/nicknmcheck/',

      // 회원가입
      memberRegist:window.API_URL+'/front/v1/member/memberRegist',
      emailhpcheck:window.API_URL+'/front/v1/member/emailhpcheck',
      idcheck:window.API_URL+'/front/v1/member/idcheck',

      // 이름 휴대폰번호 아이디 비밀번호 찾기
      idpwdsearch:window.API_URL+'/front/v1/member/idpwdsearch',
      idfind:window.API_URL+'/front/v1/member/idfind/',
      repwd:window.API_URL+'/front/v1/member/repwd/',
      // 인증
      sendCertifyCodeByPhone:window.API_URL+'/front/v1/order/sendCertifyCodeByPhone',
      certifyCodeConfirm:window.API_URL+'/front/v1/order/certifyCodeConfirm',
      authMsgSend:window.API_URL+'/common/usage/authMsgSend',
      authHashData:window.API_URL+'/common/usage/authHashData',
      requestHPAuth:window.API_URL+'/common/usage/requestHPAuth',
      requestHPAuthResult:window.API_URL+'/common/usage/requestHPAuthResult',
    },

    isAdminLogin:false, // 어드민 계정 로그인

    cntMin:2,     // 인증 입력시간 표시(분)
    cntSec:59,    // 인증 입력시간 표시(초)
    authState:0,  // 0:인증전, 1:인증진행중, 2:값이유효하지 않음, 3:인증성공, -1:인증받는 핸드폰(이메일) 형식오류
    authNum:'',   // 인증 번호 입력
    authMethod:null, // 0:휴대전화 인증, 1:이메일 인증

    passwordLevel: 0,   //0:기본, 1:사용불가, 2~3:위험, 4:보통, 5:안전
    passwordLevel2: 0,  //0:기본, 1:일치

    userName:'',  // 로그인한 사용자 이름
    userId:'',    // 로그인한 사용자 아이디
    userMobile:'',// 로그인한 사용자 휴대전화
    groupJoinStatus:0,   // 0:관리자 로그인 전, 2:관리자가 로그인 중, 3:관리자 로그인 후
    bizType:'0',  // 0:개인 사업자, 1:영리법인, 2:비영리법인, 3:공식단체
    bizNum0:'',   // 법인등록번호
    bizNum1:'',   // 사업자등록번호
    bizNum2:'',   // 고유번호

    termAgree0: false,    // 약관 전체동의
    termAgree1: false,    // 이용약관 동의
    termAgree2: false,    // 개인정보 수집 및 이용 동의
    termAgree3: false,    // 이메일 마케팅 수신 동의
    termAgree4: false,    // 개인정보 유효기간 3년 지정(미동의 시 1년)

    adultTermAgree0: false,    // 약관 전체동의
    adultTermAgree1: false,    // 개인정보처리방침
    adultTermAgree2: false,    // 통신과금서비스 이용약관
    adultTermAgree3: false,    // 전자금융거래 기본약관
    adultTermAgree4: false,    // 개인정보 수집 및 동의
    adultTermAgree5: false,    // 개인정보 유효기간 3년 지정(미동의 시 1년)

    sellerTermAgree0: false,    // 판매이용약관
    sellerTermAgree1: false,    // 전자금융거래 이용약관
    sellerTermAgree2: false,    // 개인정보 수집 및 이용 동의
    sellerTermAgree3: false,    // 행복쇼핑 ECO플랫폼 이용약관 동의
    sellerTermAgree4: false,    // 행복쇼핑 ECO플랫폼 이용약관 개인정보 수집및 이용

    under14:false,
    adultAuth:false,

    formData : {
      // 개인 | 단체 공통
      userId:'',
      userNickname:'',
      userPw:'',
      userPw2:'',

      // 개인
      userName:'',
      gender:"0",		// 0:남성, 1:여성
      birth_y:'',
      birth_m:'',
      birth_d:'',
      mobile_0:'010',
      mobile_1:'',
      email_id:'',
      email_domain:'',

      // nm_p:'',       //보호자이름
      // birth_p:'',    //보호자생일 - 0:기본, 1:미선택
      // hp_p:'',       //휴대전화 - 0:기본, 1:미입력, 2:형식오류
      // f_sex_p:'',    //성별 - 0: 정보없음, 1: 남성, 2: 여성
      // f_nation_p:0,  //보호자 국적 - 0: 정보없음, 1: 내국인, 2: 외국인
      // num_p:'',      //보호자 인증 확인 키값
      // di_p:'',       //본인확인, 통신사로부터 응답받은 DI 정보
      // ci_p:'',       //본인확인, 통신사로부터 응답받은 CI 정보

      recomId:'',		// 추천인아이디

      // 단체
      groupName:'',
      presentName:'',
      zipcode:'',
      addr_1:'',
      addr_2:'', 
      bizType:'',
      bizCond:'',
      bizTel_0:'02',
      bizTel_1:'',

      //attachFile:'',

      // 판매회원
      msName:"",
      msUrl: "",
      msFax_0: "02",
      msFax_1: "",
      msFax_2: "",
      msNetwork_0: "",
      msNetwork_1: "",
      msNetwork_2: "",
    },
    exData : {
      // 서로다른 컴포넌트의 state값을 주고받기위해서 만들었음
     	 auNum:0,       //
     	 statId:0,      //0:정보 입력, 1:아이디찾기 인증 성공, 2:인증 성공 계정 정보 없음
     	 tab_Mode:0,    //0:아이디찾기, 1:비번찾기
     	 statPw:0,      //0:정보 입력, 1:비번찾기 인증 성공, 2:인증 성공 계정 정보 없음, 3:비번 재설정 완료
     	 find_By:0,     //0:휴대전화로 찾기, 1:이메일로 찾기
       exchord:"",     //아이디 찾기 코드
       id:"",
       super_auth:"",   //행복쇼핑 권한
       },
    seller : {
                   // 서로다른 컴포넌트의 state값을 주고받기위해서 만들었음

      successLogin:"",     // 단체회원 로그인 0: 정보입력 1: 로그인 성공  2: 로그인 실패
    	UserGroupId : "",
    	MainUserId : "",  //담당자 id (개인 아이디)
    	MainUserName :"",     //담당자 id  ( 개인 이름)
    	groupCompanyName :"",      //상호(단체명)
    	groupePresentName :"",       // 대표자
    	lawNumber :0,       // 법인등록번호
    	companyNumber :0,       // 사업자등록번호
    	uniqueNumber :0,              //    고유번호
    	mainCompanyTelNumber:0,     // 대표 전화 번호
      bizType:"",     // 대표 전화 번호

      },

    validStatus : {
      // 개인 | 단체 공통
      userId:0,       //아이디 - 0:기본, 1:미입력, 2:형식오류, 3:중복아이디
      userNickname:0, //닉네임 - 0:기본, 1:미입력, 2:형식오류, 3:중복닉네임
      userPw:0,       //패스워드 - 0:기본, 1:미입력, 2:부적합
      userPw2:0,      //패스워드확인 - 0:기본, 1:미입력, 2:불일치
      terms:0,        //기본약관 - 0:기본, 1:미동의
      authNum:0,      //휴대폰인증 - 0:기본, 1:미인증, 2:인증번호 오류, 3:인증완료

      // 개인
      userName:0,     //이름 - 0:기본, 1:미입력
      birth:0,        //생일 - 0:기본, 1:년 미선택, 2:월 미선택, 3:일 미선택, 4:만14세미만
      mobile:0,       //휴대전화 - 0:기본, 1:미입력, 2:형식오류, 3:중복, 4:유효함
      email:0,        //이메일 - 0:기본, 1:미입력, 2:형식오류, 3:중복, 4:유효함
      gender:0,       //성별 - 0:기본, 1:미선택
      adultTerms: 0,  //보호자약관 - 0:기본, 1:미동의

      // 단체
      groupName:0,    //단체명 - 0:기본, 1:미입력
      presentName:0,  //대표자명 - 0:기본, 1:미입력
      addr:0,         //사업장소재지 - 0:기본, 1:미입력
      bizType:0,      //업종 - 0:기본, 1:미입력
      bizCond:0,      //업태 - 0:기본, 1:미입력
      bizTel:0,       //대표전화번호 - 0:기본, 1:미입력, 2:형식오류
      attachFile:0,   //기업증빙서류 - 0:기본, 1:미첨부
    },

    validMsg : {    // input name 값과 동일한 객체명에 validStatus 코드에 따른 메시지
      // 개인 | 단체 공통
      userId : {
        1:'아이디를 입력해 주세요.',
        2:'5~12자의 영문 소문자, 숫자와 특수기호(_)만 사용 가능합니다.',
        3:'이미 사용중인 아이디 입니다.',
      },
      userNickname : {
        1:'별명을 입력해 주세요.',
        2:'3~20자의 한글, 영문 소문자, 숫자와 특수기호(_)만 사용 가능합니다.',
        3:'이미 사용중인 별명 입니다.',
      },
      userPw : {
        1:'비밀번호를 입력해 주세요.',
        2:'6~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.',
      },
      userPw2 : {
        1:'비밀번호를 한 번 더 입력해 주세요.',
        2:'비밀번호가 일치하지 않습니다.',
      },
      terms : {
        1:'약관에 동의해야 가입이 진행됩니다.',
      },
      authNum : {
        1:'인증이 필요합니다.',
        2:'인증번호가 올바르지 않습니다.',
        3:'인증되었습니다',
      },

      // 개인
      userName : {
        1:'이름을 입력해 주세요.',
      },
      birth : {
        1:'태어난 년월일을 선택해 주세요.',
        2:'만 14세 미만의 어린이는 보호자의 동의가 필요합니다.',
      },
      mobile : {
        1:'휴대전화 번호를 입력해 주세요.',
        2:'휴대전화 번호를 확인해 주세요.',
        3:'이미 사용중인 휴대전화 번호 입니다.',
      },
      email : {
        1:'이메일을 입력해 주세요.',
        2:'이메일을 확인해 주세요.',
        3:'이미 사용중인 이메일 입니다.',
      },
      gender: {
        1:'성별을 선택해 주세요.'
      },
      adultTerms : {
        1:'보호자 약관에 동의해야 가입이 진행됩니다.',
      },
      adultAuth : {
        1:'보호자 인증이 필요합니다.',
        2:'다시 인증해 주세요.',
        3:'인증되었습니다',
      },

      // 단체
      groupName : {
        1:'단체명을 입력해 주세요.',
      },
      presentName : {
        1:'대표자명을 입력해 주세요.',
      },
      addr : {
        1:'사업장 소재지를 입력해 주세요.',
      },
      bizType : {
        1:'업종을 입력해 주세요.',
      },
      bizCond : {
        1:'업태를 입력해 주세요.',
      },
      bizTel : {
        1:'대표 전화번호를 입력해 주세요.',
        2:'대표 전화번호를 확인해 주세요',
      },
      // attachFile : {
      //   1:'가입증빙 서류를 첨부해 주세요.',
      // },
    },
  }
}

const setDatas = (state = initialValue, action) => {
  let obj = {}
  let obj_validStatus = {}
  let obj_formData = {}

  switch (action.type){
    case actions.SET_PROPS :
      if(action.data === undefined) return false;
      obj = Object.assign({}, state.data, action.data);

      // 약관 전체동의 check UI
      if( JSON.stringify(action.data).indexOf('termAgree0')!==-1 ){
        obj.termAgree1 = action.data['termAgree0'];
        obj.termAgree2 = action.data['termAgree0'];
        obj.termAgree3 = action.data['termAgree0'];
        obj.termAgree4 = action.data['termAgree0'];
      }else if(obj.termAgree1 && obj.termAgree2 && obj.termAgree3 && obj.termAgree4){
        obj.termAgree0 = true;
      }else if(!obj.termAgree1 || !obj.termAgree2 || !obj.termAgree3 || !obj.termAgree4){
        obj.termAgree0 = false;
      }

      // 보호자 동의 약관 전체동의 check UI
      if( JSON.stringify(action.data).indexOf('adultTermAgree0')!==-1 ){
        obj.adultTermAgree1 = action.data['adultTermAgree0'];
        obj.adultTermAgree2 = action.data['adultTermAgree0'];
        obj.adultTermAgree3 = action.data['adultTermAgree0'];
        obj.adultTermAgree4 = action.data['adultTermAgree0'];
        obj.adultTermAgree5 = action.data['adultTermAgree0'];
      }else if(obj.adultTermAgree1 && obj.adultTermAgree2 && obj.adultTermAgree3 && obj.adultTermAgree4 && obj.adultTermAgree5){
        obj.adultTermAgree0 = true;
      }else if(!obj.adultTermAgree1 || !obj.adultTermAgree2 || !obj.adultTermAgree3 || !obj.adultTermAgree4 || !obj.adultTermAgree5){
        obj.adultTermAgree0 = false;
      }

      // 판매자 약관 전체동의 check UI
      if( JSON.stringify(action.data).indexOf('sellerTermAgree0')!==-1 ){
        obj.sellerTermAgree1 = action.data['sellerTermAgree0'];
        obj.sellerTermAgree2 = action.data['sellerTermAgree0'];
        obj.sellerTermAgree3 = action.data['sellerTermAgree0'];
        obj.sellerTermAgree4 = action.data['sellerTermAgree0'];
        obj.sellerTermAgree5 = action.data['sellerTermAgree0'];
      }else if(obj.sellerTermAgree1 && obj.sellerTermAgree2 && obj.sellerTermAgree3 && obj.sellerTermAgree4 && obj.sellerTermAgree5){
        obj.sellerTermAgree0 = true;
      }else if(!obj.termAgree1 || !obj.sellerTermAgree2 || !obj.sellerTermAgree3 || !obj.sellerTermAgree4 || !obj.sellerTermAgree5){
        obj.sellerTermAgree0 = false;
      }

      return {
        data:obj,
      }

    case actions.CHANGE_INPUT :
      if(action.event === undefined) return false;
      const regNum = /[^0-9-]/gi
      const numSet = ['authNum','mobile_1','bizTel_1','msFax_1',   'msFax_2',  'msNetwork_0', 'msNetwork_0', 'msNetwork_2']
      const nospaceSet = ['authNum','userId','userPw','recomId','email_id','email_domain','mobile_1','bizTel_1','msName','msUrl','msNetwork_1']

      let name = action.event.target.name;
      let value = action.event.target.value;

      // 특정 필드값 공백제거
      if(nospaceSet.indexOf(name)!==-1){
        value = value.replace(/-/gi,'');
      }

      // 특정 필드값 숫자와 -만 입력
      if(numSet.indexOf(name)!==-1){
        value = value.replace(regNum,'');
      }

      if(name === 'authNum'){
        obj = {authNum:value};
      }else{
        const _obj = {};
        _obj[name] = value;
        const _formObj = Object.assign({},state.data.formData, _obj);
        obj = {formData: Object.assign({},state.data.formData, _formObj)}
      }
      return {
        data: Object.assign({}, state.data, obj)
      }

    case actions.BLUR_INPUT :
      if(action.event === undefined) return false;

      const blur_value = action.event.target.value
      let blur_name = action.event.target.name

      switch (blur_name) {
        case 'bizTel_1':
          let target = 'bizTel';
          let mobileFull = state.data.formData.mobile_0 + blur_value;
          if(blur_name === 'bizTel_1'){
            target = 'bizTel';
            mobileFull = state.data.formData.bizTel_0 + blur_value
          }

          if(blur_value===''){
            obj_validStatus[target] = 1;
          } else if(!format.isTel(mobileFull)){
            obj_validStatus[target] = 2;
          } else {
            obj_validStatus[target] = 0;
          }
          break;
        case 'userPw':
          if(blur_value===''){
            obj_validStatus[blur_name] = 1;

            obj['passwordLevel'] = 0;
            obj['passwordLevel2'] = 0;
            obj_formData['userPw2'] = '';
          }else{
            if(blur_value.length<6){
              obj_validStatus[blur_name] = 2;
            } else {
              obj_validStatus[blur_name] = 0;
            }
            let pwLevel = format.getPasswordLevel(blur_value);
            obj['passwordLevel'] = pwLevel;
            obj['passwordLevel2'] = 0;
            obj_formData['userPw2'] = '';
            if(pwLevel<3){
              obj_formData['userPw'] = '';
            }
          }
          break;
        case 'userPw2':
  				if(state.data.validStatus.userPw===2 || state.data.passwordLevel < 3){
  					return{
              data: Object.assign({}, state.data, {
                formData:Object.assign({}, state.data.formData, {userPw2:''})
              })
            };
  				}
          if(blur_value===''){
            obj_validStatus[blur_name] = 1;
            obj['passwordLevel2'] = 0;
          }else{
            if(state.data.formData.userPw===blur_value){
              obj_validStatus[blur_name] = 0;
              obj['passwordLevel2'] = 1;
            }else{
              obj_validStatus[blur_name] = 2;
              obj['passwordLevel2'] = 0;
              obj_formData['userPw2'] = '';
            }
          }
          break;
        default:
          if(blur_name==='addr_2'){
            blur_name = 'addr';
          }
          if(blur_name==='email_id'){
            blur_name = 'email';
          }

          if(blur_value===''){
            obj_validStatus[blur_name] = 1;
          } else {
            obj_validStatus[blur_name] = 0;
          }
          break;
      }

      const blur_o = {
        validStatus:Object.assign({}, state.data.validStatus, obj_validStatus),
        formData:Object.assign({}, state.data.formData, obj_formData),
      }

      return{
        data: Object.assign({}, state.data, blur_o, obj)
      }

    case actions.CHANGE_RADIO :
      if(action.event === undefined) return false

  		const radio_name = action.event.target.name
  		const radio_value = parseInt(action.event.target.value,10)

  		obj_formData[radio_name] = radio_value
      obj_validStatus[radio_name] = 0

  		obj = {
        formData: Object.assign({}, state.data.formData, obj_formData),
        validStatus: Object.assign({}, state.data.validStatus, obj_validStatus),
      }

      return {
        data:Object.assign({}, state.data, obj)
      }

    default:
      return initialValue;
  }
}

export default combineReducers({setDatas})
