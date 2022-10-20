import React from 'react';
// import { useNavigate } from 'react-router-dom';
import InfoTooltip from './InfoTooltip';
import * as auth from '../auth.js';


class Login extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        email: '',
      password: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }
  handleChange(e) {
    const {name, value} = e.target;
    this.setState({
      [name]: value
    });
  }
  handleSubmit(e){
    e.preventDefault();
    // здесь обрабатываем вход в систему
    if (!this.state.email || !this.state.password){
        return;
      }
      auth.authorize(this.state.email, this.state.password)
      .then((data) => {
        if (data.jwt){
    this.setState({email: '',
            password: ''},() => {
    // this.props.handleLogin();
      this.props.onLoginSuccess();
    /* переадресовать пользователя на /diary методом history.push */;
    })
  }
        // нужно проверить, есть ли у данных jwt
        // сбросьте стейт, затем в колбэке установите
        // стейт loggedIn родительского App как true,
        // затем перенаправьте его в /diary
      })
      .catch(err => console.log(err));
  }
  render(){
    return(
        <>
      <div className="login">
        <p className="login__welcome">
          Вход
        </p>
        <form onSubmit={this.handleSubmit} className="login__form">
          <input required className="login__input" placeholder="Email" id="email" name="email" type="email" value={this.state.email} onChange={this.handleChange} />
          <input required className="login__input" placeholder="Пароль"  id="password" name="password" type="password" value={this.state.password} onChange={this.handleChange} />
          <div className="login__button-container">
            <button type="submit" className="login__link">Войти</button>
          </div>
        </form>
      </div>
      <InfoTooltip />
      </>
    )
  }
}

export default Login;
