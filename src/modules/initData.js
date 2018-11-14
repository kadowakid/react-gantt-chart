import generateKey from './generateKey'

function sampleData(){
  const today = new Date();
  let sampleMember = {};
  [...Array(3)].forEach((none,i)=>{
    const num = i + 1;
    const memberKey = generateKey();
    sampleMember[memberKey] = {
      name: 'sampleMember' + num,
      num: i,
      memberKey: memberKey
    }
  });
  
  const taskColors = [
    'rgb(184, 0, 0)',
    'rgb(219, 62, 0)',
    'rgb(252, 203, 0)',
    'rgb(0, 139, 2)',
    'rgb(0, 107, 118)',
    'rgb(18, 115, 222)',
    'rgb(0, 77, 207)',
    'rgb(83, 0, 235)',
    'rgb(235, 150, 148)',
    'rgb(250, 208, 195)',
    'rgb(254, 243, 189)',
    'rgb(193, 225, 197)',
    'rgb(190, 218, 220)',
    'rgb(196, 222, 246)',
    'rgb(190, 211, 243)',
    'rgb(212, 196, 251)'
  ];

  const sampleTasks = {};
  [...Array(16)].forEach((none,i)=>{
    const num = i + 1;
    const memberNum = i % 3;
    const start = -Math.floor(Math.random() * 20);
    const end = Math.floor(Math.random() * 20);  
    const startDate = new Date(today.getTime() + start*24*60*60*1000);
    const endDate = new Date(today.getTime() + end*24*60*60*1000);
    const startDateTxt = startDate.getFullYear() + '-' + (startDate.getMonth()+1) + '-' + startDate.getDate();
    const endDateTxt = endDate.getFullYear() + '-' + (endDate.getMonth()+1) + '-' + endDate.getDate();
    const taskKey = generateKey()
    let memberKey;
    Object.keys(sampleMember).forEach(key=>{
      if(sampleMember[key].num === memberNum) memberKey = key
    })
    sampleTasks[taskKey] = {
      archive : i < 12 ? false : true, 
      title : 'sampleTask' + num,
      remarks: 'sampleRemarks'  + num,
      desc: 'sampleTask'+num+'\nsampleTask'+num+'\nsampleTask'+num+'\nsampleTask'+num,
      taskKey: taskKey,
      memberKey: memberKey,
      startDate: startDateTxt,
      endDate: endDateTxt,
      taskColor: taskColors[Math.floor(Math.random() * 16)]
    }
  });
  return {
    tasks: sampleTasks,
    members: sampleMember,
  }
};

export default function initData(){
  const storage = localStorage.getItem("ReactGanttChart");
  const initData = storage ? JSON.parse(storage) : sampleData();
  return initData;
};