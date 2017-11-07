var novel_text;
var total_sentence_length;
var cur_sentence_num=0;
var important_blocks;
var subject_block;
var sel_st;
var sel_end;
var tuto_seq = 1;
var prev_mouse_pos;
var comp_id, imp_id;

var text_title = "Old Boy"

var worker_id = Math.random().toString(36).substring(7);;

$(document).ready(function(){
  scroll_position_set();
  load_text();

  window.onresize = function(event){
    //window_resize();
  }
  $("#submit").on("click", function(){
    console.log($('input[name=sequence]:checked').val())
    if($('input[name=sequence]:checked').val() != null){
      if(confirm("Submit your work?")){
        console.log($('input[name=sequence]:checked').attr("val"));
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
    url: '/time_annotation/retrieve_event_in_same_group_brute',
    data:{
      "text_name": text_title,
      //"text_id" : 27,
    },
    dataType: 'json',
    success: function(data){
      $("#title").text(data.novel_name);
      text_a = JSON.parse(data.text_a);
      text_b = JSON.parse(data.text_b);
      comp_id = data.comp_id;
      console.log(comp_id);
      var summary = data.summary
      if(summary.length>5){
        $("#summary_title").text(data.novel_name +" - Summary");
        $("#summary_content").text(summary);
        $("#total_container").css("height", "90%");
        $("#top_pane").css("height", "50%");
        $("#bottom_pane").css("height", "50%");
        $("#subject_title").text("Following two are snippets of a story. Referring to the summary above, guess which snippet would have happened earlier.")
      }else{
        $("#top_pane").remove()
      }
      $("#subject_text_1").text(text_a['summary'])
      $("#subject_radio_1").attr("val", text_a['id'].toString())
      $("#subject_text_2").text(text_b['summary'])
      $("#subject_radio_2").attr("val", text_b['id'].toString())
      $("#summary_button_1").on("click", function(){
        $("#subject_text_1").text(text_a['summary'])
        $(this).css("border-color", "black")
        $("#full_text_button_1").css("border-color", "white")
      })
      $("#summary_button_2").on("click", function(){
        $("#subject_text_2").text(text_b['summary'])
        $(this).css("border-color", "black")
        $("#full_text_button_2").css("border-color", "white")
      })
      $("#full_text_button_1").css("border-color","white").on("click", function(){
        $("#subject_text_1").text(text_a['full_text'])
        $(this).css("border-color", "black")
        $("#summary_button_1").css("border-color", "white")

      })
      $("#full_text_button_2").css("border-color","white").on("click", function(){
        $("#subject_text_2").text(text_b['full_text'])
        $(this).css("border-color", "black")
        $("#summary_button_2").css("border-color", "white")
      })

      //window_resize();

    },
    error: function(data){

    }
  })

}

window_resize = function(){
  console.log($("#title").height())
  var text_h=$("#novel_box").height()-$("#title").height();
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
  var return_ft;
  var work_description

  if ($('input[name=sequence]:checked').attr("id")=="subject_radio_1"){
    return_ft=text_a['id']
    work_description ="In Brute Condition, "+worker_id+" voted for "+text_a['id'].toString()+" instead of "+text_b['id'].toString()
  }else if($('input[name=sequence]:checked').attr("id")=="subject_radio_2"){
    return_ft=text_b['id']
    work_description ="In Brute Condition, "+worker_id+" voted for "+text_b['id'].toString()+" instead of "+text_a['id'].toString()
  }else{
    return_ft = -1
    work_description ="In Brute Condition, "+worker_id+", among "+text_a['id'].toString()+" and "+text_b['id'].toString()+", was not sure which comes first "
  }

  $.ajax({
    url: '/time_annotation/brute_comparison_return_data',
    data:{
      "text_name": text_title,
      "comp_id": comp_id,
      "first_block": return_ft,
      'worker_id' : worker_id,
      "work_description" : work_description,
      //"text_id" : 27,
    },
    dataType: 'json',
    success: function(data){


    },
    error: function(data){

    }
  })
}
