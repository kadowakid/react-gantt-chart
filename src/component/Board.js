import React, {Component} from 'react'
import {connect} from 'react-redux'
import {sortTasks, sortMembers} from '../modules/sortData'
import {updateMembers,updateFlags,updateKeys} from '../action'
import generateKey from '../modules/generateKey'
import {CSSTransitionGroup} from 'react-transition-group';

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addMembersFlag: false
    }
  }
  showTask(taskKey,memberKey) {
    this.props.dispatch(updateKeys({
      taskKey : taskKey,
      memberKey : memberKey
    }));
    this.props.dispatch(updateFlags({showTaskFlag: true}))
  }
  showAddMembersArea(e){
    e.stopPropagation();
    this.setState({
      addMembersFlag: true
    })
  }
  memberTaskNum(memberKey){
    let num = 0;
    const archiveFlag = this.props.flags.showArchiveFlag;
    const tasks = this.props.tasks;
    Object.keys(tasks).forEach((key) => {
      if(memberKey === tasks[key].memberKey && (archiveFlag ? true : !tasks[key].archive)) num++;
    });
    return num;
  }
  addMembers() {
    const name = this.refs.boardAddMembers.value;
    if(!name){return false}
    const num = Object.keys(this.props.members).length;
    const memberKey = generateKey();
    const newMember = {
      name: name,
      num: num,
      memberKey: memberKey
    }
    this.props.dispatch(updateMembers(newMember,memberKey));
    this.refs.boardAddMembers.value = '';
    this.setState({addMembersFlag: false})
  }
  render() {
    const showArchiveFlag = this.props.flags.showArchiveFlag;
    const addMembersFlag = this.state.addMembersFlag;
    const membersArray = this.props.members && sortMembers(Object.keys(this.props.members).map(key => {return this.props.members[key]}))
    const tasksArray = this.props.tasks && sortTasks(Object.keys(this.props.tasks).map(key => {return this.props.tasks[key]}))
    return (
    <div>
      <div className="boardArea" onClick={()=>this.setState({addMembersFlag: false})}>
        {
          membersArray.map((member) => (
          <div key={member.memberKey} className="boardAreaMember">
            <h2 className="boardAreaMemberName">
              {member.name + '（' + this.memberTaskNum(member.memberKey) + '）'}
              <button onClick={() => this.showTask(false,member.memberKey)}>＋</button>
            </h2>
            <CSSTransitionGroup transitionName="fade" transitionAppear={true} transitionAppearTimeout={500} transitionEnterTimeout={500} transitionLeaveTimeout={300} component="div">
              {
                [...Array(2)].map((n,i) => tasksArray.map((cell) => {
                  if (!i && member.memberKey === cell.memberKey && !cell.archive || i && member.memberKey === cell.memberKey && cell.archive && showArchiveFlag)
                    return (<div key={cell.taskKey} className={cell.archive ? "boardAreaTask archive" : "boardAreaTask"} onClick={() => this.showTask(cell.taskKey, cell.memberKey)} style={{
                        borderLeftColor: cell.taskColor
                      }}>
                      <div className="boardAreaTaskTitle">{cell.title}</div>
                      {cell.remarks && <div className="boardAreaTaskRemarks">{cell.remarks}</div>}
                      <div className="boardAreaTaskFooter">
                        {cell.startDate + (cell.startDate || cell.endDate ? " ≫ " : "") + cell.endDate}
                      </div>
                    </div>)
                }))
              }
            </CSSTransitionGroup>
          </div>))
        }
        <div className="boardAreaMember">
        {!addMembersFlag ?
          <h2 className="boardAreaMemberName newMember" onClick={(e)=>this.showAddMembersArea(e)}>＋</h2> :
          <h2 className="boardAreaMemberName newMember add" onClick={(e)=>e.stopPropagation()}>
            <input type='text' ref="boardAddMembers"/><button onClick={()=>this.addMembers()}>追加</button>
          </h2>
        }
        </div>
      </div>
    </div>)
  }
}

let propsState = (state) => {
  return {
    tasks: state.tasks,
    members: state.members,
    keys: state.keys,
    flags: state.flags
  }
}

export default connect(propsState)(Board)
