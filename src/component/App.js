import React, {Component} from 'react'
import {connect} from 'react-redux'
import Chart from './Chart'
import Board from './Board'
import EditTask from './EditTask'
import EditCategory from './EditCategory'
import {updateFlags} from '../action'
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
  handleShowChart(){
    this.props.dispatch(updateFlags({showChartFlag: !this.props.flags.showChartFlag}))
  }
  handleSort() {
    this.props.dispatch(updateFlags({sortFlag: !this.props.flags.sortFlag}))
  }
  handleShowArchive(){
    this.props.dispatch(updateFlags({showArchiveFlag: !this.props.flags.showArchiveFlag}))
  }
  handleShowCategory(){
    this.props.dispatch(updateFlags({showCategoryFlag: !this.props.flags.showCategoryFlag}))
  }
  render() {
    const showChartFlag = this.props.flags.showChartFlag;
    const sortFlag = this.props.flags.sortFlag;
    const showArchiveFlag = this.props.flags.showArchiveFlag;
    const showCategoryFlag = this.props.flags.showCategoryFlag;
    return (
      <div>
        <div className="topMenu">
          <h1 className="topMenuTtl">ReactGanttChart</h1>
          <div className="topMenuTabs">
            <button className={showChartFlag ? 'on' : ''} onClick={()=>this.handleShowChart(true)}>Chart</button>
            <button className={!showChartFlag ? 'on' : ''} onClick={()=>this.handleShowChart(false)}>Board</button>
            <button className={sortFlag ? 'on' : ''} onClick={()=>this.handleSort()}>Sort</button>
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
