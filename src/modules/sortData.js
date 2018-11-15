function replaceText(text){
    if(text) return text.replace(/-/g,"/");
}

export function sortTasks(data){
    return data.sort(function(a,b){
        if(a.startDay && !b.startDay || new Date(replaceText(a.startDay)).getTime() < new Date(replaceText(b.startDay)).getTime()) return -1;
        if(!a.startDay && b.startDay || new Date(replaceText(a.startDay)).getTime() > new Date(replaceText(b.startDay)).getTime()) return 1;
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