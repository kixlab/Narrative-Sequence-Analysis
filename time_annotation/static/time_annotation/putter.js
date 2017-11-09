var novel_text;
var total_sentence_length;
var cur_sentence_num=0;
var important_blocks;
var subject_block;
var total_time_block_num;
var sel_st;
var sel_end;
var tuto_seq = 1;
var prev_mouse_pos;
var worker_id = Math.random().toString(36).substring(7);
var text_title ="Old Boy"
var explanations =["<b>Bottom left</b> shows the original sequence of 'some' events from a movie. <b>(beginning of a movie --> end of a movie)</b>",
  "<b>Bottom right</b> is a timeline of 'those' events in the movie, listed in time order, in the order events actually happened. <b>(past-->future)</b>",
  "See the summary of an event in <b>green box</b> which is also in bottom left, but not in bottom right....",
  "and <b>put it</b> in <b>the proper time of the timeline</b>, one of positions in <b>the bottom right.</b>",
  "Rather than believing in your gut feeling, it is useful to use some <b>'irreversible clues' or details</b> (ex. death of a character).",
"<b>Spend enough time in deducing</b>, and return your answer when you are <b>sure</b>. If you are not sure with answer, <b>you can choose an option that you are not sure.</b>"]
var tuto_pos = ["#time_line", "#novel_box", "#subject_text", "#novel_box", "#novel_box", "#sel_box_not_sure"]
var cur_tuto =0;
$(document).ready(function(){
  //scroll_position_set();
  load_text();

  window.onresize = function(event){
    //window_resize();
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
      total_time_block_num = data.total_time_block_num;
      for(var i=0; i<total_time_block_num; i++){
        $("#summary_pane").append("<div id='seq_"+i.toString()+"' class='important'></div>")
      }
      $("#seq_title").text(data.novel_name+" - Original Sequence in Movie. (top:appear first in the movie / bottom:appear later in the movie)")
      $("#title").text(data.novel_name+" - Timeline. (top:earlier / bottom:later)");
      important_blocks = JSON.parse(data.important_blocks);
      subject_block = JSON.parse(data.subject_block);
      console.log(important_blocks)
      for(var i=0; i<important_blocks.length; i++){
        $("#tb").append("<div id='sel_box_"+i.toString()+"' class='sel_box'></div>")
        $("#sel_box_"+i.toString()).append("<input type='radio' value="+i.toString()+" name='group' id='group_check_"+i.toString()+"' class='group_check'> It belongs here! </input>")
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
      $("#seq_"+subject_block['id'].toString()).text(subject_block['summary']).css("background-color", "#eeffee").attr("class", "subject_seq");
      $("#tb").append("<div id='sel_box_"+important_blocks.length.toString()+"' class='sel_box'></div>")
      $("#sel_box_"+important_blocks.length.toString()).append("<input type='radio' value="+important_blocks.length.toString()+" name='group' id='group_check_"+important_blocks.length.toString()+"' class='group_check'> It belongs here! </input>")
      $("#novel_bottom").append("<div id='sel_box_not_sure' class='sel_box'></div>")
      $("#sel_box_not_sure").append("<input type='radio' value='-1' name='group' id='group_check_not_sure' class='group_check'> I am not sure with the snippet's position... </input>")
      $("#subject_text").text(subject_block.summary)
      $("#summary_button").on("click", function(){
        $("#subject_text").text(subject_block.summary)
      })
      $("#full_text_button").on("click", function(){
        $("#subject_text").text(subject_block.full_text)
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
  $("#tutorial").css("visibility", "visible").html(explanations[cur_tuto]).dialog({
    position:{ my: "left bottom", at: "left top", of: tuto_pos[cur_tuto]},
    modal: true,
    closeOnEscape: false,
    buttons:[
      {
        text: "Next",
        click: function(){
          cur_tuto++;
          if(cur_tuto !=6){
          $(this).dialog({
            position:{ my: "left bottom", at: "left top", of: tuto_pos[cur_tuto]}
          }).html(explanations[cur_tuto])
          if(cur_tuto !=4){
            $(tuto_pos[cur_tuto]).effect("highlight", 1000);
          }
          if(cur_tuto !=2){
          $('html, body').animate({
        scrollTop: $(this).offset().top
      }, 1000);}else{
        $('html, body').animate({
      scrollTop: 0
    }, 1000);
      }
          if(cur_tuto == 5){
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
      }
    ]
  })
  $(tuto_pos[cur_tuto]).effect("highlight", 1000);
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
