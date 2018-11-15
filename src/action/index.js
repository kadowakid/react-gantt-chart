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

//categories


export function updateCategories(category,key) {
  const action ={
    type: 'UPDATE_CATEGORIES',
    key: key,
    data: category
  };
  return action;
}

export function removeCategories(key) {
  const action ={
    type: 'REMOVE_CATEGORIES',
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
