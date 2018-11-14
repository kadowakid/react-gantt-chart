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
    let yearLength = 0;
    let monthList = []; 
    for(let m = -prev ; m <= next ; m++){
      const monthValue = currentMonth + m;
      if(monthValue < 12 * y) continue;
      if(monthValue === 12 * (y + 1)) break;
      const monthNum = new Date(currentYear, monthValue, 1).getMonth() + 1;
      const startDay = new Date(currentYear, monthValue, 1).getDay();
      const endDate  = new Date(currentYear, monthValue + 1, 0).getDate();
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
      yearLength += dateList.length;
    }
    const yearData = {
      yearNum : currentYear + y,
      monthList : monthList,
      yearLength : yearLength
    }
    chartData.push(yearData);
  }
  return chartData;
}

