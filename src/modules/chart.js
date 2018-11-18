export function chart(prev,next){
  prev = parseInt(prev);
  next = parseInt(next);
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const prevYear = Math.floor((currentMonth - prev) / 12);
  const nextYear = Math.floor((currentMonth + next) / 12);
  let chartData = [];
  for(let y = prevYear ; y <= nextYear; y++){
    let yearDateLength = 0;
    let monthList = []; 
    for(let m = -prev ; m <= next ; m++){
      const newMonthValue = currentMonth + m;
      if(newMonthValue < 12 * y) continue;
      if(newMonthValue >= 12 * (y + 1)) break;
      const newMonth = new Date(currentYear, newMonthValue, 1);
      const monthNum = newMonth.getMonth() + 1;
      const startDay = newMonth.getDay();
      const endDate  = new Date(currentYear, newMonthValue + 1, 0).getDate();
      let dateList = [];
      for(let i = 0; i < endDate; i++){
        dateList.push(i + 1);
      };
      const monthData = {
        monthNum : monthNum,
        dateList : dateList,
        startDay : startDay
      };
      monthList.push(monthData);
      yearDateLength += dateList.length;
    }
    const yearData = {
      yearNum : currentYear + y,
      monthList : monthList,
      yearDateLength : yearDateLength
    }
    chartData.push(yearData);
  }
  return chartData;
}

