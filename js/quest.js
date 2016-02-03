function q() {
   $("#part-5 .back .bk").click(function() {
      $("#part1").show();
      $("#part2").hide();
      $("#part3").hide();
      $("#part4").hide();
      $("#part-5 a.bk").hide();
      $("#part-5 .btns, #part-5 h4").show();
      $("#part-5 .back").hide();
   });
   $("#part-5 a.fw1").click(function() {
      $("#part1").hide();
      $("#part2").show();
      $("#part3").hide();
      $("#part4").hide();
      $("#part-5 a.bk").show();
      $("#part-5 .btns, #part-5 h4").hide();
      $("#part-5 .back").show();
   });
   $("#part-5 a.fw2").click(function() {
      $("#part1").hide();
      $("#part2").hide();
      $("#part3").show();
      $("#part4").hide();
      $("#part-5 a.bk").show();
      $("#part-5 .btns, #part-5 h4").hide();
      $("#part-5 .back").show();
   });
   $("#part-5 a.fw3").click(function() {
      $("#part1").hide();
      $("#part2").hide();
      $("#part3").hide();
      $("#part4").show();
      $("#part-5 a.bk").show();
      $("#part-5 .btns, #part-5 h4").hide();
      $("#part-5 .back").show();
   });
   $("#q-form").submit(function(event) {
      var obj = {};
      var arr = [];
      $.each($('#q-form input:not(:submit, :button, :file)'), function() {
         var myname = this.name;
         if ($.grep(arr, function(n) {
               return n.k == myname;
            }).length == 0) {
            if (this.type == "radio") {
               obj[myname] = $("input[name=" + myname + "]:checked").val();
               //arr.push({k:myname,v:$("input[name="+myname+"]:checked").val()});
            } else if (this.type == "checkbox") {
               arr.push({
                  k: myname
               });
            } else {
               obj[myname] = $("input[name=" + myname + "]").val();
               //arr.push({k:myname,v:$("input[name="+myname+"]").val()});
            }
         }
      });
      console.log(obj)
      $.ajax({
         method: "POST",
         data: obj,
         success: function(msg) {
            document.open();
            document.write(msg);
            document.close();
         }
      })
      event.preventDefault();
   });


}
$(document).ready(function() {
   var u = new q();
});