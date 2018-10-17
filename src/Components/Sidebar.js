import React, { Component } from 'react';

class Item extends Component{
  constructor(props){
    super(props)
  }

  render(){
    return(
      <div id='sideItem'>
        <h1>{this.props.name}</h1>
        <hr/>
      </div>
    )
  }
}

class Sidebar extends Component{
  constructor(props){
    super(props)
    this.state = {}
  }

  render(){
    return(
      <div id='sidebar'>
        <Item name='Statistics'/>
        <Item name='Results'/>
      </div>
    )
  }
}

export default Sidebar
