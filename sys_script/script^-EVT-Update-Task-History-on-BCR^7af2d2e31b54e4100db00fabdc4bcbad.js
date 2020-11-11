(function executeRule(current, previous /*null when async*/ ) {
    // initialize array for later use
    var taskArray = [];

    // get the BCR that will be updated   
    var bcrRec = new GlideRecord('u_evt_bcr');
    bcrRec.get(current.u_baseline_change_request.sys_id);

    //gs.info('>> number is ' + bcrRec.u_number); //ok

    var relatedBCR = current.getValue('u_baseline_change_request');
    //gs.info('>> relatedBCR from current task  is ' + relatedBCR); //ok

    // select the one or more EVT Tasks so that the BCR 'Task History' field can be updated
    var taskRec = new GlideRecord('u_evt_task');
    taskRec.addQuery('u_baseline_change_request.sys_id', relatedBCR);
	taskRec.addQuery('sys_id', '!=', current.sys_id);
    gs.info('>> taskRec.u_baseline_change_request sysid is ' + relatedBCR);
    taskRec.query();

    taskArray.push(current.sys_id.toString());
    while (taskRec.next()) {
        gs.info('>> task sys_id display value is ' + taskRec.getDisplayValue());
        taskArray.push(taskRec.sys_id.toString());
    }
    var taskList = taskArray.join(',');
    gs.info('task list is ' + taskList);

    bcrRec.setValue('u_evt_task_history', taskList);
    //bcrRec.update();


})(current, previous);