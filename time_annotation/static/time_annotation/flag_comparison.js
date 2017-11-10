var novel_text;
var total_sentence_length;
var cur_sentence_num=0;
var important_blocks;
var subject_block_a, subject_block_b;
var total_time_block_num;
var imp_id;
var comp_id;
var sel_st;
var sel_end;
var tuto_seq = 1;
var prev_mouse_pos;
var worker_id = Math.random().toString(36).substring(7);
var text_title ="Old Boy"
var explanations =["<b>Bottom left</b> shows the original sequence of 'some' events from a movie. <b>(beginning of a movie --> end of a movie)</b>",
  "<b>Bottom right</b> is a timeline of 'some' events in the bottom left, listed in time order, in the order events actually happened. <b>(past-->future)</b>",
  "You will read summaries of events in <b>green and yellow box</b>, which are in the bottom left, but not in bottom right(timeline)",
  "You do not know, among two events, which <b>happened first</b> in <b>time order</b>",
  "You know when they happened approximately, according to timeline, but not exactly.",
  "You should read through the sequence and the timeline. After, think and come up with which event might have happened first.",
  "Rather than believing in your gut feeling, it is useful to use some <b>'irreversible clues' or details</b> (ex. death of a character).",
"<b>Spend enough time in deducing</b>, and return your answer when you are <b>sure</b>. If you are not sure with answer, <b>you can choose an option that you are not sure.</b>"]
var tuto_pos = ["#time_line", "#novel_box", "#subject_content", "#subject_content", ".imp_sel_box", "#subject_content", "#subject_content", "#comp_check_-1"]
var cur_tuto =0;
$(document).ready(function(){
  //scroll_position_set();
  load_text();

  window.onresize = function(event){
    //window_resize();
  }
  $("#submit").on("click", function(){
    console.log($('input[name=comp]:checked').val())
    if($('input[name=comp]:checked').val() != null){
      if(confirm("Submit your work?")){
        console.log("return data");
        return_data();
        alert("Thank you for participating!")
        $("body").empty().append("<div>You HIT ID</div><div>"+worker_id+"</div>")
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
      "text_name": text_title,
      //"text_id" : 27,
    },
    dataType: 'json',
    success: function(data){
      total_time_block_num = data.total_time_block_num;
      for(var i=0; i<total_time_block_num; i++){
        $("#summary_pane").append("<div id='seq_"+i.toString()+"' class='important'></div>")
      }
      $("#seq_title").text(data.novel_name+" - Original Sequence in Movie. (top:appear first in the movie / bottom:appear later in the movie)")
      $("#title").text(data.novel_name+" - Timeline. (top:earlier / bottom:later)");
      important_blocks = JSON.parse(data.important_blocks);
      subject_block_a = JSON.parse(data.text_a);
      subject_block_b = JSON.parse(data.text_b);
      imp_id = data.imp_id;
      comp_id = data.comp_id;
      console.log(important_blocks)
      for(var i=0; i<important_blocks.length; i++){
        $("#tb").append("<div id='sel_box_"+i.toString()+"' class='sel_box'></div>")
        $("#tb").append("<div id='important_"+i.toString()+"' class='important' val='"+important_blocks[i]['full_text']+"'></div>")
        $("#seq_"+important_blocks[i]["id"].toString()).attr('val', i.toString()).text(important_blocks[i]['summary']).on('mouseover', function(){
          $(".important").css("background-color", "white")
          $("#important_"+$(this).attr('val')).css("background-color", "#eeeeff")
          $(this).css("background-color", "#eeeeff")

        })
        $("#important_"+i.toString()).text(important_blocks[i]['summary']).on("mouseover", function(){
          //$("#tl").text(important_blocks[parseInt($(this).attr("id").substr(10))]['summary'])
          $(".important").css("background-color", "white")
          $("#seq_"+important_blocks[parseInt($(this).attr("id").substr(10))]['id']).css("background-color", "#eeeeff");
          $(this).css("background-color", "#eeeeff")
        })




      }

      $("#seq_"+subject_block_a['id'].toString()).text(subject_block_a['summary']).css("background-color", "#f9ffee").attr("class", "subject_seq");
      $("#seq_"+subject_block_b['id'].toString()).text(subject_block_b['summary']).css("background-color", "#eefff9").attr("class", "subject_seq");
      $("#tb").append("<div id='sel_box_"+important_blocks.length.toString()+"' class='sel_box'></div>")
      $(".sel_box").height(50);
      $("#sel_box_"+imp_id.toString()).attr("class", "sel_box imp_sel_box").css("background-color", "#eeffee").css("border", "solid 2.5px black").html("<font size=3><b>Events you need to compare happened at this time<b/></font>");

      $("#novel_bottom").append("<div id='sel_box_not_sure' class='sel_box'></div>")

      $("#subject_text_a").text(subject_block_a.summary)
      $("#subject_text_b").text(subject_block_b.summary)
      $("#summary_button_a").on("click", function(){
        $("#subject_text_a").text(subject_block_a.summary)
      })
      $("#full_text_button_a").on("click", function(){
        $("#subject_text_a").text(subject_block_a.full_text)
      })
      $("#summary_button_b").on("click", function(){
        $("#subject_text_b").text(subject_block_b.summary)
      })
      $("#full_text_button_b").on("click", function(){
        $("#subject_text_b").text(subject_block_b.full_text)
      })
      //window_resize();
      tutorial_set();
    },
    error: function(data){

    }
  })

}

window_resize = function(){
  console.log($("#title").height())
  //var sub_h = $("#top_pane").height()-$("#subject_title").outerHeight()
  //var text_h=$("#novel_box").height()-$("#title").height()-$("#novel_bottom").height();
  //var seq_h = $("#time_line").height()-$("#seq_title").height()
  $("#summary_pane").height(function(){
    return seq_h
  })
  $("#novel_text").height(function(){
    return text_h;
  });
  $("#subject_content").height(function(){
    return sub_h;
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
  $('html, body').animate({
scrollTop: $(tuto_pos[cur_tuto]).offset().top
}, 1000);
console.log(tuto_pos[cur_tuto])
  $("#tutorial").css("visibility", "visible").html(explanations[cur_tuto]).dialog({
    position:{ my: "left bottom", at: "left center", of: tuto_pos[cur_tuto]},
    modal: true,
    closeOnEscape: false,
    resizable: false,
    buttons:[
      {
        text: "Next",
        click: function(){
          cur_tuto++;
          if(cur_tuto!=6 && cur_tuto!=7){
          $(tuto_pos[cur_tuto]).effect("highlight", 1000);
        }
          $(this).dialog({
            position:{ my: "left bottom", at: "left top", of: tuto_pos[cur_tuto]}
          }).html(explanations[cur_tuto])
          if(cur_tuto!=2 && cur_tuto!=3 && cur_tuto!=6 && cur_tuto !=5 && cur_tuto !=7){
          $('html, body').animate({
        scrollTop: $(this).offset().top
      }, 1000);
    }else{
        $('html, body').animate({
      scrollTop: 0
    }, 1000);
      }

          if(cur_tuto == 7){
            $(this).dialog({
              buttons:[
                {
                  text:"Let's do the task!",
                  click: function(){
                    $(this).dialog("close")
                    $('html, body').animate({
                  scrollTop: 0
                }, 1000);
                  }
                }
              ]
            })
          }

      }
      }
    ]
  })
  $(tuto_pos[cur_tuto]).effect("highlight", 1000);
  console.log(tuto_pos[cur_tuto])
}

return_data = function(){
  var comp_result = parseInt($('input[name=comp]:checked').val());
  console.log(typeof(comp_result))
  var prev;
  var next;
  if(comp_result == 0){
    prev = subject_block_a;
    next = subject_block_b;
  }else if (comp_result ==1){
    prev = subject_block_b;
    next = subject_block_a;
  }else if (comp_result == -1){
    prev = subject_block_a;
    next = subject_block_b;
  }
  console.log(prev)
  $.ajax({
    url: '/time_annotation/flag_comparison_return_data',
    data:{
      "text_name": text_title,
      "prev_id": prev.id,
      "next_id": next.id,
      "comp_result" : comp_result,
      "comp_id": comp_id,
      "imp_id": imp_id,
      //'work_description' : work_description,
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
