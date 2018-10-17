import React, { Component } from 'react';
import logo from './Images/logo.png'

class Header extends Component{
  render(){
    return(
      <div id='header'>
        <img src={logo}/>
      </div>
    )
  }
}

export default Header
