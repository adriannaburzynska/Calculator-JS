$(document).ready(function () { // to run code as soon as the doc is ready to be manipulated

   /*///////////////////////////////////////////////////////////////////////////////////////////////
   FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////
   ///////////////////////////////////////////////////////////////////////////////////////////////*/

   // to replace a char in a string
   String.prototype.replaceAt = function (index, replacement) {
      return this.substring(0, index) + replacement + this.substring(index + this.length);
   }

   // to replace a substring between two indices
   String.prototype.replaceBtw = function (start, end, what) {
      return this.substring(0, start) + what + this.substring(end);
   }

   // to make sure that the text div doesn't overflow
   var testNumLength = function () { // 
      if (text.innerHTML.length > 17) text.innerHTML = "Err";
      else if (text.innerHTML.length > 7) { // 
         text.innerHTML = text.innerHTML.substring(0, 7); // return substring
      }
      return text.innerHTML;
   }

   // ± is reset
   function roundReset() {
      n = 0;
   }

   // when you input more numbers or the . to log()
   function moveTheBracket() {
      if (text.innerHTML.indexOf('log') > -1) {
         text.innerHTML = text.innerHTML.replace(')', '');
         text.innerHTML += ')';
      }
   }

   // animations
   function animate(opt) {

      if (opt === 'eval') {
         $('#text').fadeTo(500, 0.001); // "hide" text 
         text.innerHTML = eval(text.innerHTML); // the equation can be evaluated and shown in the text div
      }

      if (opt === 'pow' && text.innerHTML.indexOf('0^') > -1) text.innerHTML = 'Err'; // don't

      else if (opt === 'pow') {
         var index = text.innerHTML.indexOf('^'); // take the index of the operator   
         var first = text.innerHTML.substring(0, index); // return the 1st number inputed 
         var second = text.innerHTML.substring(index + 1, text.innerHTML.length); // return the 2nd number inputed
         $('#text').fadeTo(500, 0.001); // "hide" text 
         text.innerHTML = ((Math.pow(parseFloat(first, 10), parseFloat(second, 10))).toString(10)); // call Math.pow() on the first number inputed, raising it to the second number
      }

      // all of them
      $('#text').fadeTo(500, 0.001).fadeTo(500, 1); // "hide" & "show" text
      testNumLength();
   }

   /*---------------------------------------------------------------------------------------------
    CALCULATOR -----------------------------------------------------------------------------------
    --------------------------------------------------------------------------------------------*/

   let decimalAdded = false; // a flag for the number of decimals in a number
   const operators = ['+', '-', '×', '÷']; // to check operators later
   const bottom = document.getElementById('bottom'); // for event delegation
   const text = document.querySelector('#text'); // grab the text 
   var eq = text.innerHTML; // the equation = the string inside the text div     
   eq = ''; // default text

   // set up an onclick event to all the keys and perform operations 
   bottom.addEventListener("click", function (event) { // event delegation - no need to iterate through these keys
      event.preventDefault(); // prevent page jumps
      let target = event.target;
      // to get all the keys from document but exclude the existing nav btn
      if (target.nodeName === "A" && target.id !== "navmore" && target.id !== "navback") {

         /*///////////////////////////////////////////////////////////////////////////////////////////////
          BASIC FUNCTIONALITY ////////////////////////////////////////////////////////////////////////////
         ///////////////////////////////////////////////////////////////////////////////////////////////*/

         const btnVal = target.innerHTML; // get the text/ value of this clicked key
         // append the key values to the text string and use the eval function to get the result

         switch (btnVal) {
            /*----------------------------------------------------------------------------------------------
             CLEAR KEY -------------------------------------------------------------------------------------
             ---------------------------------------------------------------------------------------------*/

            case 'C': // if pressed, erase everything
               text.innerHTML = ''; // reset text
               $('#text').fadeTo(500, 1); // reset animation
               decimalAdded = false; // no decimals have been added
               roundReset(); // ± is reset
               break;

               /*----------------------------------------------------------------------------------------------
                PI/ e KEY -------------------------------------------------------------------------------------
               -------------------------------------------------------------------------------------------- */

            case 'π':
            case 'e':
               $('#text').fadeTo(500, 0.001);
               text.innerHTML += btnVal;

               if (text.innerHTML.length === 1) { // if there's just this symbol 
                  let string = text.innerHTML;
                  switch (string) {
                     case 'π': // π
                        text.innerHTML = '';
                        text.innerHTML += Math.PI;
                        console.log('empty π');
                        break;
                     case 'e':
                        text.innerHTML = '';
                        text.innerHTML += Math.E;
                        console.log('empty e');
                  }
               }
               animate('def');

               /*----------------------------------------------------------------------------------------------
                EVAL KEY --------------------------------------------------------------------------------------
                ---------------------------------------------------------------------------------------------*/

               // If eval key is pressed, calculate and display the result
            case '=':
               if (text.innerHTML.indexOf('π') === -1 && text.innerHTML.indexOf('e') === -1) {
                  text.innerHTML = text.innerHTML.replace(/×/g, '*').replace(/÷/g, '/');
               } // replace x with *, and ÷ with /

               var lastChar = text.innerHTML[text.innerHTML.length - 1]; // holds the last character in that text string

               // if the last character is an operator or a decimal, remove it
               if (operators.indexOf(lastChar) > -1 || lastChar == '.')
                  text.innerHTML = text.innerHTML.replace(/.$/, ''); // .$ will match any char at the end of a string and remove it

               /*----------------------------------------------------------------------------------------------
               PERCENT KEY ------------------------------------------------------------------------------------
               ----------------------------------------------------------------------------------------------*/

               if (text.innerHTML.indexOf('%') !== -1) { // if % - if x+y%*z
                  console.log('%=');
                  var percent;

                  text.innerHTML = text.innerHTML.replace(/×/g, '*').replace(/÷/g, '/'); // replace all instances of x with *, and ÷ with

                  (text.innerHTML.indexOf("/") > -1) ?
                  percent = text.innerHTML.substring(text.innerHTML.lastIndexOf("/") + 1, text.innerHTML.length - 1):
                     percent = text.innerHTML.substring(text.innerHTML.lastIndexOf("*") + 1, text.innerHTML.length - 1); // 100% --> 100

                  var decimal = ((parseFloat(percent)) / 100).toString(); // 100% --> 1

                  (text.innerHTML.indexOf("/") > -1) ?
                  text.innerHTML = text.innerHTML.replaceBtw(text.innerHTML.indexOf("/") + 1, text.innerHTML.length, decimal):
                     text.innerHTML = text.innerHTML.replaceBtw(text.innerHTML.indexOf("*") + 1, text.innerHTML.length, decimal); // 2*100% --> 2*1

                  text.innerHTML = eval(text.innerHTML); // 2*1 --> 2
                  decimalAdded = true;

                  // we cannot divide by 0
               } else if (text.innerHTML.indexOf('/0') > -1) {
                  console.log('dont 0');
                  text.innerHTML = 'Err ';
                  animate();

                  // if the text is not empty and this is a basic operation
               } else if (text.innerHTML && text.innerHTML.indexOf('^') === -1 && text.innerHTML.indexOf('ln') === -1 && text.innerHTML.indexOf('log') === -1 && text.innerHTML.indexOf('π') === -1 && text.innerHTML.indexOf('e') === -1) {
                  console.log('=');
                  animate('eval');
               }
               /*----------------------------------------------------------------------------------------------
                PI/ e KEY -------------------------------------------------------------------------------------
               -------------------------------------------------------------------------------------------- */
               else if (text.innerHTML.indexOf('π') > -1 || text.innerHTML.indexOf('e') > -1) { // if there's a π or e somewhere
                  let pi = text.innerHTML.indexOf('π'); // find its index
                  console.log(pi);
                  let e = text.innerHTML.indexOf('e');
                  let oppi = text.innerHTML[pi - 1]; // get this operator
                  console.log(oppi);
                  let ope = text.innerHTML[e - 1];
                  console.log('opepi index: ' + operators.indexOf(oppi) + ', ope index: ' + operators.indexOf(ope));

                  /*    // if there's no operator, like 3π
                      if (operators.indexOf(oppi) === -1 && operators.indexOf(ope) === -1) {
                         console.log('no op');
                         console.log('e: ' + e + ', pi: ' + pi);
                         var string = text.innerHTML;

                         switch (e) { // check e's index
                            case -1: // with π
                               console.log('change π');
                               text.innerHTML = [string.slice(0, pi), "×", string.slice(pi)].join(''); // add '×' before 'π' - 3×π
                               text.innerHTML = text.innerHTML.replaceAt(pi + 1, Math.PI); // replace 'π' with its value
                               break;
                            default:
                               console.log('change e');
                               text.innerHTML = [string.slice(0, e), "×", string.slice(e)].join(''); // add '×' before 'e'
                               text.innerHTML = text.innerHTML.replaceAt(e + 1, Math.E); // replace 'e' with its value
                         }
                      }*/

                  // if there's an operator, like 3×π
                  if ((operators.indexOf(oppi) === -1 && operators.indexOf(ope) !== -1) || (operators.indexOf(oppi) !== -1 && operators.indexOf(ope) === -1)) {
                     console.log('an op');

                     switch (e) { // check e's index
                        case -1: // with π
                           text.innerHTML = text.innerHTML.replaceAt(pi, Math.PI); // replace 'π' with its value
                           break;
                        default:
                           text.innerHTML = text.innerHTML.replaceAt(e, Math.E); // replace 'e' with its value
                     }
                  }
                  text.innerHTML = text.innerHTML.replace(/×/g, '*'); // return the modified string
                  console.log(text.innerHTML);
                  animate('eval');
               }

               /*----------------------------------------------------------------------------------------------
                POW KEY --------------------------------------------------------------------------------------
                ---------------------------------------------------------------------------------------------*/

               // when '=' is clicked & if there's a ^ in the equation & if the index of the last char > index of the operator = if there are more chars after the operator = if the exponent is inputed
               else if (text.innerHTML.indexOf('^') > -1) {
                  console.log(eq);
                  animate('pow');
               } // animates and calculates

               /*----------------------------------------------------------------------------------------------
                LOG & LN KEY ----------------------------------------------------------------------------------
                ---------------------------------------------------------------------------------------------*/
               else if (eq.indexOf('ln') > -1) {
                  text.innerHTML = text.innerHTML.substr(3, equation.length); // remove 'ln('
                  text.innerHTML = Math.log(text.innerHTML);

               } else if (eq.indexOf('log') > -1) { // format: log(x.y
                  text.innerHTML = text.innerHTML.substr(4, text.innerHTML.length); // remove 'log(' 
                  console.log(text.innerHTML); // x.y
                  var index = text.innerHTML.indexOf('.');
                  let x = text.innerHTML.substr(0, index); // x 
                  let y = text.innerHTML.substr(index + 1, text.innerHTML.length); // y 
                  console.log(x + ', ' + y);
                  text.innerHTML = Math.log(y) / Math.log(x);
               }

               decimalAdded = false; // no decimals have been added
               break; // end =

               /*----------------------------------------------------------------------------------------------
                DECIMAL KEY -----------------------------------------------------------------------------------
                 ---------------------------------------------------------------------------------------------*/

               // 4. there should be only 1 decimal in a number
            case '.':
               if (!decimalAdded) { // if there's no decimal in the equation
                  text.innerHTML += btnVal; // a decimal is added to the text 
                  decimalAdded = true; // once it's added, the flag will be set to true to prevent more decimals to be added. It'll be reset when an operator, eval or clear key is pressed.
               }
               moveTheBracket();
               break; // end '.'

               /*----------------------------------------------------------------------------------------------
                PERCENTAGE KEY -----------------------------------------------------------------------------------
                ---------------------------------------------------------------------------------------------*/
            case '%':
               var textLenght = text.innerHTML.length;
               var verified = 0;

               for (var i = 0; i < textLenght; i++) {

                  // when x% = no operators
                  if (text.innerHTML[i] !== '+' && text.innerHTML[i] !== '-' && text.innerHTML[i] !== '×' && text.innerHTML[i] !== '÷') {
                     verified += 1;

                     if (verified === textLenght) { // if this is true for all the chars 

                        // convert the string to a float, make it a decimal & convert it back to a string and add to the equation
                        text.innerHTML = parseFloat(text.innerHTML); // to a number
                        text.innerHTML = text.innerHTML / 100; // make it a decimal
                        text.innerHTML = text.innerHTML.toString(); // convert to a string and set the equation to it
                        decimalAdded = true;
                        console.log('% of sth');
                     }

                     // when x*y%= or x/y%= evaluate right off
                  } else if ((text.innerHTML[i] === '×' && text.innerHTML.indexOf('%') === -1) || (text.innerHTML[i] === '÷' && text.innerHTML.indexOf('%') === -1)) {
                     var index = i; // operator's

                     if (index > 0) { // when we get that index
                        text.innerHTML = text.innerHTML.replace(/×/g, '*').replace(/÷/g, '/'); // replace all instances of x with *, and ÷ with            
                        var percent = text.innerHTML.substr(index + 1, textLenght - 1); // 100% --> 100
                        decimal = ((parseFloat(percent)) / 100).toString(); // 100% --> 1
                        text.innerHTML = text.innerHTML.replace(percent, decimal); // 2*100% --> 2*1
                        text.innerHTML = eval(text.innerHTML); // 2*1 --> 2
                        decimalAdded = true;
                        console.log('sth*%');
                     }
                  }
                  // when x+y% or x-y% wait for z to evaluate % of x-y%z...
                  else if ((text.innerHTML[i] === '+' && text.innerHTML.indexOf('%') === -1) || (text.innerHTML[i] === '-' && text.innerHTML.indexOf('%') === -1)) {
                     text.innerHTML += '%';
                     console.log('+%');
                  } // when x-y%z or x+y%z --> on = key
               }
               break; // end %

               /*----------------------------------------------------------------------------------------------
               MINUS KEY --------------------------------------------------------------------------------------
               ---------------------------------------------------------------------------------------------*/

            case '-':
               $('#text').fadeTo(500, 1); // reset animation - show text
               // EMPTY
               // 2. The equation shouldn't start from an operator except minus
               if (text.innerHTML === '') { // if the string is empty and we click minus 
                  text.innerHTML += btnVal; // add '-' to the end of the equation
                  console.log('start with -');
               }

               // 3. if we then click minus again, let's delete this -
               else if (text.innerHTML === '-') { // 
                  text.innerHTML = "";
                  console.log('remove -'); // delete minus
               }

               /*----------------------------------------------------------------------------------------------
                PLUS, DIVIDE, MULTIPLY KEYS -------------------------------------------------------------------
                ---------------------------------------------------------------------------------------------*/

            case '-':
            case '+':
            case '÷':
            case '×':

               eq = text.innerHTML;
               $('#text').fadeTo(500, 1); // reset animation - show text
               var lastChar = eq[eq.length - 1]; // get this operator
               console.log("-, +, ÷, ×");

               // if text is  empty don't add any operator, except for '-'
               if (eq === "") {
                  eq += "";
                  console.log('dont start with + or ÷ or ×');
               }

               // Only add operator if text is not empty and there is no operator at the last
               else if (operators.indexOf(lastChar) === -1 && eq !== "" && eq !== "-") {
                  text.innerHTML += btnVal;
                  console.log('basic');
               }

               // Replace the last operator (if exists) with the newly pressed operator
               else if (operators.indexOf(lastChar) > -1 && eq.length > 1 && eq !== "-") { // if the last char is an operator AND the equation is at least one digit and an operator AND it's not just a single '-'
                  // an operator at the end of string will get replaced by new operator
                  text.innerHTML = eq.replace(/.$/, btnVal); // replace this operator with the new one 
                  console.log('changing');
               }
               decimalAdded = false; // allows to add '.' to numbers inputed after operators
               break;

               /*///////////////////////////////////////////////////////////////////////////////////////////////
                MORE COMPLEX FUNCTIONALITY /////////////////////////////////////////////////////////////////////
               ///////////////////////////////////////////////////////////////////////////////////////////////*/

               /*----------------------------------------------------------------------------------------------
                LOG & LN KEY ----------------------------------------------------------------------------------
                ---------------------------------------------------------------------------------------------*/
               // the rest happens in the eval section

            case 'log':
               text.innerHTML = "log(x.y)"; // show 
               $("#text").fadeOut(700, function () { // fade this text to another
                  $(this).text("log()").fadeIn();
               });
               break; // end log

            case 'ln': // ln()
               text.innerHTML += "ln(";
               break; // end ln

               /*---------------------------------------------------------------------------------------------
               SQRT KEY --------------------------------------------------------------------------------------
               ---------------------------------------------------------------------------------------------*/

            case '√': // when the square key is clicked 
               text.innerHTML = Math.sqrt(parseFloat(text.innerHTML, 10)).toString(10); // do the math and convert to string 
               decimalAdded = true; // a decimal is added to the text 
               animate();
               break; // end √

               /*---------------------------------------------------------------------------------------------
               POW KEY ---------------------------------------------------------------------------------------
               ---------------------------------------------------------------------------------------------*/
            case '^': // when the power key is clicked 
               if (text.innerHTML !== "") { // and the text is not empty
                  text.innerHTML += '^'; // append the operator
               }
               break;
               // the rest of it happens when '=' is clicked

               /*---------------------------------------------------------------------------------------------
                NEVER APPEND ---------------------------------------------------------------------------------
                ---------------------------------------------------------------------------------------------*/
            case '±':
               text.innerHTML += '';
               break;
               // the rest happens later

               /*----------------------------------------------------------------------------------------------
                NUMBER KEYS & LOG PATTERN ---------------------------------------------------------------------
                ---------------------------------------------------------------------------------------------*/

               // if any number key, just append it OR if it's '()'
            default:

               // when you input a number to log() for the first time
               if (text.innerHTML.indexOf('log') > -1 && text.innerHTML.length < 6) text.innerHTML = 'log(';

               // if we click any number when the text was evaluated to '0' don't append it to the new numbers
               if (text.innerHTML === '0') {
                  text.innerHTML = "";
                  console.log('no 099');
               }

               text.innerHTML += btnVal;
               roundReset();

               // only if the log is not finished already like log(2.5)-x
               if (text.innerHTML.indexOf(')+') > -1 || text.innerHTML.indexOf(')-') > -1 || text.innerHTML.indexOf(')×') > -1 || text.innerHTML.indexOf(')÷') > -1) {
                  return;
               } else {
                  moveTheBracket(); // when you input more numbers to log() 
               }
         } // end switch

      } // end if
   }); // end event delegation

   /*///////////////////////////////////////////////////////////////////////////////////////////////
    KEYBOARD IMPUTS ////////////////////////////////////////////////////////////////////////////////
   ///////////////////////////////////////////////////////////////////////////////////////////////*/

   $(document).keypress(function (event) {
      var keycode = (event.keyCode ? event.keyCode : event.which);
      switch (keycode) {
         case 49:
            $("#one").click();
            break;
         case 50:
            $("#two").click();
            break;
         case 51:
            $("#three").click();
            break;
         case 52:
            $("#four").click();
            break;
         case 53:
            $("#five").click();
            break;
         case 54:
            $("#six").click();
            break;
         case 55:
            $("#seven").click();
            break;
         case 56:
            $("#eight").click();
            break;
         case 57:
            $("#nine").click();
            break;
         case 48:
            $("#zero").click();
            break;
         case 97:
            $("#clearall").click();
            break;
         case 99:
            $("#clear").click();
            break;
         case 61:
            $("#equals").click();
            break;
         case 43:
            $("#plus").click();
            break;
         case 45:
            $("#minus").click();
            break;
         case (42 || 120):
            $("#multiply").click();
            break;
         case 47:
            $("#divide").click();
      } // end switch
   });

   /*///////////////////////////////////////////////////////////////////////////////////////////////
    MORE & BACK NAV ////////////////////////////////////////////////////////////////////////////////
   ///////////////////////////////////////////////////////////////////////////////////////////////*/

   // LOAD ADVANCED KEYS
   $("#navmore").on("click", function () {
      $("#basic-op").load("adv-op.html");
      $('#more').hide();
      $('#navback').show();
      $('#back').show();
   });
   $("#navback").click(function () {
      $("#basic-op").load("basic-op.html");
      $('#navback').hide();
      $('#back').hide();
      $('#more').show();
   });

   /*///////////////////////////////////////////////////////////////////////////////////////////////
   ROUND KEY //////////////////////////////////////////////////////////////////////////////////////
   ///////////////////////////////////////////////////////////////////////////////////////////////*/

   let n = 0; // 10e+0 = 10

   $("#round").click(function () { // each time we click '±' btn
      let number = text.innerHTML;

      if (number.indexOf('.') > -1) { // 12.888 -> 12.89
         let decimalPlaces = number.substring(number.indexOf('.') + 1, number.length).length; // 1.123456 -> 123456 // 6
         number = (+number).toFixed(decimalPlaces - 1); // 1.12346 // 1.1235 // 1.124 // 1.12 // 1.1 // 1
      } else {
         let digits = number.length; // 38 -> 2
         if (n < digits) number = Math.round(number / `10e+${n}`) * `10e+${n}`; // 38 -> 40 or 9 -> 10
         n++;
      }
      text.innerHTML = number;
      animate();
   }); // end round click event
}); // end ready
