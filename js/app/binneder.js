$(function() {
  $(".fancyRange input").on("change", function () {
  	var input = $(this);
  	input.next().html(input.val());
  })
});