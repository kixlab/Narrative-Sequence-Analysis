var novel_text;
var total_sentence_length;
var cur_sentence_num=0;
var important_blocks;
var subject_block;
var sel_st;
var sel_end;
var tuto_seq = 1;
var prev_mouse_pos;
var worker_id = Math.random().toString(36).substring(7);
var text_title ="Old Boy"
$(document).ready(function(){
  scroll_position_set();
  load_text();

  window.onresize = function(event){
    window_resize();
  }
  $("#submit").on("click", function(){
    console.log($('input[name=group]:checked').val())
    if($('input[name=group]:checked').val() != null){
      if(confirm("Submit your work?")){
        console.log("return data");
        return_data();
        alert("Thank you for participating!")
        $("body").empty().append("<div>Your Worker ID</div><div>"+worker_id+"</div>")
      }
    }else{
      alert("Cannot submit because you did not specify answer")

    }
  })
  });


load_text = function(){
  $.ajax({
    url: '/time_annotation/retrieve_important_event',
    data:{
      "text_name": text_title,
      //"text_id" : 27,
    },
    dataType: 'json',
    success: function(data){
      $("#title").text(data.novel_name+" - Timeline");
      important_blocks = JSON.parse(data.important_blocks);
      subject_block = JSON.parse(data.subject_block);
      console.log(important_blocks)
      for(var i=0; i<important_blocks.length; i++){
        $("#tb").append("<div id='sel_box_"+i.toString()+"' class='sel_box'></div>")
        $("#sel_box_"+i.toString()).append("<input type='radio' value="+i.toString()+" name='group' id='group_check_"+i.toString()+"' class='group_check'> It belongs here! </input>")
        $("#tb").append("<div id='important_"+i.toString()+"' class='important' val='"+important_blocks[i]['full_text']+"'></div>")
        $("#important_"+i.toString()).text(important_blocks[i]['summary'])
        $("#important_"+i.toString()).on("mouseover", function(){
          $("#tl").text(important_blocks[parseInt($(this).attr("id").substr(10))]['summary'])
          $(".important").css("background-color", "white")
          $(this).css("background-color", "#eeeeff")
        })


      }
      $("#tb").append("<div id='sel_box_"+important_blocks.length.toString()+"' class='sel_box'></div>")
      $("#sel_box_"+important_blocks.length.toString()).append("<input type='radio' value="+important_blocks.length.toString()+" name='group' id='group_check_"+important_blocks.length.toString()+"' class='group_check'> It belongs here! </input>")
      //$("#novel_bottom").append("<div id='sel_box_not_sure' class='sel_box'></div>")
      //$("#sel_box_not_sure").append("<input type='radio' value='-1' name='group' id='group_check_not_sure' class='group_check'> I am not sure with the snippet's position... </input>")
      $("#subject_text").text(subject_block.summary)
      $("#summary_button").on("click", function(){
        $("#subject_text").text(subject_block.summary)
      })
      $("#full_text_button").on("click", function(){
        $("#subject_text").text(subject_block.full_text)
      })
      window_resize();

    },
    error: function(data){

    }
  })

}

window_resize = function(){
  console.log($("#title").height())
  var text_h=$("#novel_box").height()-$("#title").height()-$("#novel_bottom").height();
  $("#novel_text").height(function(){
    return text_h;
  });
  $("#summary_pane").height(function(){
    return text_h;
  })
}

function scroll_position_set(){
  $("#novel_text").on("scroll",function(){
    $("#summary_pane").scrollTop($(this).scrollTop());
  })
  $("#summary_pane").on("scroll",function(){
    $("#novel_text").scrollTop($(this).scrollTop());
  })
}

random_pastel = function(){
  r = parseInt((Math.random()*255+255)/2)
  g = parseInt((Math.random()*255+255)/2)
  b = parseInt((Math.random()*255+255)/2)

  return "rgb("+r.toString()+", "+g.toString()+", "+b.toString()+")"
}


tutorial_set = function(){
  $("#overlay").css("visibility", "visible")
  $("#tutorial").css("visibility", "visible")
  $("#show_tuto").css("color", "#eeeee")
  $("#tuto_close").on("click", function(){
    $(this).remove()
    $("#overlay").css("visibility", "hidden")
    $("#tutorial").css("visibility", "hidden")
    $("#show_tuto").css("color", "black")
    $("#show_tuto").on("mouseover", function(){
      $("#tutorial").css("visibility", "visible");
    }).on("mouseout", function(){
      $("#tutorial").css("visibility", "hidden");
    })
  })
}

return_data = function(){
  var work_description = "Worker "+ worker_id + " put "+subject_block.id.toString()+" in "+$('input[name=group]:checked').val()
  $.ajax({
    url: '/time_annotation/putter_return_data',
    data:{
      "text_name": text_title,
      "full_text": subject_block.id,
      "important_seq_num": parseInt($('input[name=group]:checked').val()),
      'work_description' : work_description,
      'worker_id' : worker_id,
      //"text_id" : 27,
    },
    dataType: 'json',
    success: function(data){


    },
    error: function(data){

    }
  })
}
