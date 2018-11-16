import React, {Component} from 'react'
import {connect} from 'react-redux'
import {sortTasks, sortCategories} from '../modules/sortData'
import {updateCategories,updateFlags,updateKeys} from '../action'
import generateKey from '../modules/generateKey'
import {CSSTransitionGroup} from 'react-transition-group';

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addCategoriesFlag: false
    }
  }
  showTask(taskKey,categoryKey) {
    this.props.dispatch(updateKeys({
      taskKey : taskKey,
      categoryKey : categoryKey
    }));
    this.props.dispatch(updateFlags({showTaskFlag: true}))
  }
  showAddCategoriesArea(e){
    e.stopPropagation();
    this.setState({
      addCategoriesFlag: true
    })
  }
  categoryTaskNum(categoryKey){
    let num = 0;
    const archiveFlag = this.props.flags.showArchiveFlag;
    const tasks = this.props.tasks;
    Object.keys(tasks).forEach((key) => {
      if(categoryKey === tasks[key].categoryKey && (archiveFlag ? true : !tasks[key].archive)) num++;
    });
    return num;
  }
  addCategories() {
    const name = this.refs.boardAddCategories.value;
    if(!name){return false}
    const num = Object.keys(this.props.categories).length;
    const categoryKey = generateKey();
    const newCategory = {
      name: name,
      num: num,
      categoryKey: categoryKey
    }
    this.props.dispatch(updateCategories(newCategory,categoryKey));
    this.refs.boardAddCategories.value = '';
    this.setState({addCategoriesFlag: false})
  }
  render() {
    const showArchiveFlag = this.props.flags.showArchiveFlag;
    const sortFlag = this.props.flags.sortFlag;
    const addCategoriesFlag = this.state.addCategoriesFlag;
    const categoriesArray = this.props.categories && sortCategories(Object.keys(this.props.categories).map(key => {return this.props.categories[key]}))
    let tasksArray = this.props.tasks && Object.keys(this.props.tasks).map(key => {return this.props.tasks[key]});
    tasksArray = tasksArray && sortFlag ? sortTasks(tasksArray) : tasksArray;
    return (
    <div>
      <div className="boardArea" onClick={()=>this.setState({addCategoriesFlag: false})}>
        {
          categoriesArray.map((category) => (
          <div key={category.categoryKey} className="boardAreaCategory">
            <h2 className="boardAreaCategoryName">
              {category.name + '（' + this.categoryTaskNum(category.categoryKey) + '）'}
              <button onClick={() => this.showTask(false,category.categoryKey)}>＋</button>
            </h2>
            <CSSTransitionGroup transitionName="fade" transitionAppear={true} transitionAppearTimeout={500} transitionEnterTimeout={500} transitionLeaveTimeout={300} component="div">
              {
                [...Array(2)].map((n,i) => tasksArray.map((cell) => {
                  if (!i && category.categoryKey === cell.categoryKey && !cell.archive || i && category.categoryKey === cell.categoryKey && cell.archive && showArchiveFlag)
                    return (<div key={cell.taskKey} className={cell.archive ? "boardAreaTask archive" : "boardAreaTask"} onClick={() => this.showTask(cell.taskKey, cell.categoryKey)} style={{
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
        <div className="boardAreaCategory">
        {!addCategoriesFlag ?
          <h2 className="boardAreaCategoryName newCategory" onClick={(e)=>this.showAddCategoriesArea(e)}>＋</h2> :
          <h2 className="boardAreaCategoryName newCategory add" onClick={(e)=>e.stopPropagation()}>
            <input type='text' ref="boardAddCategories"/><button onClick={()=>this.addCategories()}>追加</button>
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
    categories: state.categories,
    keys: state.keys,
    flags: state.flags
  }
}

export default connect(propsState)(Board)
