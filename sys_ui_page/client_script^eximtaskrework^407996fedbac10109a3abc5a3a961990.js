function validateComments() {
  //Gets called if the 'OK' dialog button is clicked
  //Make sure dialog comments are not empty
  var comments = gel("dial_comments").value;
  comments = trim(comments);
  if (comments == "") {
     //If comments are empty stop submission
     alert("Please provide comments to submit the dialog.");
     return false;
  }
  //If comments are not empty do this...
  GlideDialogWindow.get().destroy(); //Close the dialog window
  g_form.setValue("comments", comments); //Set the 'Comments' field with comments in the dialog
}