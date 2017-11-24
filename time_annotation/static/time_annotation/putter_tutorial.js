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
var explanations =["You will read extracted important events of a story",
"They are aligned in original story sequence,",
"Or aligned in chronological sequence.",
"You can change how you are seeing events by clicking switching button.",
"You need to decide when this event happened, in chronological sequence",
"You can decide it by clicking on one of places",
"After you are done, submit it with the submit button."]
var tuto_pos = [{my:"center center", at:"center center", of:"body"},
  {my:"center center", at:"center center", of:"#summary_pane"},
   {my:"right top", at:"left top", of:"#sequential_pane"},
   {my:"right top", at:"left top", of:"#switch"},
   {my:"left bottom", at:"left top", of:"#subject_seq"},
   {my:"right center", at:"left center", of:"#sequential_pane"},
   {my:"right top", at:"left top", of:"#submit"}]
var cur_tuto =0;
var initiation = false;

var diff_clicked=true;
var prev_clicked;

$(document).ready(function(){
//tutorial_set();
  //scroll_position_set();
  load_text();

  window.onresize = function(event){
    //window_resize();
  }
  $("#switch").on("click", function(){
    Switch_Pane();
  })
  $("#submit").on("click", function(){
    console.log($('input[name=group]:checked').val())
    if($('input[name=group]:checked').val() != null){
      if(confirm("Submit your work?")){
        console.log("return data");
        //return_data();
        alert("Thank you for participating!")
      //  $("body").empty().append("<div>Your Worker ID</div><div>"+worker_id+"</div>")
      }
    }else{
      alert("Cannot submit because you did not specify answer")

    }
  })
  });


load_text = function(){

      important_blocks = [{
        'id': 0,
        'summary' :'A man is feeling hunger.'
      },{
        'id': 4,
        'summary' :'So he decides to eat a big meal.'
      }]//JSON.parse(data.important_blocks);
      subject_block = {
        'id':1,
        'summary': 'It might be because he did exercise harshly.'
      }//JSON.parse(data.subject_block);

      for(var i=0; i<explanations.length; i++){
        $("#tt").append("<p>"+explanations[i]+"</p>")
      }
      total_time_block_num = 5;
      Original_Sequence();
      //window_resize();
      tutorial_set();


}

Original_Sequence=function(){
  //left pane
  $("#chronological_title").css("font-size", "7pt");
  for(var i=0; i<total_time_block_num; i++){
    $("#summary_pane").append("<div id='sum_"+i.toString()+"' class='chunk trivial'></div>")
  }
  for(var i=0; i<important_blocks.length; i++){
    $("#sum_"+important_blocks[i]["id"].toString()).css("background-color","white").attr("class", "chunk important").attr('val', i.toString())
    .text(important_blocks[i]['summary']).height($("#sum_"+important_blocks[i]["id"].toString()).height()).css("overflow", "hidden")
  }
  $("#sum_"+subject_block['id'].toString()).text(subject_block['summary']).attr("class", "subject_seq").attr("id", "subject_seq");

  //right pane
  $("#sequential_pane").append("<div id='pos_0' class='position'></div>")
  jsPlumb.connect({
    source: $(".subject_seq").attr("id"),
    target: "pos_0",
    endpoint: ["Dot", {radius: 5}],
    anchors: ["RightMiddle", "LeftMiddle"],
    connector:["Bezier", {curviness: 10}]
  })
  jsPlumb.hide("pos_0")
  for(var i=0; i<important_blocks.length; i++){
    $("#sequential_pane").append("<div id='seq_"+important_blocks[i]["id"].toString()+"' class='chunk trivial'></div>")
    $("#sequential_pane").append("<div id='pos_"+(i+1).toString()+"' class='position'></div>")
    $("#seq_"+important_blocks[i]["id"].toString()).css("background-color","white").attr("class", "chunk important").attr('val', i.toString())
    .text(important_blocks[i]['summary']).height($("#seq_"+important_blocks[i]["id"].toString()).height()).css("overflow", "hidden")
    //make_connection("sum_"+important_blocks[i]["id"].toString(),"seq_"+important_blocks[i]["id"].toString())
    jsPlumb.connect({
      source: $(".subject_seq").attr("id"),
      target: "pos_"+(i+1).toString(),
      endpoint: ["Dot", {radius: 5}],
      anchors: ["RightMiddle", "LeftMiddle"],
      connector:["Bezier", {curviness: 10}]
    })
    jsPlumb.hide("pos_"+(i+1).toString())
  }

  $(".position").height(function(){
    return $(this).height()
  })
  //$("#seq_"+subject_block['id'].toString()).text(subject_block['summary']).attr("class", "subject_seq");
  $("#sequential_pane").removeClass("col-10").addClass("col-1")
  $("#summary_pane").width(function(){
    return $(this).width();
  })
  $("#sequential_pane").width(function(){
    return $(this).width();
  })
  $(".subject_seq").height(function(){
    return $(this).height();
  })

  for(var i=0; i<important_blocks.length; i++){
    make_connection("sum_"+important_blocks[i]["id"].toString(),"seq_"+important_blocks[i]["id"].toString())
  }
  //jsPlumb.hide("subject_seq", true)
  jsPlumb.repaintEverything()
  selection_initiate()

}

Switch_Pane=function(){

  $("#switch").off('click')
  var sequential_pane_width = $("#sequential_pane").outerWidth()
  var summary_pane_width = $("#summary_pane").outerWidth()
  var long_pane_id, short_pane_id;
  if(sequential_pane_width>summary_pane_width){
    long_pane_id="#sequential_pane";
    short_pane_id="#summary_pane";
  }else{
    short_pane_id="#sequential_pane";
    long_pane_id="#summary_pane";
  }
  console.log(long_pane_id)
  if(long_pane_id=="#sequential_pane"){
    $("#original_title").css("font-size", "12pt");
    $("#chronological_title").css("font-size", "7pt");
  }else{
    $("#original_title").css("font-size", "7pt");
    $("#chronological_title").css("font-size", "12pt");
  }
  $(long_pane_id).find(".chunk").height(function(){
    return $(this).height();
  })
  $(long_pane_id).find(".subject_seq").height(function(){
    return $(this).height();
  })
  $(long_pane_id).find(".position").height(function(){
    return $(this).height();
  })
  $(short_pane_id).find(".position").height("")

  $(long_pane_id).removeClass("col-10")//.width(short_pane_width)
  $(short_pane_id).removeClass("col-1")//.width(long_pane_width)

  $(long_pane_id).addClass("col-1")//.width(short_pane_width)
  $(short_pane_id).addClass("col-10")
  jsPlumb.repaintEverything();
    $("#switch").on('click', function(){
      Switch_Pane();
    });
    //})
}

selection_initiate = function(){
  diff_clicked = true;
  $(".position").on("mouseenter", function(){
    //console.log(this)
    $(this).text($(".subject_seq").text())
    $(this).css("padding", "10px").css("background-color", "white").css("opacity","0.7")
    jsPlumb.repaintEverything();
  }).on("mouseout", function(){
    $(this).text("")
    $(this).css("padding","").css("padding-top", "20px").css("padding-bottom", "20px")
  .css("background-color", "#cccccc").css("opacity","1")
    jsPlumb.repaintEverything();
  }).on("click", function(){
    var click_id = $(this).attr('id')
    var t = this
    $(".position").text(function(){
      if(this!=t){
        $(this).css("padding","").css("padding-top", "20px").css("padding-bottom", "20px")
        .css("background-color", "#cccccc").css("opacity","1")
          if(!$(this).text()!=$("#subject_seq").text()){
          $(this).on("mouseenter", function(){
//            console.log(this)
            $(this).text($(".subject_seq").text())
            $(this).css("padding", "10px").css("background-color", "white").css("opacity","0.7")
            jsPlumb.repaintEverything();
          }).on("mouseout", function(){
            $(this).text("")
            $(this).css("padding","").css("padding-top", "20px").css("padding-bottom", "20px")
            .css("background-color", "#cccccc").css("opacity","1")
            jsPlumb.repaintEverything();
          })
        }
        return ""
      }else{
        if($(this).css("opacity")==1){
          diff_clicked = false;
          $(this).on("mouseenter", function(){
    //        console.log(this)
            $(this).text($(".subject_seq").text())
            $(this).css("padding", "10px").css("background-color", "white").css("opacity","0.7")
            jsPlumb.repaintEverything();
          }).on("mouseout", function(){
            $(this).text("")
            $(this).css("padding","").css("padding-top", "20px").css("padding-bottom", "20px")
            .css("background-color", "#cccccc").css("opacity","1")
            jsPlumb.repaintEverything();
          }).css("opacity", 0.7)
        }else{
          $(this).off("mouseout").off("mouseenter").css("opacity", 1)
        }

        return $(this).text()
      }
    })
    if(prev_clicked != null){
      console.log(prev_clicked, click_id)
    jsPlumb.hide(prev_clicked)
    if(prev_clicked != click_id){
        jsPlumb.show(click_id)
        prev_clicked = click_id
    }else{
        prev_clicked = null
    }
  }else{
    jsPlumb.show(click_id)
    prev_clicked = click_id
  }

    jsPlumb.repaintEverything();
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
  $("#tutorial").css("position","")
  //$('[data-toggle="popover"]').popover();
  //$("#overlay").css("visibility", "visible")
  //$("#summary_pane").popover()
  //$("#summary_pane").popover("show")
  //$("#sequential_pane").popover().popover("show")
  $("#tutorial_content").text(explanations[0])
  var t = $("#tutorial")
  $("#tutorial").dialog("destroy").dialog()
  $("#tuto_p").on("click", function(){
    if(cur_tuto>0){
      cur_tuto=cur_tuto-1;
      tutorial_proceed(t);
    }
  })
  $("#tuto_n").on("click", function(){
    if(cur_tuto<explanations.length-1){
      cur_tuto = cur_tuto+1;
      tutorial_proceed(t);
    }else{
      t.dialog("close")
      $("#submit").removeClass("ui-corner-all").removeClass("ui-button").removeClass("ui-widget")
      $("")
    }
  })

}
tutorial_proceed=function(t){
  $("#tutorial_content").text(explanations[cur_tuto])
  t.dialog({
    position: tuto_pos[cur_tuto]
  })

  $("#switch").removeClass("ui-corner-all").removeClass("ui-button").removeClass("ui-widget")
  $("#submit").removeClass("ui-corner-all").removeClass("ui-button").removeClass("ui-widget")
  if(cur_tuto != 0 && cur_tuto !=5 && cur_tuto !=3 && cur_tuto!=6 && cur_tuto!=4){
    //console.log()
    $(tuto_pos[cur_tuto]['of']).effect("highlight", 1000)
  }else if(cur_tuto ==3){
    $("#switch").button()
  }else if(cur_tuto == 5){
    $(".position").effect("highlight")
  }else if(cur_tuto == 4){
    $("body").animate({
      scrollTop: $("#subject_seq").offset().top
    }, 1000, function(){
      $(tuto_pos[cur_tuto]['of']).effect("highlight", 1000)
    })
    //if($("#subject_seq").offset().top)
  }else if(cur_tuto == 6){
    $("#submit").addClass("ui-button").addClass("ui-widget")
  }


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

jsPlumb.bind("ready", function(){
  jsPlumb.importDefaults({
  ConnectionsDetachable:false,
  deleteEndpointsOnDetach:false,
});

  jsPlumb.setContainer($("#combined_panes"))
  make_connection = function(sum_con, seq_con){
    jsPlumb.connect({
      source: sum_con,
      target: seq_con,
      endpoint: ["Dot", {radius: 5}],
      anchors: ["RightMiddle", "LeftMiddle"],
      connector:["Bezier", {curviness: 10}]
    })
    $(".jtk-connector").off('click')
    window.onresize = function(event){
      $('.chunk').css("height","")
      $('.subject_seq').css("height","")
      $('.position').css("height", "")
      var short;
      if($("#summary_pane").attr('class').includes("col-10")){
        short="#sequential_pane"
      }else{
        short="#summary_pane"
      }
      $(short).removeClass("col-1").addClass("col-10")
      $(short).find(".chunk").height(function(){
        return $(this).height();
      })
      $(short).find(".subject_seq").height(function(){
        return $(this).height();
      })
      $(short).find(".position").height(function(){
        return $(this).height();
      })
      $(short).removeClass('col-10').addClass('col-1')

      jsPlumb.repaintEverything();
    }
  }
  window.redraw=function(){
    jsPlumb.repaintEverything();
  }


})
