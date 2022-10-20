import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InfoTooltip from './InfoTooltip';
import * as auth from '../auth.js';


class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      tipOpen: false,

    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    
  }
  handleChange = (e) => {
    const {name, value} = e.target;
    this.setState({
      [name]: value
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    // здесь обработчик регистрации
      auth.register(this.state.password, this.state.email).then((res) => {
        if(res){
          this.setState({
            message: '',
            tipOpen: true
          }, () => {
            // this.props.onRegSuccess();
          })
        } else {
          this.setState({
            message: 'Что-то пошло не так!'
          })
        };
         });
    }
  
  render() {
    return (
      <>
      <div className="register">
        <p className="register__welcome login__welcome">
            Регистрация
        </p>
        <form onSubmit={this.handleSubmit} className="register__form login__form">
          <label htmlFor="email">
            Email:
          </label>
          <input className="login__input" placeholder="Email" id="email" name="email" type="email" value={this.state.email} onChange={this.handleChange} />
          <label htmlFor="password">
            Пароль:
          </label>
          <input className="login__input" placeholder="Пароль"  id="password" name="password" type="password" value={this.state.password} onChange={this.handleChange} />
          <div className="register__button-container">
            <button type="submit" onSubmit={this.handleSubmit} className="register__link login__link">Зарегистрироваться</button>
          </div>
        </form>
        <div className="register__signin">
          <Link to="/signin" className="register__login-link" >Уже зарегистрированы? Войти</Link>
        </div>
        </div>
        <InfoTooltip isOpen={this.state.tipOpen} name="tip " />
        </>

  );
  }

}

export default Register;