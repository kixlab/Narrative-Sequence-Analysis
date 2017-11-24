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
  "<b>Bottom right</b> is a time order of 'those' events in the movie, which is in the sequence of how events actually happened. <b>(past-->future)</b>",
  "See the summary of an event in <b>green box</b> which is also included in the original sequence(bottom left), but not in the time order(bottom right)....",
  "and <b>put it</b> in <b>the proper moment in the time order</b>, one of positions in <b>the bottom right.</b>",
  "Rather than believing in your gut feeling, it is useful to use some <b>'irreversible clues' or details</b> (ex. death of a character).",
"<b>Spend enough time in deducing</b>, and return your answer when you are <b>sure</b>. If you are not sure with answer, <b>you can choose an option that you are not sure.</b>"]
var tuto_pos = ["#time_line", "#novel_box", "#subject_text", "#novel_box", "#novel_box", "#sel_box_not_sure"]
var cur_tuto =0;
var initiation = false;

$(document).ready(function(){
  //scroll_position_set();
  load_text();

  window.onresize = function(event){
    //window_resize();
  }
  $("#next").on("click", function(){
    Chronological_Sequence();
  })
  $("#submit").on("click", function(){
    console.log($('input[name=group]:checked').val())
    if($('input[name=group]:checked').val() != null){
      if(confirm("Submit your work?")){
        console.log("return data");
        //return_data();
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
      important_blocks = JSON.parse(data.important_blocks);
      subject_block = JSON.parse(data.subject_block);

      for(var i=0; i<explanations.length; i++){
        $("#tt").append("<p>"+explanations[i]+"</p>")
      }
      total_time_block_num = data.total_time_block_num;
      Original_Sequence();
      //window_resize();
    //  tutorial_set();
    },
    error: function(data){

    }
  })

}

Original_Sequence=function(){
  //left pane
  Original_Sequence_sub();
  //

    for(var i=0; i<total_time_block_num; i++){
      $("#summary_pane").append("<div id='seq_"+i.toString()+"' class='chunk trivial'></div>")
    }

  console.log(important_blocks)
  for(var i=0; i<important_blocks.length; i++){
    $("#seq_"+important_blocks[i]["id"].toString()).css("background-color","white").attr("class", "chunk important").attr('val', i.toString()).text(important_blocks[i]['summary'])
  }
  $("#seq_"+subject_block['id'].toString()).text(subject_block['summary']).attr("class", "subject_seq drag_function");
}
Original_Sequence_sub=function(){
  $("#Left_Title").text("Original Story Sequence")

  $(".subject_seq").draggable({
    disabled: true,
  })
}

Chronological_Sequence=function(){
  //left pane
  $("#Left_Title").text("Chronological Story Sequence")
  var input_list = []
  $(".trivial").animate({
    opacity :0,
  }, 1000, function(){
    $(this).css("position", "absolute")
  })
  console.log($('#summary_pane').scrollTop())
  $(".chunk").css("position", "relative")
  console.log($("#seq_"+subject_block['id'].toString()).position().top);
  var paddH = ($('#summary_pane').innerHeight() - $('#summary_pane').height())/2;
  var subject_block_height = -$("#seq_"+subject_block['id'].toString()).position().top+paddH
  input_list.push($("#seq_"+subject_block['id'].toString()));

  for(var i=0; i<important_blocks.length; i++){
    var imph = -$("#seq_"+important_blocks[i]['id'].toString()).position().top+2*paddH+$("#seq_"+subject_block['id'].toString()).outerHeight();
    if(!initiation){
      imph+=44*(i+1)+50;
      for(var j=0; j<i; j++){
        imph += $("#seq_"+important_blocks[j]['id'].toString()).outerHeight()+54
      }
    }else{


      console.log($("#position_0").outerHeight())
      imph+=44*(i+1)+$("#position_0").outerHeight()-4;
      $("#position_0").css("display","none")
      for(var j=0; j<i; j++){
        imph += $("#seq_"+important_blocks[j]['id'].toString()).outerHeight()+$("#position_"+(j+1).toString()).outerHeight();
      }
    }
    var impid = important_blocks[i]['id']
    $("#seq_"+impid.toString()).animate({
      top: imph-$('#summary_pane').scrollTop(),
    }, 990)
    input_list.push($("#seq_"+impid.toString()))
  }
  console.log(input_list)
  var opa = 1;
  if(!$(".subject_seq").attr("class").includes("being_dragged")&&initiation){
    opa = 0.5;
  }
  $("#seq_"+subject_block['id'].toString()).animate({
    top : subject_block_height-$('#summary_pane').scrollTop(),
    opacity : opa,
  }, 1000, function(){
    for(var i=input_list.length-1; i>-1; i--){
      if(!initiation){
      $("#summary_pane").prepend("<div id='position_"+i.toString()+"' class='position drag_function' val="+i.toString()+"></div>");

    }else{
    //  $("#summary_pane").prepend("<div id='position_"+i.toString()+"' class='position drag_function' val="+i.toString()+"></div>");

      $("#summary_pane").prepend($("#position_"+i.toString()))
      $("#position_"+i.toString()).css("display","block")
    }
      if(i!=0){
        input_list[i].prependTo($("#summary_pane")).css("top","0")
      }else{
        $("#summary_pane").prepend("<div id='candidate'></div>")
        $("#candidate").css("margin-bottom", "10px").css("border-bottom", "solid 1px grey");
        input_list[i].prependTo($("#candidate")).css("top","0")
      }

    }

  //  $("#candidate").height($(this).height())
// OPTION draggable
  $(".drag_function").draggable({
    //disabled: false,
    helper: "clone",
    opacity: 1,
    cursorAt :{top :-5, left : -5},
    create: function(){

      if($(this).attr("class").includes("subject_seq")){
        $(this).draggable("option","disabled", false)
        $(this).addClass("being_dragged")
      }else{
        $(this).draggable("option", "disabled", true)
      }
    },
    start: function(event, ui){
      $(".ui-draggable-dragging").attr("id", "drag_helper")
      var t = this;
      var _text = $(this).text()
      //$(this).addClass("being_dragged")
      $(".drag_function").on("mouseenter", function(){
        //$(this).toggle("highlight")
        //$(this).text(_text).css("border-color", "#0e2447").css("background-color", "white")

      }).on("mouseout", function(){
        //$(this).highlight()
        console.log(t)
        console.log(this)
        //if(this != t && !$(this).attr("class").includes("ui-draggable-dragging")){
        //$(this).text("")
      //}
      })
    },
    stop: function(event, ui){
      $(".drag_function").off("mouseenter").off("mouseout")
        var text = $(this).text()


    }
  }).droppable({
    //accept: ".being_dragged",
    disabled: false,
    over: function(event, ui){
      $(this).css("border-color", "white")
    },
    out: function(event, ui){
      if($(this).attr('class').includes("subject_seq")||$(this).attr('class').includes("being_dragged")){
        $(this).css("border-color", "#0e2447");
      }else{
        $(this).css("border-color", "#0071aa")
      }
    },
    drop: function(event, ui){
      var text = ui.draggable.text()
      console.log(ui.draggable.attr("class"))//.includes("suject_seq"))
      if(!ui.draggable.attr("class").includes("subject_seq")){
        ui.draggable.removeClass("being_dragged").draggable("disable")
      }else{
        ui.draggable.removeClass("being_dragged")
        $(".position").draggable("disable")
      }
      //initialize others
      $(".position").css("background-color","#cccccc").css("border-color", "#0071aa").text("").removeClass("being_dragged")
      //
      $(".subject_seq").css("opacity", "0.5")
      $(this).css("opacity", "1").addClass("being_dragged").draggable("option", "disabled", false).css("background-color","white").css("border-color", "#0e2447").text(text);
    }
  })
  console.log("hehhhhhhhh")
  $(".drag_function").draggable(function(){
    if($(this).attr("class").includes("subject_seq")){
      console.log("hi!")
      $(this).addClass("being_dragged")
      return "enabled"
    }else{
      return "disabled"
    }
  })

  initiation=true;

  /*  $(".subject_seq").draggable({
      disabled: false,
      helper: "clone",
      opacity: 0.5,
      start: function(event, ui){
        $(".position").on("mouseenter", function(){
          position_drag(this);
          $(".position").text("").css("border-color", "#0071aa").css("background-color", "#cccccc")
          $(this).text(ui.helper.text()).css("border-color", "#0e2447").css("background-color", "white")
          $(".subject_seq").css("opacity", "0.5");
        }).on("mouseout", function(){
          $(this).draggable({
            disabled: true,
          }).text("").css("border-color", "#0071aa").css("background-color", "#cccccc")
          $(".subject_seq").css("opacity", function(){
              if(!$(this).attr('class').includes("ui-draggable-dragging")){
                return "1";
              }else{
                return "0.5";
              }
          });
        })
      },
      stop: function(event, ui){
        $(".position").off("mouseenter").off("mouseout")
      }
    })*/
    $(".position").animate({
      opacity:1,
    }, 500)
    console.log("done")
  })
//OPTION key
  //deal with buttons
  $("#next").off("click")
  $("#prev").off("click").on("click", function(){
    Back_to_Original_Sequence();
  })


}
position_drag = function(t){
  $(t).draggable({}).draggable("destroy").draggable({
    disabled: false,
    //helper: ".subject_seq",
    opacity: 0.5,
    revert: true,
    revertDuration: 0,
    start:function(event, ui){
      $(".position").on("mouseenter", function(){
        if(!$(this).attr("class").includes("ui-draggable-dragging")){
        console.log("heheh")
        position_drag(this);
        $(".position").draggable(function(){
          if(!$(this).attr("class").includes("ui-draggable-dragging")){
            return "disabled"
          }else{
            return "enabled"
          }
        }).text("").css("border-color", "#0071aa").css("background-color", "#cccccc")
        $(this).text($(".subject_seq").text()).css("border-color", "#0e2447").css("background-color", "white")
        //$(".subject_seq").css("opacity", "0.5");
      }
      }).on("mouseout", function(){
        $(this).draggable({
          disabled:true,
        }).text("").css("border-color", "#0071aa").css("background-color", "#cccccc")

        $(".subject_seq").css("opacity","1");
      })
    },
    stop: function(){
      $(".position").off("mouseenter").off("mouseout")
    },
  })
}



Back_to_Original_Sequence =function(){
  //left pane change
  Original_Sequence_sub();



  var subject_seq_pos;
  $(".trivial").css("position", "relative")
  $(".subject_seq").prependTo("#summary_pane")
  $("#candidate").remove()
  console.log($(".subject_seq").after())
  $(".subject_seq").css("margin-bottom", "31px");// should be 20 later
  for(var i=0; i<total_time_block_num; i++){
    var y_pos = -$("#seq_"+i.toString()).position().top+10;
    for(var j=0; j<i; j++){
      y_pos += $("#seq_"+j.toString()).height()+44
    }
    if(!$("#seq_"+i.toString()).attr("class").includes("subject_seq")){

      $("#seq_"+i.toString()).animate({
        opacity: 1,
        top: y_pos-$('#summary_pane').scrollTop(),
      }, 990)
    }else{
      subject_seq_pos = y_pos-$('#summary_pane').scrollTop();
    }
  }

  $(".position").animate({
    opacity:0,
  }, 990, function(){

  });


  $(".subject_seq").animate({
    top: subject_seq_pos,
    opacity: 1,
  }, 1000, function(){
    $(".subject_seq").css("margin-bottom", "20px");
    $(".position").css("display","none")
    for(var i=total_time_block_num-1; i>-1; i--){
        $("#seq_"+i.toString()).prependTo($("#summary_pane")).css("top","0");
    }

  })
  $("#next").off("click").on("click", function(){
    Chronological_Sequence()
  })
  $("#prev").off("click")
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
