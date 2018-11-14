//tasks

export function updateTasks(task,key) {
  const action ={
    type: 'UPDATE_TASKS',
    key: key,
    data: task
  } 
  return action;
}

export function removeTasks(key) {
  const action ={
    type: 'REMOVE_TASKS',
    key: key
  }
  return action;
}

//members


export function updateMembers(member,key) {
  const action ={
    type: 'UPDATE_MEMBERS',
    key: key,
    data: member
  };
  return action;
}

export function removeMembers(key) {
  const action ={
    type: 'REMOVE_MEMBERS',
    key: key 
  } 
  return action;
}

//flags

export function updateFlags(flags) {
  const action ={
    type: 'UPDATE_FLAGS',
    data: flags
  } 
  return action;
}

//keys

export function updateKeys(keys) {
  const action ={
    type: 'UPDATE_KEYS',
    data: keys
  } 
  return action;
}
