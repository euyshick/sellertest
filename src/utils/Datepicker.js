import React, { Component } from 'react'
import moment from 'moment'
import DayPicker, { DateUtils } from 'react-day-picker'

//import 'react-day-picker/lib/style.css'
import './lib/react-day-picker.css'

const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const overlayStyle = {
  position: 'absolute',
  background: 'white',
  boxShadow: '0 2px 5px rgba(0, 0, 0, .15)',
  zIndex: 100,
  marginTop: '1px',
};

export default class Datepicker extends Component {
  constructor(props) {
    super(props);
    this._handleDayClick = this._handleDayClick.bind(this);
    this._handleInputChange = this._handleInputChange.bind(this);
    this._handleInputFocus = this._handleInputFocus.bind(this);
    this._handleInputBlur = this._handleInputBlur.bind(this);
    this._handleContainerMouseDown = this._handleContainerMouseDown.bind(this);
  }

  state = {
    showOverlay: false,
    value: '',
    selectedDay: null,
    name: null,
    inputClass: null,
    inputId: null,
    defaultValue: null
  }

  componentWillUnmount(){
    clearTimeout(this.clickTimeout);
  }
  componentDidMount(){
    this.setState({
      name : this.props.name,
      inputClass : this.props.className,
      inputId : this.props.id,
      value: this.props.defaultValue ? this.props.defaultValue : moment().format("YYYY-MM-DD"),
    });
  }
  componentWillUpdate(nextProps, nextState){
    if(this.props.className !== nextProps.className){
      this.setState({
        inputClass : nextProps.className,
      });
    }
  }
  componentDidUpdate(prevProps,prevState){
    if(this.props.eventChange && prevState.value !== this.state.value){
      this.props.eventChange(this.state.value);
    }
  }

  input = null;
  daypicker = null;
  clickedInside = false;
  clickTimeout = null;

  _handleContainerMouseDown() {
    this.clickedInside = true;
    // The input's onBlur method is called from a queue right after onMouseDown event.
    // setTimeout adds another callback in the queue, but is called later than onBlur event
    this.clickTimeout = setTimeout(() => {
      this.clickedInside = false;
    }, 0);
  }

  _handleInputFocus() {
    this.setState({
      showOverlay: true,
    });
  }

  _handleInputBlur() {
    const showOverlay = this.clickedInside;

    this.setState({
      showOverlay,
    });

    // Force input's focus if blur event was caused by clicking on the calendar
    if (showOverlay) {
      this.input.focus();
    }
  }

  _handleInputChange(e) {   //console.log(this.state.value)
    e.target.value = isNaN(parseInt(e.target.value,10))?'':e.target.value;

    const { value } = e.target;
    const momentDay = moment(value, 'L', true);
    if (momentDay.isValid()) {
      this.setState({
        selectedDay: momentDay.toDate(),
        value,
      }, () => {
        this.daypicker.showMonth(this.state.selectedDay);
      });
    } else {
      this.setState({ value, selectedDay: null });
    }
    return value;
  }


  _handleDayClick(day) {
    this.setState({
      value: moment(day).format("YYYY-MM-DD"),
      selectedDay: day,
      showOverlay: false,
    });
    this.input.blur();
  }

  render() {
    const style = Object.assign({},overlayStyle,this.props.style);
    return (
      <span onMouseDown={ this._handleContainerMouseDown }>
        <input
          type="text"
          maxLength="10"
          ref={ (el) => { this.input = el; } }
          placeholder="YYYY-MM-DD"
          name={ this.state.name }
          className={ this.state.inputClass }
          id={ this.state.inputId }
          value={ this.state.value }
          onChange={ this._handleInputChange }
          onFocus={ this._handleInputFocus }
          onBlur={ this._handleInputBlur }
        />
        <button type="button"
          className="btn-cal"
          onFocus={ this._handleInputFocus }
          onBlur={ this._handleInputBlur }>
          <span className="ir">달력</span>
        </button>

        {this.state.showOverlay &&
           <div style={ style }>
            <DayPicker
              enableOutsideDays
              ref={ (el) => { this.daypicker = el; } }
              months={ MONTHS }
              weekdaysShort={ WEEKDAYS }
              weekdaysLong={ WEEKDAYS }
              initialMonth={ this.state.selectedDay || undefined }
              onDayClick={ this._handleDayClick }
              selectedDays={ day => DateUtils.isSameDay(this.state.selectedDay, day) }
            />
          </div>
        }
      </span>
    );
  }
}
