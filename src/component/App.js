import React, {Component} from 'react'
import {connect} from 'react-redux'
import Chart from './Chart'
import Board from './Board'
import EditTask from './EditTask'
import EditCategory from './EditCategory'
import {updateFlags} from '../action'
import {slideAnimation} from 'blackout-animation'
import "../css/app.scss";

class App extends Component {
  constructor(props) {
    super(props);
  }
  componentDidUpdate(){
    const data = {
      tasks: this.props.tasks,
      categories: this.props.categories
    };
    const storage = JSON.stringify(data);
    localStorage.setItem('ReactGanttChart', storage);
  }
  handleShowChart(chart){
    const flag = chart === this.props.flags.showChartFlag;
    if(flag) return false;
    slideAnimation({
      type: 1,
      transition: 400,
      interval: 200,
      color: '#f0f0f0'
    },()=>{
      this.props.dispatch(updateFlags({showChartFlag: !this.props.flags.showChartFlag}))
    })
  }
  handleShowArchive(){
    this.props.dispatch(updateFlags({showArchiveFlag: !this.props.flags.showArchiveFlag}))
  }
  handleShowCategory(){
    this.props.dispatch(updateFlags({showCategoryFlag: !this.props.flags.showCategoryFlag}))
  }
  render() {
    const showChartFlag = this.props.flags.showChartFlag;
    const showArchiveFlag = this.props.flags.showArchiveFlag;
    const showCategoryFlag = this.props.flags.showCategoryFlag;
    return (
      <div>
        <div className="topMenu">
          <h1 className="topMenuTtl">ReactGanttChart</h1>
          <div className="topMenuTabs">
            <button className={showChartFlag ? 'on' : ''} onClick={()=>this.handleShowChart(true)}>Chart</button>
            <button className={!showChartFlag ? 'on' : ''} onClick={()=>this.handleShowChart(false)}>Board</button>
            <button className={showArchiveFlag ? 'on' : ''} onClick={()=>this.handleShowArchive()}>Archive</button>
            <button className={showCategoryFlag ? 'on' : ''} onClick={()=>this.handleShowCategory()}>Category</button>
          </div>
        </div>
        {this.props.flags.showChartFlag ? <Chart/> : <Board/>}
        {this.props.flags.showTaskFlag && <EditTask/>}
        {this.props.flags.showCategoryFlag && <EditCategory/>}
      </div>
    )
  }
}

let propsState = (state) => {
  return {
    tasks: state.tasks,
    categories: state.categories,
    flags: state.flags,
    keys: state.keys
  }
}

export default connect(propsState)(App)
