import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import Header from './Header'
import Sidebar from './Sidebar'
import defaultBG from './Images/default.png'
import matrixBG from './Images/matrix.png'
import deepblueBG from './Images/deepblue.png'
import fireBG from './Images/fire.png'
import invertBG from './Images/inverted.png'
import roseBG from './Images/rose.png'

class Reader extends Component{
  constructor(props){
    super(props)
    this.state = {
      showHome: 'block',
      showNewFile: 'none',
      showSampleSize:'none',
      sampleSize: 0,

      content:[],
      isLoaded:false,
      fileName:null,

      isSpread:false,
      isDoc:false,

      inputSize:20,
      currentCell: 0,

      categories: [],

      tbColor: 'black',
      tbBG:'white',
      font:12,

      TitleText:'block',
      TitleSet:'none',

      showMain: 'block',
      showEdit: 'none',
      showStats:'none',

      mean:0,
      variance:0,
      sd:0
    }
  }

  //GENERAL FUNCTIONS
  uploadFile = (files, rejectedFiles) => {
    const spreadFormat = document.getElementById('spread')
    const docFormat = document.getElementById('doc')
    const inputSize = this.state.inputSize
    if(spreadFormat.checked == false && docFormat.checked ==  false){
      alert('Please select a file format')
    }
    else if(spreadFormat.checked == true){
      const content = this.state.content
      const reader = new FileReader()
      reader.onload = function(){
        const lines = reader.result.split('\n').map(function(line){
          if(line != ''){
            content.push(line)
          }
        })
        for(var i=0; i<content.length;i++){
          const input = document.createElement('input')
          input.value = content[i]
          input.style.margin = '5px'
          input.style.padding = '5px'
          input.style.borderRadius = '5px'
          input.size = inputSize
          input.className = 'spreadsheetInput'
          document.getElementById('inputSection').appendChild(input)
        }
      }
      reader.readAsText(files[0])
      this.setState({isSpread:true})
      this.setState({content:content})
      this.setState({fileName:files[0].name})
    }
    else if (docFormat.checked ==  true){
      const content = this.state.content
      const reader = new FileReader()
      reader.onload = function(){
        document.getElementById('textarea').value = reader.result
      }
      reader.readAsText(files[0])
      this.setState({isDoc:true})
      this.setState({fileName:files[0].name})
    }
  }
  newFile = () => {
    this.setState({isSpread:false})
    this.setState({isDoc:false})
    this.setState({content:[]})
  }

  //SPREADSHEET FUNCTIONS
  cellFind = () => {
    const cellVal = document.getElementById('cellFind').value - 1
    const content = this.state.content
    document.getElementById('cellVal').innerText = 'Value: ' + content[cellVal]
    this.setState({currentCell:cellVal})
  }
  nextCell = () => {
    var cellVal = this.state.currentCell
    const content = this.state.content
    cellVal++
    document.getElementById('cellFind').value = cellVal+1
    document.getElementById('cellVal').innerText = 'Value: ' + content[cellVal]
    this.setState({currentCell:cellVal})
  }
  adjustInputSize = () => {
    const slider = document.getElementById('sizeSlider')
    const inputSize = this.state.inputSize
    var inputs = document.getElementsByClassName("spreadsheetInput");
    for(var i=0; i<inputs.length;i++){
      inputs[i].size = slider.value
    }
    this.setState({inputSize:slider.value})
  }
  resetSize = () => {
    const inputSize = this.state.inputSize
    var inputs = document.getElementsByClassName("spreadsheetInput");
    for(var i=0; i<inputs.length;i++){
      inputs[i].size = 20
    }
    this.setState({inputSize:20})
  }
  getStatistics = () => {
    const content = this.state.content
    var numList = []
    for(var i=0; i<content.length; i++){
      if(!isNaN(content[i])){
        numList.push(content[i])
      }
    }
    var total = 0
    for(var i=0; i<numList.length; i++){
      total += (Number(numList[i]))
    }
    var mean = total/Number(numList.length)
    mean = Math.round(mean * 100)/100
    this.setState({mean:mean})

    var variance = 0
    for(var i=0; i<numList.length;i++){
        variance += (Math.pow((numList[i]-mean), 2))
    }
    variance = variance/numList.length
    variance = Math.round(variance * 100)/100
    this.setState({variance:variance})

    var sd = Math.sqrt(variance)
    sd = Math.round(sd * 100)/100
    this.setState({sd:sd})

    this.setState({showMain:'none'})
    this.setState({showStats:'block'})
  }
  deleteCell = () => {
    if(document.getElementById('cellFind').value == ''){
      alert('Please selected a cell to first')
    }
    else {
      const content = this.state.content
      const cellNum = document.getElementById('cellFind').value
      content.splice((cellNum-1), 1)
      var allInputs = document.getElementById('inputSection')
      const inputSize = this.state.inputSize
      while (allInputs.firstChild){
        allInputs.removeChild(allInputs.firstChild)
      }
      const header = document.createElement('h1')
      header.innerText = this.state.fileName
      document.getElementById('inputSection').appendChild(header)
      for(var i=0; i<content.length;i++){
        const input = document.createElement('input')
        input.value = content[i]
        input.style.margin = '5px'
        input.style.padding = '5px'
        input.style.borderRadius = '5px'
        input.size = inputSize
        input.className = 'spreadsheetInput'
        document.getElementById('inputSection').appendChild(input)
      }
      this.setState({content:content})
    }
  }
  editCell = () => {
    if(document.getElementById('cellFind').value == ''){
      alert('Please selected a cell to edit first')
    }
    else {
      this.setState({showMain:'none'})
      this.setState({showEdit:'block'})
      const cellVal = document.getElementById('cellFind').value - 1
      const content = this.state.content
      document.getElementById('selectedCellName').innerText = 'Cell: ' + document.getElementById('cellFind').value
      document.getElementById('selectedCellValue').value = content[cellVal]
    }
  }
  setCell = () =>{
    this.setState({showMain:'block'})
    this.setState({showEdit:'none'})
    const newVal = document.getElementById('selectedCellValue').value
    const cellVal = document.getElementById('cellFind').value - 1
    const content = this.state.content
    content[cellVal] = newVal
    this.setState({content:content})
    var allInputs = document.getElementById('inputSection')
    const inputSize = this.state.inputSize
    while (allInputs.firstChild){
      allInputs.removeChild(allInputs.firstChild)
    }
    const header = document.createElement('h1')
    header.innerText = this.state.fileName
    document.getElementById('inputSection').appendChild(header)
    for(var i=0; i<content.length;i++){
      const input = document.createElement('input')
      input.value = content[i]
      input.style.margin = '5px'
      input.style.padding = '5px'
      input.style.borderRadius = '5px'
      input.size = inputSize
      input.className = 'spreadsheetInput'
      document.getElementById('inputSection').appendChild(input)
    }
  }
  setType = () => {
    var Options = this.refs.typeMenu
    var typeChosen = Options.options[Options.selectedIndex].text
    if(typeChosen == 'Category'){
      const cellVal = document.getElementById('cellFind').value - 1
      const content = this.state.content
      this.state.categories.push(content[cellVal])
      const label = document.createElement('label')
      label.innerText = content[cellVal]
      label.style.padding = '5px'
      label.style.background = 'linear-gradient(#878787, white)'
      label.style.margin = '10px'
      document.getElementById('categoriesList').appendChild(label)
    }
  }
  clearCells = () => {
    const content = this.state.content
    const inputSize = this.state.inputSize
    var allInputs = document.getElementById('inputSection')
    while (allInputs.firstChild){
      allInputs.removeChild(allInputs.firstChild)
    }
    const header = document.createElement('h1')
    header.innerText = this.state.fileName
    document.getElementById('inputSection').appendChild(header)
    for(var i=0; i<content.length;i++){
      const input = document.createElement('input')
      input.style.margin = '5px'
      input.style.padding = '5px'
      input.style.borderRadius = '5px'
      input.size = inputSize
      input.className = 'spreadsheetInput'
      document.getElementById('inputSection').appendChild(input)
    }
  }

  //DOCUMENT FUNCTIONS
  clearDoc = () => {
    document.getElementById('textarea').value = ''
    this.setState({fileName:''})
  }
  changeTitle = () => {
    document.getElementById('titleSetter').value = this.state.fileName
    this.setState({TitleText:'none'})
    this.setState({TitleSet:'block'})
  }
  setTitle = () => {
    const newTitle = document.getElementById('titleSetter').value
    this.setState({fileName:newTitle})
    this.setState({TitleText:'block'})
    this.setState({TitleSet:'none'})
  }
  BoxColorDefault = () => {this.setState({tbColor:'black'}), this.setState({tbBG:'white'})}
  BoxColorMatrix = () => {this.setState({tbColor:'#12ff00'}), this.setState({tbBG:'black'})}
  BoxColorDeep = () => {this.setState({tbColor:'#00eaff'}), this.setState({tbBG:'#02001f'})}
  BoxColorInverted = () => {this.setState({tbColor:'white'}), this.setState({tbBG:'black'})}
  BoxColorFire = () => {this.setState({tbColor:'#ff0000'}), this.setState({tbBG:'#2b0000'})}
  BoxColorRose = () => {this.setState({tbColor:'#7b00a3'}), this.setState({tbBG:'#17001f'})}
  increaseFont = () => {
    var font = this.state.font
    font+=2
    this.setState({font:font})
  }
  decreaseFont = () => {
    var font = this.state.font
    font-=2
    this.setState({font:font})
  }
  find_replace = () => {
    const paragraph = document.getElementById('textarea').value
    const currentWord = document.getElementById('findWord').value
    const newWord = document.getElementById('replaceWord').value
    const new_paragraph = paragraph.replace(currentWord, newWord)
    document.getElementById('textarea').value = new_paragraph
  }
  exportDoc = () => {
    const content = document.getElementById('textarea').value
    const fileName = this.state.fileName
    var element = document.createElement("a");
    var file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file)
    element.download = fileName + '.txt'
    element.click();
  }

  render(){
    var {Content, isLoaded, fileName, isSpread, isDoc} = this.state
    if(!isLoaded && !isSpread && !isDoc){
      return(
        <div>
          <div>
            <Header/>
          </div>
          <div id='dropzone' style={{display:this.state.showHome}}>
            <div id='dropper'>
              <Dropzone onDrop={this.uploadFile} maxSize={5000000}>Upload File</Dropzone>
            </div>
            <div id='fileSec'>
              <h3>File Type</h3>
              Spreadsheet <input type='radio' id='spread' name='fileType' class='radio'/>
              Document <input type='radio' id='doc' name='fileType' class='radio'/>
            </div>
          </div>
        </div>
      )
    }
    else if(isSpread){
      return(
        <div>
          <div>
            <Header/>
          </div>
          <div id='toolbar'>
            <span id='toolbarItem'>
              <button onClick={this.newFile} class='but'>New File</button>
              <button onClick={this.clearCells} class='but'>Clear All</button>
            </span><br/>
            <hr/>
            <span id='toolbarItem'>
              <label>Cell size
                <input type='range' onChange={this.adjustInputSize} min='5' max='100' value={this.state.inputSize} id='sizeSlider'/>
              </label>
              <button class='but' onClick={this.resetSize}>reset</button>
            </span><br/>
            <hr/>
            <span id='toolbarItem'>
              <button class='but' onClick={this.getStatistics}>Statistics</button>
            </span>
            <hr/>
            <span id='toolbarItem'>
              <label>Get all </label>
              <select name="data_select" id='selectMenu'>
                <option value="string">String</option>
                <option value="numeric">Numeric</option>
              </select>
              <label style={{marginRight:10}}> values</label>
            </span><br/><br/>
            <span id='toolbarItem'>
              <label>Set as </label>
              <select name="value_select" id='selectMenu'>
                <option value="header">Header</option>
              </select>
            </span><br/><br/>
            <span id='toolbarItem'>
              <button class='but'>Set</button>
            </span>
            <br/>
            <hr/>
            <span id='toolbarItem'>
              <label>Find cell <input type='text' id='cellFind'
                size={15} onChange={this.cellFind}/><button class='but' style={{marginLeft:10, fontSize:14}} onClick={this.nextCell}>Next</button>
              </label><br/>
              <label id='cellVal' style={{textAlign:'center', marginLeft:20}}></label>
            </span><br/><br/>
            <span id='toolbarItem'>
              <button class='but' onClick={this.editCell}>Edit</button>
              <button onClick={this.deleteCell} class='but'>Delete</button>
            </span><br/><br/>
            <span id='toolbarItem'>
              <label>Set as </label>
              <select name="cell_value" id='selectMenu' ref='typeMenu'>
                <option value="category">Category</option>
              </select>
              <button class='but' onClick={this.setType}>Set</button>
            </span>
            <hr/>
            <span id='toolbarItem'>
              <button class='but' style={{fontSize:26}}>Export</button>
            </span>
          </div>
          <div id='inputSection' style={{display:this.state.showMain}}>
            <h1>{this.state.fileName}</h1>
            <div id='categoriesList' style={{marginBottom: 10}}></div>
          </div>
          <div id='editSec' style={{display:this.state.showEdit}}>
            <label id='selectedCellName'></label>
            <input id='selectedCellValue'></input>
            <button onClick={this.setCell} class='but' style={{fontSize:30, marginLeft:20}}>Set</button>
          </div>
          <div id='statsSection' style={{display:this.state.showStats}}>
            <h2>Statistics</h2>
            <h3>Mean: {this.state.mean}</h3>
            <h3>Variance: {this.state.variance}</h3>
            <h3>Standard Deviation: {this.state.sd}</h3>
            <button class='but'
              onClick={()=>{this.setState({showMain:'block'}), this.setState({showStats:'none'})}}>
              Return
            </button>
          </div>
        </div>
      )
    }
    else if(isDoc){
      return(
        <div>
          <div>
            <Header/>
          </div>
          <div id='palleteBox'>
            <button onClick={this.newFile} class='but' style={{marginLeft:10}}>New File</button>
            <button onClick={this.clearDoc} class='but' style={{marginLeft:10}}>Clear Doc</button>
            <button onClick={this.changeTitle} class='but' style={{marginLeft:10}}>Set Title</button><br/>
            <hr/>
            <span id='colorPicker'>
              <img src={defaultBG} class='palette' width={24} height={24} onClick={this.BoxColorDefault}/>
              <img src={matrixBG} class='palette' width={24} height={24} onClick={this.BoxColorMatrix}/>
              <img src={deepblueBG} class='palette' width={24} height={24} onClick={this.BoxColorDeep}/>
              <img src={invertBG} class='palette' width={24} height={24} onClick={this.BoxColorInverted}/>
              <img src={fireBG} class='palette' width={24} height={24} onClick={this.BoxColorFire}/>
              <img src={roseBG} class='palette' width={24} height={24} onClick={this.BoxColorRose}/>
            </span>
            <hr/>
            <span style={{marginLeft:15, marginRight:15}}>
              <label>Zoom</label>
              <button class='but' onClick={this.decreaseFont}>-</button>
              <button class='but' onClick={this.increaseFont}>+</button>
            </span><br/>
            <hr/>
            <label style={{marginLeft:10}}>Find <input type='text' id='findWord' size={15}/></label><br/><br/>
            <label style={{marginLeft:10}}>Replace with <input type='text' id='replaceWord' size={15} style={{marginRight:10}}/></label><br/><br/>
            <button class='but' onClick={this.find_replace} style={{marginRight:15, marginLeft:10}}>Go</button><br/>
            <hr/>
            <button class='but' onClick={this.exportDoc} style={{fontSize:26, marginLeft:10}}>Export</button>
          </div>
          <div id='docSection'>
            <h1 style={{color:'white', display:this.state.TitleText}}>{this.state.fileName}</h1>
            <hr/>
            <input type='text' id='titleSetter' size={15} style={{display:this.state.TitleSet}}/>
            <button onClick={this.setTitle} style={{display:this.state.TitleSet, fontSize:26}} class='but'>Set</button>
            <textarea id='textarea' rows={44} cols={80} style={{fontSize:this.state.font, backgroundColor:this.state.tbBG, color:this.state.tbColor}}/>
          </div>
        </div>
      )
    }
  }
}

export default Reader
