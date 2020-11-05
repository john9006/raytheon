function checkRequest() {
    var task = current.sysapproval.sys_class_name || current.source_table;
    return (task == 'sc_request');
}

function checkSCTask() {
    var task = current.sysapproval.sys_class_name || current.source_table;
    return (task == 'sc_task');
}

function checkStdChange() {
    var task = current.sysapproval.sys_class_name || current.source_table;
    return (task == 'std_change_proposal');
}

function checkEximTask() {
    var task = current.sysapproval.sys_class_name || current.source_table;
    return (task == 'u_exim_task');
}

function checkEvtTask() {
    var task = current.sysapproval.sys_class_name || current.source_table;
    return (task == 'u_evt_task');
}
var isRequest = checkRequest();
var isSCTask = checkSCTask();
var isStdChange = checkStdChange();
var isEximTask = checkEximTask();
var isEvtTask = checkEvtTask();

var event; //initialize

if (current.state.changes() && current.state == 'cancelled') {
    event = "approval.cancelled";
    if (isRequest)
        event = "request.approval.cancelled";
    else if (isSCTask)
        event = "sc_task.approval.cancelled";
    else if (isStdChange)
        event = "std_change_proposal.approval.cancelled";
    else if (isEximTask)
        event = "exim_task.approval.cancelled";
    else if (isEvtTask)
        event = "evt_task_approval_cancelled";

    gs.eventQueue(event, current, gs.getUserID(), gs.getUserName());
}

if (current.state.changes() && current.state == 'requested') {
    event = "approval.inserted";
    if (isRequest)
        event = "request.approval.inserted";
    else if (isSCTask)
        event = "sc_task.approval.inserted";
    else if (isStdChange)
        event = "std_change_proposal.approval.inserted";
    else if (isEximTask)
        event = "exim_task.approval.inserted";
    else if (isEvtTask)
        event = "evt_task.approval.inserted";

    gs.eventQueue(event, current, gs.getUserID(), gs.getUserName());
    updateTask(current, current.approver.getDisplayValue() + " requested to approve task");
}

if (current.state.changes() && current.state == 'rejected') {
    event = "approval.rejected";
    if (isRequest)
        event = "request.approval.rejected";
    else if (isSCTask)
        event = "sc_task.approval.rejected";
    else if (isStdChange)
        event = "std_change_proposal.approval.rejected";
    else if (isEximTask)
        event = "exim_task.approval.rejected";
    else if (isEvtTask)
        event = "evt_task.approval.rejected";

    gs.eventQueue(event, current, current.state, previous.state);
    updateTask(current, current.approver.getDisplayValue() + " rejected the task.",
        current.comments.getJournalEntry(-1));
    notifyMyFriends(current);
}

if (current.state.changes() && current.state == 'approved') {
    updateTask(current, current.approver.getDisplayValue() + " approved the task.",
        current.comments.getJournalEntry(-1));
}

function notifyMyFriends(me) {
    var friends = new GlideRecord('sysapproval_approver');
    friends.addQuery('sysapproval', me.sysapproval);
    friends.query();
    while (friends.next()) {
        if (friends.approver.toString() != me.approver.toString()) {
            gs.eventQueue("approval.rejected.by.other", me, friends.approver);
        }
    }
}

function updateTask(me, journal, comments) {
    // if this is for a group approval, don't log this user action since the Group Approval Activity will handle the logging
    if (!current.group.nil())
        return;

    // only log the user approval activity for workflows when specifically turned on
    // otherwise, we spam the approval history log when it is almost never desired to track via the approval history journal field
    var isWorkflow = !current.wf_activity.nil();
    if (isWorkflow && (gs.getProperty("glide.workflow.user_approval_history") != "true"))
        return;

    if (comments)
        journal += "\n\n" + gs.getMessage("Approval comments") + ":\n" + comments;

    var task = new GlideRecord('task');
    if (task.get(me.sysapproval)) {
        if (isWorkflow)
            task.setRunEngines(false);

        task.approval_history.setJournalEntry(journal);
        task.update();
    }
}