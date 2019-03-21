$(document).ready(function () {



   const $screen = document.getElementById("screen");
   $screen.innerHTML = '';

   // CLICK NUMBERS

   $("a:not(#navmore)").on("click", function () {

      if ($screen.innerHTML !== '') {
         $screen.innerHTML += this.innerHTML;
      } else if ($screen.innerHTML === '') {
         $screen.innerHTML = this.innerHTML;
      }

   });


   // CLICK OPERATORS

   // CLICK EQUALS


   // LOAD ADVANCED KEYS
   $("#navmore").on("click", function () {
      $("#basic-op").load("adv-op.html");
   });
   $("#contact").click(function () {
      $("#content").load("./contact.html");
   });




});
