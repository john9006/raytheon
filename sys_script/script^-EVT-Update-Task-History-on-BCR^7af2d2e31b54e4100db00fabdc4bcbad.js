(function executeRule(current, previous /*null when async*/ ) {
    // initialize array for later use
    var taskArray = [];

    // get the BCR that will be updated   
    var bcrRec = new GlideRecord('u_evt_bcr');
    bcrRec.get(current.u_baseline_change_request.sys_id);
    

    var relatedBCR = current.getValue('u_baseline_change_request');    

    // select any other EVT Tasks apart from current so that 
    // the BCR 'Task History' field can be updated - this is belts and 
    // braces - should be ok to add the current record to the list
    var taskRec = new GlideRecord('u_evt_task');
    taskRec.addQuery('u_baseline_change_request.sys_id', relatedBCR);
	taskRec.addQuery('sys_id', '!=', current.sys_id);
    
    taskRec.query();

    taskArray.push(current.sys_id.toString());
    while (taskRec.next()) {        
        taskArray.push(taskRec.sys_id.toString());
    }
    var taskList = taskArray.join(',');
    

    bcrRec.setValue('u_evt_task_history', taskList);
    bcrRec.update();


})(current, previous);
   