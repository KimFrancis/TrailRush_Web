$(document).ready(function(){
   var $form = $('form');
   $form.submit(function(){
      $.post($(this).attr('action'), $(this).serialize(), function(response){
      },'json');
      alert('station was saved');
      $("input", $(this)).attr("disabled", true);
      return false;
   });
});