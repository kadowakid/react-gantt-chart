import React, {Component} from 'react'
import {connect} from 'react-redux'
import {sortCategories} from '../modules/sortData'
import generateKey from '../modules/generateKey'
import {
  updateCategories,
  removeCategories,
  removeTasks,
  updateFlags
} from '../action'

class EditCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryKey: false,
      addCategoriesFlag: false
    }
  }

  editCategory(key) {
    this.setState({
      categoryKey: key,
      addCategoriesFlag: false
    });
  }

  cancelEditCategory() {
    this.setState({categoryKey: false})
  }

  swapCategories(num,nextNum){
    let swapCategory1,swapCategory2;
    const categories = this.props.categories;
    Object.keys(categories).forEach(key=>{
      if(categories[key].num === num) swapCategory1 = categories[key];
      if(categories[key].num === nextNum) swapCategory2 = categories[key];
    })
    swapCategory1.num = nextNum;
    swapCategory2.num = num;
    this.props.dispatch(updateCategories(swapCategory1,swapCategory1.categoryKey));
    this.props.dispatch(updateCategories(swapCategory2,swapCategory2.categoryKey));
  }

  addCategories() {
    const name = this.refs.addCategories.value;
    if(!name){return false}
    const num = Object.keys(this.props.categories).length;
    const categoryKey = generateKey();
    const newCategory = {
      name: name,
      num: num,
      categoryKey: categoryKey
    }
    this.props.dispatch(updateCategories(newCategory,categoryKey));
    this.refs.addCategories.value = '';
    this.setState({addCategoriesFlag: false})
  }

  showAddCategoriesArea() {
    this.setState({
      addCategoriesFlag: true,
      categoryKey: false
    })
  }

  updateCategories(){
    const categoryKey = this.state.categoryKey;
    const newName = this.refs[categoryKey].value;
    if(!newName){return false}
    let updateCategory = this.props.categories[categoryKey];
    updateCategory.name = newName;
    this.props.dispatch(updateCategories(updateCategory,updateCategory.categoryKey));
    this.setState({categoryKey: false})
  }

  removeCategories() {
    if(window.confirm('このカテゴリを削除しますか？（カテゴリのタスクも削除されます）')){
      const categoryKey = this.state.categoryKey;
      const tasks  = this.props.tasks;
      const categories = this.props.categories;
      const num = categories[categoryKey].num;
      this.props.dispatch(removeCategories(categoryKey))
      Object.keys(tasks).forEach(key=> {
        if(categoryKey === tasks[key].categoryKey) this.props.dispatch(removeTasks(tasks[key].taskKey))
      });
      Object.keys(categories).forEach(key=>{
        if(num < categories[key].num){
          categories[key].num--;
          this.props.dispatch(updateCategories(categories[key],categories[key].categoryKey))
        }
      })
    }
  }

  editBodyClick(e) {
    e.stopPropagation();
    this.setState({
      categoryKey: false,
      addCategoriesFlag: false
    })
  }

  hideCategory(){
    this.props.dispatch(updateFlags({showCategoryFlag: false}));
  }

  hideCategory(){
    this.props.dispatch(updateFlags({showCategoryFlag: false}));
  }

  render() {
    const categoryKey = this.state.categoryKey;
    const categoriesArray = this.props.categories && sortCategories(Object.keys(this.props.categories).map(key => {return this.props.categories[key]}))
    return (
    <div className="editBg" onClick={()=>this.hideCategory()}>
      <div className="editCategoryList" onClick={this.editBodyClick.bind(this)}>
      <button className="editCancel" onClick={()=>this.hideCategory()}>×</button>
        <div className="editCategoryListArea">
          <h2 className="editCategoryListTitle">Category</h2> 
          <ul className="editCategoryListName" onClick={(e)=>e.stopPropagation()}>       
            {categoriesArray && categoriesArray.map((category,i)=>
              <li className={categoryKey === category.categoryKey ? "editMode" : ""} key={category.categoryKey} onClick={()=> categoryKey !== category.categoryKey && this.editCategory(category.categoryKey)}>
                {categoryKey === category.categoryKey ? 
                  <input type="text" defaultValue={category.name} ref={category.categoryKey}/> :
                  category.name}
                {categoryKey === category.categoryKey &&
                  <div className="editCategoryArrowBox">
                    {i > 0 && <button onClick={()=>this.swapCategories(i,i-1)}>↑</button>}
                    {i < categoriesArray.length - 1 && <button onClick={()=>this.swapCategories(i,i+1)}>↓</button>}
                  </div>
                }
                {categoryKey === category.categoryKey &&
                  <div className="editCategoryButtonBox">
                    <button onClick={()=>this.cancelEditCategory()}>キャンセル</button>
                    <button onClick={()=>this.removeCategories()}>カテゴリ削除</button>
                    <button onClick={()=>this.updateCategories()}>変更</button>
                  </div>
                }
              </li>
            )}
            {!this.state.addCategoriesFlag ?
              <li onClick={()=>this.showAddCategoriesArea()} className="add">+</li> :
              <li className="add open"><input type='text' ref="addCategories"/><button onClick={()=>this.addCategories()}>追加</button></li>
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
    categories: state.categories,
    keys: state.keys,
    flags: state.flags
  }
}

export default connect(propsState)(EditCategory)
