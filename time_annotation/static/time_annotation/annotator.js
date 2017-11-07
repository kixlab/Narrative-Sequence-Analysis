var novel_text;
var total_sentence_length;
var cur_sentence_num=0;
var selected = [];
var sel_st;
var sel_end;
var tuto_seq = 1;
var prev_mouse_pos;
$(document).ready(function(){
  load_text();
  scroll_position_set();
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

  $("#end_task").on("click", function(){
    if(total_sentence_length==cur_sentence_num){
      return_data();
    }
  })
  $("#make_block").css("color", "#cccccc").off("mousedown")
  //#tb
  $("body").on("mousedown", function(e){
    $(".sentence").off("mouseout")
    if($(".deselector").length>0){
      prev_mouse_pos = e.pageY - $(".deselector").offset().top;
  }
  }).on("mouseup", function(e){
    if($(".deselector").length>0){
      var next_mouse_pos = e.pageY - $(".deselector").offset().top;
      if(prev_mouse_pos * next_mouse_pos <=0){
        window.getSelection().removeAllRanges();
        return;
      }
    }
    //console.log($(this).html())
    $(".sentence").css('color', "black");
    console.log(window.getSelection().toString());
    var selected = window.getSelectionCharOffsetsWithin($(this).get()[0])
    //console.log($(this).get()[0])
    console.log(window.getSelection())
    if(window.getSelection().anchorNode!=null){
    if(window.getSelection().anchorNode.parentElement.className=="sentence" && window.getSelection().extentNode.parentElement.className=="sentence"){
      sel_st = window.getSelection().anchorNode.parentNode.id
      sel_end = window.getSelection().extentNode.parentNode.id
      if(parseInt(sel_st) > parseInt(sel_end)){
        var temp = sel_end;
        sel_end = sel_st;
        sel_st = temp;
      }
      console.log(sel_st)
      console.log(sel_end)
      console.log(selected.start)
      console.log(selected.end)
      if(selected.start!=selected.end){
        for(var i=parseInt(sel_st); i<parseInt(sel_end)+1; i++){
          $("#"+i.toString()).css('color', "rgb(150,150,255)");
        }
      $("#make_block").css("color", "black").on("mousedown", function(){
        return_selection();
        $(this).css("color", "#cccccc");
      })
      }else{
        $("#make_block").css("color", "#cccccc").off("mousedown")
        sel_st=-1;
        sel_end=-1;
      }

      console.log(novel_text.substr(selected.start, selected.end-selected.start))
      document.getSelection().removeAllRanges();
  }else{
    $("#make_block").css("color", "#cccccc").off("mousedown")
    sel_st=-1;
    sel_end=-1;
  }
}else{
    $("#make_block").css("color", "#cccccc").off("mousedown")
    sel_st=-1;
    sel_end=-1;
  }

  });

  window.onresize = function(event){
    window_resize();
  }
})

return_selection = function(){
  var color = random_pastel();
  if((sel_end!=-1)&&(sel_st!=-1)){
    for(var i=parseInt(sel_st); i<parseInt(sel_end)+1; i++){
    $("#"+i.toString()).attr("class","sen_sel").addClass(sel_st).css("background-color", color)
    .css("color", "black").off("mouseover").off("mouseout");
  }
  ///
  //$("#novel_text").css("z-index","7");
  $(".sum_box").css("z-index","1");
  $("."+sel_st).on("mouseover", function(){
    $(".sum_box").css("z-index","1");
    $("#sum_"+$(this).attr("class").substr(8)).css("z-index", "2").css("background-color", "#eeeeff");
    $("."+$(this).attr("class").substr(8)).css("text-decoration", "underline");
  }).on("mouseout", function(){
    $("#sum_"+$(this).attr("class").substr(8)).css("background-color", "white");
    $("."+$(this).attr("class").substr(8)).css("text-decoration", "none");
  })
  var h_offset = $("#"+sel_st).offset().top;
  $("#tl").append("<div class='sum_box' id='sum_"+sel_st+"'><p id='inst_"+sel_st+"'>Put a summary for the selected area</p></div>")
  $("#sum_"+sel_st).offset({top: h_offset}).append("<textarea id='sum_input_"+sel_st+"' class='sum_input'></textarea>")
  .append("<button id='submit_"+sel_st+"' val="+sel_st+" val2="+sel_end+" class='sub'>Submit</button>").append("<button id='cancel_"+sel_st+"' val="+sel_st+" class='del'>Delete</button>");
  h_offset = $("#sum_"+sel_st).offset().top;
  object_h = $("#sum_"+sel_st).height();
  scrollTop_h = $("#summary_pane").scrollTop()
  scroll_height = $("#summary_pane").height()
  if(h_offset < scrollTop_h || h_offset+object_h > scrollTop_h + scroll_height){
    $("#summary_pane").animate({scrollTop:h_offset}, 1000)
  }
  //
  $("#cancel_"+sel_st).on("click", function(){
    $("#end_task").css("visibility", "hidden");
    $(".overlay").css("visibility", "hidden")
    var destroy_id = "sum_"+$(this).attr("val");
    console.log($(this).attr("val"));
    //$("#summary_pane").css("z-index","0");
    $(".sum_box").css("z-index","1")
    $("."+$(this).attr("val")).css("text-decoration", "none").css("z-index", "1").attr("class", "sentence").css("background-color", "transparent").off("mouseover").off("mouseout")
    /*.on("mouseover", function(){
      //$(this).css("text-decoration", "underline")
    }).on("mouseout", function(){
      $(this).css("text-decoration", "none");
    })*/
    $("#"+destroy_id).remove();
    //delete
    var st = parseInt($(this).attr("val"))
    delete_from_selected(st);
    console.log(selected);
  })

  $("#submit_"+sel_st).on("click", function(){
    enter_button(this, 0, $("#sum_"+$(this).attr("val")).outerHeight())
  })
  //
  console.log(typeof(sel_st))
  $("."+sel_st).css("z-index","3");
  $(".overlay").css('visibility',"visible");
  //$("#overlay_trans").css('visibility',"visible");
  }
  sel_st = -1;
  set_end = -1;

}

enter_button = function(t, h, init_h){
  $("#end_task").css("visibility", "hidden");

  $(t).text("Revise")
  $(".overlay").css("visibility", "hidden")
  //$("#summary_pane").css("z-index","0");
  $(".sum_box").css("z-index", "1");
  $(".sen_sel").css("z-index", "1");
  $("#sum_input_"+$(t).attr("val")).before("<div id='sum_text_"+$(t).attr("val")+"'>"+$("#sum_input_"+$(t).attr("val")).val()+"</div>");
  $("#sum_input_"+$(t).attr("val")).css("position", "fixed").css("visibility", "hidden");
  $("#inst_"+$(t).attr("val")).css("position", "fixed").css("visibility", "hidden");
  $("#sum_"+$(t).attr("val")).css("z-index", "0");
  $(t).off("click").on("click", function(){
    $("."+$(t).attr("val")).css("text-decoration","none");
    revise_button(t, h, init_h)
  })
  h = $("#sum_text_"+$(t).attr("val")).outerHeight(true)+$("#submit_"+$(t).attr("val")).outerHeight(true)//$("#sum_"+$(t).attr("val")).outerHeight();
  $("#sum_"+$(t).attr("val")).animate({height:$("#sum_text_"+$(t).attr("val")).height()}, 500).on("mouseover", function(){
    console.log(h);
    $("."+$(t).attr("val")).css("text-decoration","underline");
    $(".sum_box").css("z-index", "0");
    $(this).css("z-index", "1").stop(true, false).animate({height:h}, 500);
  }).on("mouseout", function(){
    $("."+$(t).attr("val")).css("text-decoration","none");
    $(this).stop(true, false).animate({height:$("#sum_text_"+$(t).attr("val")).height()}, 500);
  })

  //contain data
  var st = parseInt($(t).attr("val"))
  var end = parseInt($(t).attr("val2"))
  var text = $("#sum_text_"+$(t).attr("val")).text()
  if(!find_among_selected(st)){
    dict ={}
    if($("#tb").children("a").attr("id")==st.toString() || st==0 ){
      dict['beginning']=true;
    }else{
      dict['beginning']=false;
    }
    if(parseInt($("#tb").children("a").attr("id"))+29==end){
      dict['ending']=true;
    }else{
      dict['ending']=false;
    }
    console.log($("#tb").children("a").attr("id"))
    dict['start']=st
    dict['end'] = end
    dict['summary'] = text
    selected.push(dict);
  }
  cur_sentence_num = cur_sentence_num+end-st+1;
  if(cur_sentence_num==total_sentence_length){
    if(confirm("You splitted and summarized whole parts of the given text. Want to submit and finish?")){
      return_data();
    }else{
      $("#end_task").css("visibility", "visible");
    }
  }
  console.log(selected);
}
revise_button = function(t, h, init_h){
  $("#end_task").css("visibility", "hidden");
  console.log($(t).attr("val"))
  $("#sum_"+$(t).attr("val")).stop(true, true).off("mouseover").off("mouseout")

  $(t).text("Submit")
  $("#sum_text_"+$(t).attr("val")).remove();
  $(".overlay").css("visibility", "visible")
  $("#sum_input_"+$(t).attr("val")).css("position", "relative").css("visibility", "visible");
  $("#inst_"+$(t).attr("val")).css("position", "relative").css("visibility", "visible");
  //$(".sum_box").css("z-index","1");
  //$("#summary_pane").css("z-index","4");
  $("#sum_"+$(t).attr("val")).css("z-index", "5");
  $("."+$(t).attr("val")).css("z-index", "3");
  $(t).off("click").on("click", function(){
    enter_button(t, h, init_h)
  })
  $("#sum_"+$(t).attr("val")).height(init_h)
  //delete
  var st = parseInt($(t).attr("val"))
  delete_from_selected(st);
  console.log(selected);
}

load_text = function(){

  $.ajax({
    url: '/time_annotation/retrieve_novel',
    data:{
      "text_name": "Hard feelings",
      //"text_id" : 27,
    },
    dataType: 'json',
    success: function(data){
      novel_text = data.novel_text//.replace(/<\/?[^>]+(>|$)/g, "");

      console.log(novel_text)
      $("#title").text(data.novel_title);
      $("#tb").append(data.novel_text)
      total_sentence_length = $("#tb").children("a").length;
      console.log(total_sentence_length);
      $("#tl").height($("#tb").height());
      $(".deselector").on("mouseover", function(){
        document.getSelection().removeAllRanges();
      })
      //save(data.novel_title, $("#tb").html());
      window_resize();
    },
    error: function(data){

    }
  })
}
save = function(novel_title, novel_text_){
  $.ajax({
    url: '/time_annotation/save',
    data:{
      "text_name": novel_title,
      "text" : novel_text_,
    },
    dataType: 'json',
    success: function(data){
      novel_text = data.novel_text;
      $("#title").text(data.novel_title);
      $("#tb").append(data.novel_text)

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

function getSelectionHtml() {
    var html = "";
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var container = document.createElement("div");
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                container.appendChild(sel.getRangeAt(i).cloneContents());
            }
            html = container.innerHTML;
        }
    } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
            html = document.selection.createRange().htmlText;
        }
    }
    return html;
}
function getSelectionCharOffsetsWithin(element) {
    var start = 0, end = 0;
    var sel, range, priorRange;
    if (typeof window.getSelection != "undefined" && window.getSelection().anchorNode != null) {
        console.log(window.getSelection())
        range = window.getSelection().getRangeAt(0);

        priorRange = range.cloneRange();
        priorRange.selectNodeContents(element);
        priorRange.setEnd(range.startContainer, range.startOffset);
        console.log(priorRange.toString())
        start = priorRange.toString().length;
        end = start + range.toString().length;
    } else if (typeof document.selection != "undefined" &&
            (sel = document.selection).type != "Control") {
        range = sel.createRange();
        priorRange = document.body.createTextRange();
        priorRange.moveToElementText(element);
        priorRange.setEndPoint("EndToStart", range);
        start = priorRange.text.length;
        end = start + range.text.length;
    }
    return {
        start: start,
        end: end
    };
}

random_pastel = function(){
  r = parseInt((Math.random()*255+255)/2)
  g = parseInt((Math.random()*255+255)/2)
  b = parseInt((Math.random()*255+255)/2)

  return "rgb("+r.toString()+", "+g.toString()+", "+b.toString()+")"
}

return_data=function(){
  console.log("data transferred");
  $.ajax({
    url: '/time_annotation/return_data',
    data:{
      "summary": JSON.stringify(selected),
      "text_name": "Hard feelings",
    },
    dataType: 'json',
    success: function(data){
      alert("Thanks for participating");
      $("body").remove()
    },
    error: function(data){

    }
  })
}

delete_from_selected = function(st){

  var r = find_among_selected(st)

  if(r!=false){
    console.log(r)
    var s= selected[r-1]['start']
    var e= selected[r-1]['end']
    cur_sentence_num = cur_sentence_num-(e-s+1);
    selected.splice(r-1, 1);
  }
}

find_among_selected=function(st){
  for(var i=0; i<selected.length; i++){
    if(selected[i]['start']==st){
      return i+1;
    }
  }
  return false;
}
