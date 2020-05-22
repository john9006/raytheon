function onCancel() {
  var c = gel('cancelled');
  c.value = "true";
  GlideDialogWindow.get().destroy();
  return false;
}

function onSubmit() {
	var e;

	var comments = gel('supporting_comments').value;

	if (comments == ' ') {
		alert(getMessage("Please provide supporting comments for requiring rework."));

		e = gel("supporting_comments");
		if (e)
			e.focus();

	} else if (comments != ' ') {
		g_form.setValue("u_rework_reject", true);
		g_form.setValue("u_rework_comment", comments);
		g_form.setValue("state", 4); //Closed Incomplete
		g_form.setValue('approval', 'rejected');
		g_form.save();
		GlideDialogWindow.get().destroy();
	}
}

