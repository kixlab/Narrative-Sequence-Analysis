var done = []

$(document).ready(function(){
  load_text();
  scroll_position_set();
  $("#end_task").on("click", function(){
    return_data();
  })
  window.onresize = function(event){
    window_resize();
  }
})


load_text = function(){
  $.ajax({
    url: '/time_annotation/retrieve_novel2',
    data:{
      "text_name" : "Hard feelings",
    },
    dataType: 'json',
    success: function(data){
      $("#title").append(data.novel_name)
      $("#tb").append(data.novel_part)
      window_resize();
      $("#tl").height($("#tb").height());
      append_boundaries();
    },
    error: function(data){

    }
  })
}

append_boundaries = function(){
  for(var i =1; i<4; i++){
    var cur_id = "#part"+i.toString();
    var h_offset = $(cur_id).offset().top;
    var w_offset = i*5;
    $("#tl").append("<div id='line_"+i.toString()+"' class='line'></div><div class='sum_box' id='bound_"+i.toString()+"'><div>Is here time gap?</div></div>")
    $("#line_"+i.toString()).offset({top: h_offset}).width(function(){
        return $(this).width()-15;
    })
    $("#bound_"+i.toString()).offset({top: h_offset}).width(function(){
        return $(this).width()-15;
    }).append("<button id='yes_"+i.toString()+"' class='yes'>Yes</button>").append("<button id='no_"+i.toString()+"' class='no'>No</button>")
    .on("mouseover", function(){
      $(this).css("z-index", "2");
      var id = $(this).attr("id")[6]
      $("#part"+(parseInt(id)-1).toString()).css("text-decoration", "underline");
      $("#part"+id).css("text-decoration", "underline");
    }).on("mouseout", function(){
      $(this).css("z-index", "1");
      var id = $(this).attr("id")[6]
      $("#part"+(parseInt(id)-1).toString()).css("text-decoration", "none");
      $("#part"+id).css("text-decoration", "none");
    }).css("left", w_offset.toString()+"px");
    $("#yes_"+i.toString()).on("mouseover", function(){
      $(this).css("border-color", "black");
    }).on("mouseout", function(){
      $(this).css("border-color", "grey")
    }).on("click", function(){
      if($(this).css("opacity")=="1"){
        $(this).css("opacity", "0.65")
        $("#end_task").css("visibility", "hidden");
        var id = $(this).attr("id")[3]
        done.splice(done.indexOf(id),1)
        console.log(done);
      }else{
        $(this).css("opacity", "1")
        var id = $(this).attr("id")[4]
        $("#no_"+id).css("opacity", "0.65")
        to_next_task(id)
      }
    })
    $("#no_"+i.toString()).on("mouseover", function(){
      $(this).css("border-color", "black");
    }).on("mouseout", function(){
      $(this).css("border-color", "grey")
    }).on("click", function(){
      if($(this).css("opacity")=="1"){
        $(this).css("opacity", "0.65")
        $("#end_task").css("visibility", "hidden");
        var id = $(this).attr("id")[3]
        done.splice(done.indexOf(id),1)
        console.log(done);
      }else{
        $(this).css("opacity", "1")
        var id = $(this).attr("id")[3]
        $("#yes_"+id).css("opacity", "0.65")
        to_next_task(id)
      }
    })
  }
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

to_next_task = function(id){
  if(!done.includes(id)){
    done.push(id)
  }
  console.log(done);
  if(undone_check() == -1){
    //end task
    if(confirm("You checked all the splitted boundaries. Want to return result now?")){
      return_data();
    }else{
      $("#end_task").css("visibility", "visible")
      //show button
    }
  }else{
    //make it focused
    var next_id = undone_check();
    h_offset = $("#bound_"+next_id.toString()).offset().top;
    object_h = $("#bound_"+next_id.toString()).height();
    scrollTop_h = $("#summary_pane").scrollTop()
    scroll_height = $("#summary_pane").height()
    if(h_offset < scrollTop_h || h_offset+object_h > scrollTop_h + scroll_height){
      $("#summary_pane").animate({scrollTop:h_offset}, 1000)
    }
    $("#bound_"+next_id.toString()).effect("bounce", 1000);
  }
}

undone_check = function(){
  for(var i =1; i<4; i++){
    if(!done.includes(i.toString())){
      return i;
    }
  }
  return -1;
}

return_data=function(){
  console.log("return data")
}
