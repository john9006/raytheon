(function executeRule(current, previous /*null when async*/) {
  var transferDate = current.u_date_of_transfer.dateNumericValue();

  var reqID = current.u_transfer_request.sys_id;

  // get the dates from the Transfer Request
  var gr = new GlideRecord("u_exim_transfer_request");
  ``;
  gr.addQuery("sys_id", reqID);
  gr.query();

  if (gr.next()) {
    var requiredDate = gr.u_required_from_date.dateNumericValue();
    var expiryDate = gr.u_approval_expiry.dateNumericValue();

    if (transferDate < requiredDate || transferDate > expiryDate) {
      gs.eventQueue("exim_transfer.date.unexpected", current);
      //gs.info('JK>>> transfer date is  ' + transferDate + ' requiredDate is ' + requiredDate + ' expiryDate is ' + expiryDate);
    }
  }
})(current, previous);
