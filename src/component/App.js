import React, {Component} from 'react'
import {connect} from 'react-redux'
import Chart from './Chart'
import Board from './Board'
import EditTask from './EditTask'
import EditMember from './EditMember'
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
      members: this.props.members
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
  handleShowMember(){
    this.props.dispatch(updateFlags({showMemberFlag: !this.props.flags.showMemberFlag}))
  }
  render() {
    const showChartFlag = this.props.flags.showChartFlag;
    const showArchiveFlag = this.props.flags.showArchiveFlag;
    const showMemberFlag = this.props.flags.showMemberFlag;
    return (
      <div>
        <div className="topMenu">
          <h1 className="topMenuTtl">ReactGanttChart</h1>
          <div className="topMenuTabs">
            <button className={showChartFlag ? 'on' : ''} onClick={()=>this.handleShowChart(true)}>Chart</button>
            <button className={!showChartFlag ? 'on' : ''} onClick={()=>this.handleShowChart(false)}>Board</button>
            <button className={showArchiveFlag ? 'on' : ''} onClick={()=>this.handleShowArchive()}>Archive</button>
            <button className={showMemberFlag ? 'on' : ''} onClick={()=>this.handleShowMember()}>Member</button>
          </div>
        </div>
        {this.props.flags.showChartFlag ? <Chart/> : <Board/>}
        {this.props.flags.showTaskFlag && <EditTask/>}
        {this.props.flags.showMemberFlag && <EditMember/>}
      </div>
    )
  }
}

let propsState = (state) => {
  return {
    tasks: state.tasks,
    members: state.members,
    flags: state.flags,
    keys: state.keys
  }
}

export default connect(propsState)(App)
