import React, {Component} from 'react'
import {connect} from 'react-redux'
import {sortMembers} from '../modules/sortData'
import generateKey from '../modules/generateKey'
import {
  updateMembers,
  removeMembers,
  removeTasks,
  updateFlags
} from '../action'

class EditMember extends Component {
  constructor(props) {
    super(props);
    this.state = {
      memberKey: false,
      addMembersFlag: false
    }
  }

  editMember(key) {
    this.setState({
      memberKey: key,
      addMembersFlag: false
    });
  }

  cancelEditMember() {
    this.setState({memberKey: false})
  }

  swapMembers(num,nextNum){
    let swapMember1,swapMember2;
    const members = this.props.members;
    Object.keys(members).forEach(key=>{
      if(members[key].num === num) swapMember1 = members[key];
      if(members[key].num === nextNum) swapMember2 = members[key];
    })
    swapMember1.num = nextNum;
    swapMember2.num = num;
    this.props.dispatch(updateMembers(swapMember1,swapMember1.memberKey));
    this.props.dispatch(updateMembers(swapMember2,swapMember2.memberKey));
  }

  addMembers() {
    const name = this.refs.addMembers.value;
    if(!name){return false}
    const num = Object.keys(this.props.members).length;
    const memberKey = generateKey();
    const newMember = {
      name: name,
      num: num,
      memberKey: memberKey
    }
    this.props.dispatch(updateMembers(newMember,memberKey));
    this.refs.addMembers.value = '';
    this.setState({addMembersFlag: false})
  }

  showAddMembersArea() {
    this.setState({
      addMembersFlag: true,
      memberKey: false
    })
  }

  updateMembers(){
    const memberKey = this.state.memberKey;
    const newName = this.refs[memberKey].value;
    if(!newName){return false}
    let updateMember = this.props.members[memberKey];
    updateMember.name = newName;
    this.props.dispatch(updateMembers(updateMember,updateMember.memberKey));
    this.setState({memberKey: false})
  }

  removeMembers() {
    if(window.confirm('このメンバーを削除しますか？（メンバーのタスクも削除されます）')){
      const memberKey = this.state.memberKey;
      const tasks  = this.props.tasks;
      const members = this.props.members;
      const num = members[memberKey].num;
      this.props.dispatch(removeMembers(memberKey))
      Object.keys(tasks).forEach(key=> {
        if(memberKey === tasks[key].memberKey) this.props.dispatch(removeTasks(tasks[key].taskKey))
      });
      Object.keys(members).forEach(key=>{
        if(num < members[key].num){
          members[key].num--;
          this.props.dispatch(updateMembers(members[key],members[key].memberKey))
        }
      })
    }
  }

  editBodyClick(e) {
    e.stopPropagation();
    this.setState({
      memberKey: false,
      addMembersFlag: false
    })
  }

  hideMember(){
    this.props.dispatch(updateFlags({showMemberFlag: false}));
  }

  hideMember(){
    this.props.dispatch(updateFlags({showMemberFlag: false}));
  }

  render() {
    const memberKey = this.state.memberKey;
    const membersArray = this.props.members && sortMembers(Object.keys(this.props.members).map(key => {return this.props.members[key]}))
    return (
    <div className="editBg" onClick={()=>this.hideMember()}>
      <div className="editMemberList" onClick={this.editBodyClick.bind(this)}>
      <button className="editCancel" onClick={()=>this.hideMember()}>×</button>
        <div className="editMemberListArea">
          <h2 className="editMemberListTitle">Member</h2> 
          <ul className="editMemberListName" onClick={(e)=>e.stopPropagation()}>       
            {membersArray && membersArray.map((member,i)=>
              <li className={memberKey === member.memberKey ? "editMode" : ""} key={member.memberKey} onClick={()=> memberKey !== member.memberKey && this.editMember(member.memberKey)}>
                {memberKey === member.memberKey ? 
                  <input type="text" defaultValue={member.name} ref={member.memberKey}/> :
                  member.name}{/*'（' + this.memberTaskNum(member.memberKey) + '）'*/}
                {memberKey === member.memberKey &&
                  <div className="editMemberArrowBox">
                    {i > 0 && <button onClick={()=>this.swapMembers(i,i-1)}>↑</button>}
                    {i < membersArray.length - 1 && <button onClick={()=>this.swapMembers(i,i+1)}>↓</button>}
                  </div>
                }
                {memberKey === member.memberKey &&
                  <div className="editMemberButtonBox">
                    <button onClick={()=>this.cancelEditMember()}>キャンセル</button>
                    <button onClick={()=>this.removeMembers()}>メンバー削除</button>
                    <button onClick={()=>this.updateMembers()}>変更</button>
                  </div>
                }
              </li>
            )}
            {!this.state.addMembersFlag ?
              <li onClick={()=>this.showAddMembersArea()} className="add">+</li> :
              <li className="add open"><input type='text' ref="addMembers"/><button onClick={()=>this.addMembers()}>追加</button></li>
            }
          </ul>
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

export default connect(propsState)(EditMember)
