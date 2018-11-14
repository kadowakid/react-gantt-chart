import React, {Component} from 'react'
import {connect} from 'react-redux'
import {sortMembers} from '../modules/sortData'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import "react-day-picker/lib/style.css"
import GithubPicker from 'react-color/lib/components/github/Github'
import generateKey from '../modules/generateKey'
import {
  updateTasks,
  removeTasks,
  updateFlags,
  updateKeys
} from '../action'

class EditTask extends Component {
  constructor(props) {
    super(props);
    const taskData = this.props.tasks[this.props.keys.taskKey] || {};
    this.state = {
      task : taskData,
      taskEditFlag : false,
      colorPickerFlag: false,
    };
  }

  handleTaskEditFlag() {
    this.setState({
      taskEditFlag : !this.state.taskEditFlag
    })
  }

  changeTaskMember(){
    const memberKey = this.refs.taskMember.value;
    const newTask = {...this.state.task, memberKey: memberKey}
    this.setState({task : newTask});
    const taskKey = this.props.keys.taskKey;
    if (taskKey) {
      this.props.dispatch(updateTasks(newTask, taskKey));
      this.props.dispatch(updateKeys({memberKey: memberKey}));
    }
  }

  //color

  handleColorPickerFlag(e) {
    e.stopPropagation();
    this.setState({
      colorPickerFlag: !this.state.colorPickerFlag
    });
  }

  changeTaskColor(color) {
    const newTask = {...this.state.task,taskColor : color.hex};
    this.setState({
      task : newTask
    })
    if (this.props.keys.taskKey) {
      this.props.dispatch(updateTasks(newTask,newTask.taskKey));
    }
  }

  //date

  changeDate(position) {
    const start = position === 'start';
    const date = start ? this.refs.editStartDate.input.value : this.refs.editEndDate.input.value;
    const dateObj = start ? {startDate: date} : {endDate: date};
    const taskKey = this.props.keys.taskKey;
    if (taskKey) {
      const newTask = {...this.props.tasks[taskKey], ...dateObj};
      this.props.dispatch(updateTasks(newTask,newTask.taskKey))
    }
  }

  //task

  setTaskData() {
    const taskKey = this.props.keys.taskKey;
    const memberKey = this.props.keys.memberKey;
    if (!this.refs.editTitle.value) {
      alert('タイトルを入力してください')
      return false;
    }
    const newTask = {
      title: this.refs.editTitle.value,
      remarks: this.refs.editRemarks.value,
      startDate: this.refs.editStartDate.input.value,
      endDate: this.refs.editEndDate.input.value,
      desc: this.refs.editDetail.value,
      taskKey: taskKey || generateKey(),
      memberKey: memberKey,
      taskColor: this.state.task.taskColor 
    }
    this.props.dispatch(updateTasks(newTask,newTask.taskKey));
    !taskKey ? this.props.dispatch(updateFlags({showTaskFlag: false})) : this.setState({taskEditFlag : false, task: newTask})
  }

  archiveTask() {
    const archiveFlag = this.state.task.archive;
    if(window.confirm('このタスクをアーカイブ' + (archiveFlag ? '解除' : '') + 'しますか？')){
      const newTask = {...this.state.task, archive: !archiveFlag};
      this.props.dispatch(updateTasks(newTask,newTask.taskKey));
      this.props.dispatch(updateFlags({showTaskFlag: false}))
    }
  }

  removeTasks() {
    const taskKey = this.state.task.taskKey;
    if(window.confirm('このタスクを削除しますか？')){
      this.props.dispatch(removeTasks(taskKey));
      this.props.dispatch(updateFlags({showTaskFlag: false}))
    }
  }

  clearTask() {
    this.refs.editTitle.value = "";
    this.refs.editRemarks.value = "";
    this.refs.editDetail.value = "";
  }

  resetTaskDate() {
    const resetDate = {
      startDate: "",
      endDate: ""
    }
    const newTask = {...this.state.task, ...resetDate};
    this.setState({task: newTask});
    const taskKey = this.props.keys.taskKey;
    if (taskKey) {
      this.props.dispatch(updateTasks(newTask,taskKey))
    }
  }

  editText(text) {
    if(!text) return false;
    const regExp = /(https?:\/\/\S+|\n)/g;
    const regExpBr = /(\n)/g;
    const regExpLink = /(https?:\/\/\S+)/g;
    return text.split(regExp).map(function (line,i) {
      return line.match(regExpBr)
        ? (<br key={i}/>) 
        : line.match(regExpLink)
          ? (<a target="_blank" href={line} key={i}>{line}</a>)
          : line;
    });
  }

  editBodyClick(e) {
    e.stopPropagation();
    this.setState({colorPickerFlag: false});
  }

  hideTask(){
    this.props.dispatch(updateFlags({showTaskFlag: false}));
  }

  render() {
    const task = this.state.task;
    const taskKey = this.props.keys.taskKey;
    const memberKey = this.props.keys.memberKey;
    const taskEditFlag = this.state.taskEditFlag;
    const membersArray = this.props.members && sortMembers(Object.keys(this.props.members).map(key => {return this.props.members[key]}))
    return (
        <div className="editBg" onClick={()=>this.hideTask()}>
          <div className="editBody" onClick={this.editBodyClick.bind(this)} style={{borderTopColor: task.taskColor }}>
            <button className="editCancel" onClick={()=>this.hideTask()}>×</button>
            {taskKey && !taskEditFlag && <button className="editChangeButton" onClick={()=>this.handleTaskEditFlag()}>編集</button>}
            <div className="editMenu">
              <div className="editMenuMember">
                <select onChange={()=>this.changeTaskMember()} defaultValue={memberKey} ref="taskMember">
                  {membersArray.map((member) => (<option value={member.memberKey} key={member.memberKey}>{member.name}</option>))}
                </select>
              </div>
              <div>color
                <button onClick={(e)=>this.handleColorPickerFlag(e)} className="editColorButton" style={{background: task.taskColor}}></button>
                  <div className="editColorPicker">
                    {this.state.colorPickerFlag &&
                      <GithubPicker
                        color={task.taskColor}
                        onChange={(color)=>this.changeTaskColor(color)}
                        triangle="hide"
                      />
                    }
                  </div>
                </div>
                {[...Array(2)].map((none,i)=>(
                  <div key={i}>
                    <span className="day">{!i ? 'start' : 'end'}</span>
                    <DayPickerInput onDayChange={()=>this.changeDate(!i ? 'start' : 'end')} value={!i
                      ? task.startDate
                      : task.endDate} ref={'edit' + (!i ? 'Start' : 'End') + 'Date'} placeholder={!i ? '開始日' : '終了日'}
                    />
                  </div>
                ))}
                <div className="sideMenu" onClick={()=>this.resetTaskDate()}>日付リセット</div>
                {taskKey && <div className="sideMenu" onClick={() => this.archiveTask()}>アーカイブ{task.archive ? '解除' : ''}</div>}
                {taskKey && <div className="sideMenu" onClick={() => this.removeTasks(taskKey)}>削除</div>}            
              </div>
              <div className="editContent">
                {task.archive && <div className="editArchiveMessage">このタスクはアーカイブされています</div>}
                {
                  taskEditFlag || !taskKey ?
                    <dl>
                      <dt>タイトル</dt>
                      <dd>
                        <input type="text" ref="editTitle" defaultValue={task.title}/>
                      </dd>
                    </dl> :
                    <div className="editTaskTitle">{task.title}</div>
                }
                {
                  taskEditFlag || !taskKey ?
                    <dl>
                      <dt>備考</dt>
                      <dd>
                        <input type="text" ref="editRemarks" defaultValue={task ? task.remarks : ""}/>
                      </dd>
                    </dl> :
                    task.remarks && <div className="editTaskRemarks">{task.remarks}</div> 
                }
                {
                  taskEditFlag || !taskKey ?
                  <dl>
                    <dt>詳細</dt>
                    <dd><textarea ref="editDetail" defaultValue={task.desc}/></dd>
                  </dl> :
                  <div className="editTaskText">{this.editText(task.desc)}</div>
                }
                {
                  (taskEditFlag || !taskKey) && 
                    <div className="editSubmitButtonBox">
                      <button type="button" onClick={() =>this.clearTask()}>クリア</button>
                      <button type="button" onClick={() => this.setTaskData(taskKey)}>登録</button>
                      {taskEditFlag && <button type="button" onClick={()=>this.handleTaskEditFlag()}>キャンセル</button>}
                    </div>
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
    flags: state.flags,
    keys: state.keys
  }
}

export default connect(propsState)(EditTask)
