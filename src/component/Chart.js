import React, {Component} from 'react'
import {connect} from 'react-redux'
import {chart} from '../modules/chart'
import {sortTasks, sortCategories} from '../modules/sortData'
import {updateFlags,updateKeys} from '../action'

class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      today: new Date(),
      chartPrev: 1,
      chartNext: 1,
      defaultScrollFlag: true
    }
  }

  componentDidMount() {
    this.setDefaultScroll()
  }

  componentDidUpdate() {
    this.setDefaultScroll()
  }

  setDefaultScroll(){
    if(!this.state.defaultScrollFlag || !Object.keys(this.props.categories).length) return false;
    const cellWidth = 20;
    let chartObject = chart(this.state.chartPrev,0);
    let scrollNum = 0;
    chartObject.map(year=> year.monthList.map(month=> {
      scrollNum += month.dateList.length;
    }))
    const today = new Date().getDate();
    const defMargin = (today - 15) * cellWidth;
    scrollNum = scrollNum - chartObject.pop().monthList.pop().dateList.length;
    this.refs.chartContent.scrollLeft = scrollNum * cellWidth + defMargin;
    this.setState({defaultScrollFlag: false})
  }

  changeChartPrev(){
    const prev = this.refs.chartPrev.value;
    this.setState({chartPrev: prev, defaultScrollFlag: true})
  }
  
  changeChartNext(){
    const next = this.refs.chartNext.value;
    this.setState({chartNext: next, defaultScrollFlag: true});
  }

  showTask(taskKey,categoryKey) {
    this.props.dispatch(updateKeys({
      taskKey : taskKey,
      categoryKey : categoryKey
    }));
    this.props.dispatch(updateFlags({showTaskFlag: true}))
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

  editChartBarSize(startDate, endDate, overflow) {
    const cellWidth = 20;
    let start = new Date(startDate.replace(/-/g,"/")).getTime();
    if(overflow){
      const overflowStart = new Date(...overflow).getTime();
      if(overflowStart - start > 0){
        start = overflowStart
      } else {
        return false;
      }
    }
    const end = new Date(endDate.replace(/-/g,"/")).getTime();
    const dif = end - start;
    if (dif < 0) return false;
    const calc = Math.round(dif / (1000 * 60 * 60 * 24)) + 1;
    return calc * cellWidth + "px"
  }

  editChartDay(year, month, date, monthStart) {
    const today = this.state.today;
    if (today.getFullYear() === year && today.getMonth() + 1 === month && today.getDate() === date) {
      return "today"
    } else if (date % 7 == 8 - monthStart || date % 7 == 1 - monthStart) {
      return "sunday"
    } else if (date % 7 == 7 - monthStart || date % 7 == - monthStart) {
      return "saturday"
    } else {
      return ""
    }
  }

  chartScroll() {
    const scrollY = this.refs.chartContent.scrollTop;
    const scrollX = this.refs.chartContent.scrollLeft;
    this.refs.chartCategory.style.marginTop = -scrollY + 'px';
    this.refs.chartHeader.style.marginLeft = -scrollX + 'px';
  }

  render() {
    const showArchiveFlag = this.props.flags.showArchiveFlag;
    const sortFlag = this.props.flags.sortFlag;
    const categoriesArray = this.props.categories && sortCategories(Object.keys(this.props.categories).map(key => {return this.props.categories[key]}))
    let tasksArray = this.props.tasks && Object.keys(this.props.tasks).map(key => {return this.props.tasks[key]})
    tasksArray = tasksArray && sortFlag ? sortTasks(tasksArray) : tasksArray;
    const chartObject = chart(this.state.chartPrev, this.state.chartNext);
    return (
      <div>
        {tasksArray.length &&
          <div className="chartArea">
            <div className="chartAreaWrapper">
              <div className="chartPeriodArea">
                <select onChange={()=>this.changeChartPrev()} value={this.state.chartPrev} ref="chartPrev">
                  {[...Array(13)].map((none,n) => (<option value={n} key={n}>{n}</option>))}
                </select>
                ヶ月前〜
                <select onChange={()=>this.changeChartNext()} value={this.state.chartNext} ref="chartNext">
                  {[...Array(13)].map((none,n) => (<option value={n} key={n}>{n}</option>))}
                </select>
                ヶ月後
              </div>
              <div className="chartCategoryArea">
                <div ref="chartCategory">
                  {
                    categoriesArray.map((category) => (
                      <div className="chartCategoryWrap" key={category.categoryKey}>
                        <h2 className="chartCategoryName">
                          {category.name}
                          {'（' + this.categoryTaskNum(category.categoryKey) + '）'}
                        </h2>
                        {
                          [...Array(2)].map((none,i) => tasksArray.map((cell) => {
                            if (!i && category.categoryKey === cell.categoryKey && !cell.archive || i && category.categoryKey === cell.categoryKey && cell.archive && showArchiveFlag)
                              return (
                              <div key={cell.taskKey} className={"chartCategoryTask" + (cell.archive ? " archive" : "")} onClick={() => this.showTask(cell.taskKey, cell.categoryKey)} style={{
                                  borderLeftColor: cell.taskColor
                                }}>
                                {cell.title}
                              </div>
                            )
                          }))
                        }
                      </div>)
                    )
                  }
                </div>
              </div>
              <div className="chartCalenderArea">
                <ul className="chartCalenderHeader" ref="chartHeader">
                  {
                    chartObject.map((yearObject) => (
                      <li key={yearObject.yearNum}>
                        <table>
                          <tbody>
                            <tr>
                              <td colSpan={yearObject.yearDateLength}>{yearObject.yearNum + '年'}</td>
                            </tr>
                            <tr>
                              {
                                yearObject.monthList.map((monthObject) => (
                                  <td key={monthObject.monthNum} colSpan={monthObject.dateList.length}>{monthObject.monthNum + '月'}</td>
                                ))
                              }
                            </tr>
                            <tr className="chartCalenderDate">
                              {
                                yearObject.monthList.map((monthObject) => monthObject.dateList.map((date) => {
                                  return (<td className={this.editChartDay(yearObject.yearNum, monthObject.monthNum, date, monthObject.startDay)} key={date}>{date}</td>)
                                }))
                              }
                            </tr>
                          </tbody>
                        </table>
                      </li>)
                    )
                  }
                </ul>
                <ul className="chartContent" onScroll={()=>this.chartScroll()} ref="chartContent">
                  {
                    chartObject.map((yearObject,yearNum) => (
                      <li key={yearObject.yearNum}>
                        <table>
                          {
                            categoriesArray.map((category) => (<tbody key={category.categoryKey}>
                              <tr className="chartContentCell" key={category.categoryKey}>
                                {
                                  yearObject.monthList.map((monthObject) => monthObject.dateList.map((date) => {
                                    return (<td className={this.editChartDay(yearObject.yearNum, monthObject.monthNum, date, monthObject.startDay)} key={date}></td>)
                                  }))
                                }
                              </tr>
                              {
                                [...Array(2)].map((none,i) => tasksArray.map((cell) => {
                                  if (!i && category.categoryKey === cell.categoryKey && !cell.archive || i && category.categoryKey === cell.categoryKey && cell.archive && showArchiveFlag)
                                    return (
                                    <tr className="chartContentCell" key={cell.taskKey}>
                                      {
                                        yearObject.monthList.map((monthObject,monthNum) => monthObject.dateList.map((date,dateNum) => {
                                          const editChartBar = cell.endDate && cell.startDate === yearObject.yearNum + '-' + monthObject.monthNum + '-' + date;
                                          const overflow = cell.startDate && cell.endDate && !yearNum && !monthNum && !dateNum　? [yearObject.yearNum, monthObject.monthNum - 1, date] : false;
                                          const chartBarSize = (editChartBar || overflow) && this.editChartBarSize(cell.startDate, cell.endDate, overflow)
                                          return (
                                            <td className={this.editChartDay(yearObject.yearNum, monthObject.monthNum, date, monthObject.startDay) + (cell.archive ? " archive" : "")} key={date}>{
                                              chartBarSize && 
                                                <div className="chartContentBar" style={{
                                                  background: cell.taskColor,
                                                  width: chartBarSize
                                                }} onClick={() => this.showTask(cell.taskKey, cell.categoryKey)}></div>
                                            }</td>
                                          )
                                        }))
                                      }
                                    </tr>
                                  )
                                }))
                              }
                            </tbody>))
                          }
                        </table>
                      </li>)
                    )
                  }
                </ul>
              </div>
            </div> 
          </div>
        }
      </div>
    )
  }
}

const propsState = (state) => {
  return {
    tasks: state.tasks,
    categories: state.categories,
    flags: state.flags
  }
}

export default connect(propsState)(Chart)
