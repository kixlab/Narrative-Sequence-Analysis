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

$(document).ready(function(){
//  scroll_position_set();
  load_text();

  window.onresize = function(event){
    window_resize();
  }
  $("#submit").on("click", function(){
    console.log($('input[name=sequence]:checked').val())
    if($('input[name=sequence]:checked').val() != null){
      if(confirm("Submit your work?")){
        console.log($('input[name=sequence]:checked').attr("val"));
        return_data();
        alert("Thank you for participating!")
        $("body").remove()
      }
    }else{
      alert("Cannot submit because you did not specify answer")

    }
  })
  });


load_text = function(){
  $.ajax({
    url: '/time_annotation/retrieve_important_event_in_same_group',
    data:{
      "text_name": "Old Boy",
      //"text_id" : 27,
    },
    dataType: 'json',
    success: function(data){
      $("#title").text(data.novel_name+" - Timeline");
      important_blocks = JSON.parse(data.important_blocks);
      text_a = JSON.parse(data.text_a);
      text_b = JSON.parse(data.text_b);
      imp_id= data.imp_id;
      comp_id = data.comp_id;
      console.log(important_blocks)
      for(var i=0; i<important_blocks.length; i++){
        $("#tb").append("<div id='sel_box_"+i.toString()+"' class='sel_box'></div>")
        if(i==imp_id){
          $("#sel_box_"+i.toString()).text("Snippets below are positioned here.").css('border', 'solid 1.5px black')
          $("#bottom_pane").on("mouseover", function(){
            $("#sel_box_"+imp_id.toString()).css("background-color", "#eeffee")
          }).on("mouseout", function(){
            $("#sel_box_"+imp_id.toString()).css("background-color", "#eeeeee")
          })
        }
        $("#tb").append("<div id='important_"+i.toString()+"' class='important' val='"+important_blocks[i]['full_text']+"'>"+important_blocks[i]['summary']+"</div>")
        $("#important_"+i.toString()).on("mouseover", function(){
          $("#tl").text(important_blocks[parseInt($(this).attr("id").substr(10))]['summary'])
          $(".important").css("background-color", "white")
          $(this).css("background-color", "#eeeeff")
        })


      }

      $("#tb").append("<div id='sel_box_"+important_blocks.length.toString()+"' class='sel_box'></div>")
      $("#subject_text_1").text(text_a['summary'])
      $("#subject_radio_1").attr("val", text_a['full_text'])
      $("#subject_text_2").text(text_b['summary'])
      $("#subject_radio_2").attr("val", text_b['full_text'])
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

      window_resize();

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
  $.ajax({
    url: '/time_annotation/flag_comparison_return_data',
    data:{
      "text_name": "Hard feelings",
      "imp_id": imp_id,
      "comp_id": comp_id,
      "first_block": $('input[name=sequence]:checked').attr("val"),
      //"text_id" : 27,
    },
    dataType: 'json',
    success: function(data){


    },
    error: function(data){

    }
  })
}
