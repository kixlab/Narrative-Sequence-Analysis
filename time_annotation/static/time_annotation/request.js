

$(document).ready(function(){
  $("button").on("click", function(){
    return_data();
  })

})

return_data = function(){
  var title = $("#title").val()
  var text = $("#text").val()
  $.ajax({
    url: '/time_annotation/request_novel',
    data:{
      "title": title,
      "text": text,
    },
    dataType: 'json',
    success: function(data){
      alert("data return sucess")
    },
    error: function(data){
      alert("data return fail")
    }
  })
}
