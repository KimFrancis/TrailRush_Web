$(document).ready(function(){
	$("form :input").attr("disabled","disabled");
	$('#Edit').click(function(event){
		$("form :input").prop("disabled",false);
   });
	var $form = $('form');
   $form.submit(function(){
      $.post($(this).attr('action'), $(this).serialize(), function(response){
      },'json');
      alert('Profile Save!');
      $("input", $(this)).attr("disabled", true);
      return false;
   });
});