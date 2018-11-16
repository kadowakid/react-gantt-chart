function replaceText(text){
    if(text) return text.replace(/-/g,"/");
}

export function sortTasks(data, prop = 'startDate'){
    return data.sort(function(a,b){
        const a_time = new Date(replaceText(a[prop])).getTime();
        const b_time = new Date(replaceText(b[prop])).getTime();
        if(a[prop] && !b[prop] || a_time < b_time) return -1;
        if(!a[prop] && b[prop] || a_time > b_time) return 1;
        return 0
    })
}

export function sortCategories(data){
    return data.sort(function(a,b){
        if(a.num<b.num) return -1;
        if(a.num>b.num) return 1;
        return 0
    });
}