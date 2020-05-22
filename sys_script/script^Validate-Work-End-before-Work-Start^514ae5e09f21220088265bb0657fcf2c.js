(function executeRule(current, previous /*null when async*/) {

	if (JSUtil.notNil(current.getValue("work_start")) &&
    JSUtil.notNil(current.getValue("work_end"))) {
    var workStart = new GlideDateTime(current.getValue("work_start"));
    var workEnd = new GlideDateTime(current.getValue("work_end"));
    if (workEnd.compareTo(workStart) < 0) {
        gs.print("Validation failed for actual dates workStart is : " + current.getValue("work_start") + "work_end is: " + current.getValue("work_end"));
        current.setAbortAction(true);
        gs.addErrorMessage(gs.getMessage("Actual end date cannot be earlier than actual start date"));
    }
}

})(current, previous);