$(document).ready(function () { // to run code as soon as the doc is ready to be manipulated

   /*///////////////////////////////////////////////////////////////////////////////////////////////
   FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////
   ///////////////////////////////////////////////////////////////////////////////////////////////*/
   const length = () => text.innerHTML.length; 
   const indexOf = x => text.innerHTML.lastIndexOf(x); 
   const updateOps = () => text.innerHTML = text.innerHTML.replace(/×/g, '*').replace(/÷/g, '/'); 
   const roundReset = () => n = 0; // ± is reset
   const deleteLast = () => text.innerHTML = text.innerHTML.replace(/.$/, ''); // or everything if the length is 1
   const getLastChar = n => text.innerHTML[length()+n];

   const evaluate = () => {
      updateOps();
      text.innerHTML = eval(text.innerHTML);
      testNumLength();
      return text.innerHTML;
   } 
   
   // to replace a substring between two indices
   String.prototype.replaceBtw = function (start, end, what) {
      return this.substring(0, start) + what + this.substring(end);
   };

   // for generating output & messages
   const set = (x, y = "You're not allowed to do this") => {
      text.innerHTML = x; // 'Err'
      empty.innerHTML = y;
      if(x === 'Err') setTimeout(set.bind(null, '0', 'Try again!'), 2000);
      $('#text, #empty').fadeTo(500, 0.001).fadeTo(500, 1); // "hide" text 
   };

   // to make sure that the text div doesn't overflow
   const testNumLength = () => {
      var long = text.innerHTML;
      if (indexOf('e-') > -1) set('Err',`The number ${long} was too small!`);
      else if (length() > 10) {
         var info = '</br>is too long to display';
         long.indexOf('.') > -1 ? set(long.substring(0, 7),`${long.substring(0, length())}${info}`) : 
         set(long.substring(0, 6),`${long.substring(0, length())}${info}`);
      }
   };

   const animate = () => {
      evaluate();
      $('#text, #empty').fadeTo(500, 0.001).fadeTo(500, 1); // hide & show text
   };

   // 1. convert to a float 2. make it a decimal 3. convert to a string 
   function toPercent(number = text.innerHTML) {
      number = ((parseFloat(number)) / 100).toString();
      return (arguments[0] === undefined) ? text.innerHTML = number : number; // if () text.innerHTML = number; else return number;
   };
   
   // 1      // x*y% OR x+z*y%   // get substr btw * and the end   
   // 2      // x+y%*z           // get substr btw + and *
   // 3      // x*y%*z           // get substr btw * and *
   function getPercent() {
      updateOps();

      let percent = (getLastChar !== '%' && (indexOf('+') > -1 || (indexOf('-') > -1))) ?
         text.innerHTML.substring(indexOf("+") + 1, indexOf('%')): 
         text.innerHTML.substring(indexOf("*") + 1, length()); // x*100% --> 100
     
      let decimal = toPercent(percent); // 100 --> 1  console.log(text.innerHTML, percent, decimal);
      
      if (indexOf('%') > -1) text.innerHTML = text.innerHTML.replace(/%/, '');
      text.innerHTML = text.innerHTML.replaceBtw(text.innerHTML.lastIndexOf("*") + 1, length(), decimal); // x*100% --> x*1
      evaluate();
      return text.innerHTML;
   }
       
   function zerosCount(){
      var s = text.innerHTML.match(/(0)\1*/g)||[]; // returns an array!! 
      return s[0] !== undefined ? s[s.length-1].length : 0; // return [itm.charAt(0), itm.length];
   }

   /*---------------------------------------------------------------------------------------------
    CALCULATOR -----------------------------------------------------------------------------------
    --------------------------------------------------------------------------------------------*/
   const operators = ['+', '-', '×', '*', '÷', '/']; // to check operators later; also after upadteOps()
   const bottom = document.getElementById('bottom'); // for event delegation
   const empty = document.querySelector('#empty'); // grab the text 
   const text = document.querySelector('#text'); // grab the text 
   var eq = text.innerHTML; // the equation = the string inside the text div     
   eq = ''; // default value

   // set up an onclick event to all the keys and perform operations 
   bottom.addEventListener("click", function (event) {
      event.preventDefault(); // prevent page jumps
      let target = event.target;

      if (target.nodeName === "A" && target.id !== "navmore" && target.id !== "navback") { // get all the right keys
         /*///////////////////////////////////////////////////////////////////////////////////////////////
          BASIC FUNCTIONALITY ////////////////////////////////////////////////////////////////////////////
         ///////////////////////////////////////////////////////////////////////////////////////////////*/  
         const btnVal = target.innerHTML; // get the text/ value of this clicked key
         const appendBtnVal = () => text.innerHTML += btnVal;

         switch (btnVal) {
            /*----------------------------------------------------------------------------------------------
             CLEAR KEY -------------------------------------------------------------------------------------
             ---------------------------------------------------------------------------------------------*/
            case 'C': // if pressed, erase everything
               set('',''); // reset text
               $('#text, #empty').fadeTo(500, 1); // reset animation
               roundReset(); // ± is reset
               break;

            /*----------------------------------------------------------------------------------------------
             PI/ e KEY -------------------------------------------------------------------------------------
             -------------------------------------------------------------------------------------------- */
            case 'π': case 'e':
               appendBtnVal();
               // if there's just this symbol 
               if (length() === 1) text.innerHTML = (text.innerHTML === 'π') ? Math.PI.toFixed(4): Math.E.toFixed(4);
               
/*------------------------------------------------------------------------------------------------------------
 EVAL KEY ----------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------*/
            case '=': // If eval key is pressed, calculate and display the result
               set(updateOps(),'');

               // if the last char is an operator remove it // .$ matches char at the end 
               if (operators.indexOf(getLastChar(-1)) > -1) deleteLast();

               // if the two last chars are +. remove them
               if (operators.indexOf(getLastChar(-2)) > -1 && getLastChar(-1) === '.') {
                  deleteLast(); 
                  deleteLast();
               }

               /*----------------------------------------------------------------------------------------------
               PERCENT KEY ------------------------------------------------------------------------------------
               ----------------------------------------------------------------------------------------------*/
               if (indexOf('%') > -1) {
                  if(indexOf('*') === -1) set('Err'); // if 9+9%+9%
                  getPercent();

               } else if (indexOf('/0') > -1) set('Err'); // we cannot divide by 0

               // if the text is not empty and this is a basic operation
               else if (text.innerHTML && indexOf('^') === -1 && indexOf('ln') === -1 && indexOf('log') === -1 && indexOf('π') === -1 && indexOf('e') === -1) {
                  console.log('=');
                  animate();
               }

               /*----------------------------------------------------------------------------------------------
                PI/ e KEY -------------------------------------------------------------------------------------
               -------------------------------------------------------------------------------------------- */
               else if (indexOf('π') > -1 || indexOf('e') > -1) { // if there's a π or e somewhere
                  let pi = indexOf('π'); // find its index
                  let e = indexOf('e');
                  let oppi = text.innerHTML[pi - 1]; // get this operator
                  let ope = text.innerHTML[e - 1];
                  console.log(`opepi index: ${operators.indexOf(oppi)}, ope index: ${operators.indexOf(ope)}`);

                  // if there's no operator, like 3π
                  if (operators.indexOf(oppi) === -1 && operators.indexOf(ope) === -1) set('Err', 'Please use operators');

                  // if there's an operator, like 3×π --> replace 'π' OR 'e' with its value
                  if ((operators.indexOf(oppi) === -1 && operators.indexOf(ope) > -1) || (operators.indexOf(oppi) > -1 && operators.indexOf(ope) === -1)) {
                     text.innerHTML = (e === -1) ? text.innerHTML.replace(text.innerHTML.charAt(pi), Math.PI.toFixed(4)):
                     text.innerHTML.replace(text.innerHTML.charAt(e), Math.E.toFixed(4)); 
                  }
                  animate();
               }

               /*----------------------------------------------------------------------------------------------
                POW KEY --------------------------------------------------------------------------------------
                ---------------------------------------------------------------------------------------------*/
               // ERRORS: when 0^ OR the exponent is NOT inputed
               else if ( (indexOf('0^') > -1) || (indexOf('^') > -1 && getLastChar(-1) === '^') ) set('Err'); 
               else if (indexOf('^') > -1) { // 
                  var first = text.innerHTML.substring(0, indexOf('^')); // return the 1st number inputed 
                  var second = text.innerHTML.substring(indexOf('^') + 1, length()); // return the 2nd number inputed
                  text.innerHTML = ((Math.pow(parseFloat(first, 10), parseFloat(second, 10))).toString(10)); // call Math.pow() on the first number inputed, raising it to the second number
               }  

               /*----------------------------------------------------------------------------------------------
                LOG & LN KEY ----------------------------------------------------------------------------------
                ---------------------------------------------------------------------------------------------*/
               else if (indexOf('ln') > -1) {
                  text.innerHTML = text.innerHTML.substr(3, length()-4); // remove 'ln('
                  console.log(text.innerHTML.substr(3, length()-4));
                  text.innerHTML = Math.log(text.innerHTML);

               } else if (indexOf('log') > -1) { // log(xy the format: log(x)y

                  if(indexOf(')') === -1) set(text.innerHTML, "don\'t forget the ')' in log(x)y");     
                  else {
                     text.innerHTML = text.innerHTML.substr(4, length()); // remove 'log(' 
                     let x = text.innerHTML.substr(0, indexOf(')')); // x 
                     let y = text.innerHTML.substr(indexOf(')') + 1, length()); // y 
                     text.innerHTML = Math.log(y) / Math.log(x);
                  }
               }
               testNumLength();
               break; // end =

            /*----------------------------------------------------------------------------------------------
            DECIMAL KEY -----------------------------------------------------------------------------------
            ---------------------------------------------------------------------------------------------*/
            // 4. there should be only 1 decimal in a number
            case '.':
               if (indexOf('.') === -1) appendBtnVal(); break;

            /*----------------------------------------------------------------------------------------------
            PERCENTAGE KEY --------------------------------------------------------------------------------
            ---------------------------------------------------------------------------------------------*/
            case '%':
               if(text.innerHTML === '') set('', 'Try again');
               
               // when we would get x+% 
               else if(indexOf('%') === -1 && operators.indexOf(getLastChar(-1)) > -1) set('Err');
            
               // when just x% OR -x% and no operators 
               else if (indexOf('+') === -1  && indexOf('×') === -1  && indexOf('÷') === -1 &&
               (indexOf('-') === 0 || indexOf('-') === -1) ) { 
                  toPercent();
                  console.log('% of sth'); 
               
               } else if ( indexOf('×') > -1 && indexOf('÷') === -1 && indexOf('+') === -1 &&
               (indexOf('-') === 0 || indexOf('-') === -1) ) { // OR -x% OR 
                  getPercent();
                  console.log('x*y%'); 
               
               } else text.innerHTML += '%'; 
            testNumLength();
            break; // when x-y%z or x+y%z --> on '=' key

            /*----------------------------------------------------------------------------------------------
            MINUS KEY --------------------------------------------------------------------------------------
            ---------------------------------------------------------------------------------------------*/
            case '-':
               $('#text, #empty').fadeTo(500, 1); // reset animation - show text
               if (text.innerHTML === '') set(btnVal, ''); // the eq can start with '-'
               else if (text.innerHTML === '-') deleteLast(); // if we then click '-' again, delete this '-'

            /*----------------------------------------------------------------------------------------------
            PLUS, DIVIDE, MULTIPLY KEYS -------------------------------------------------------------------
            ---------------------------------------------------------------------------------------------*/
            case '-': case '+': case '÷': case '×':
               $('#text, #empty').fadeTo(500, 1); // reset animation - show text
               eq = text.innerHTML;

               if (eq === "" || eq === ".") set('', 'Try again'); // don't start with those operators 
               
               // Only add operator if text is not empty and there is no operator at the last index
               else if (operators.indexOf(getLastChar(-1)) === -1 && eq !== "" && eq !== "-") appendBtnVal();

               // Replace the last operator (if exists) if it's at least one digit and an operator 
               else if (operators.indexOf(getLastChar(-1)) > -1 && length() > 1) set(eq.replace(/.$/, btnVal),''); 
               
               break;

   /*///////////////////////////////////////////////////////////////////////////////////////////////////////////
   MORE COMPLEX FUNCTIONALITY /////////////////////////////////////////////////////////////////////////////////
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////*/

            /*----------------------------------------------------------------------------------------------
            LOG & LN KEY ----------------------------------------------------------------------------------
            ---------------------------------------------------------------------------------------------*/
            // the rest happens in the eval section
            case 'log':
               set("log(x)y","<p>For the logarithm of y with base x (ie. log<sub>x</sub>y) follow this syntax: log(x)y</p>");
               $("#text").fadeOut(700, function () { // fade this text to another
                  $(this).text("log(").fadeIn();
               });
               break; // end log

            case 'ln': 
               text.innerHTML += "ln("; break; // end ln

            /*---------------------------------------------------------------------------------------------
            SQRT KEY --------------------------------------------------------------------------------------
            ---------------------------------------------------------------------------------------------*/
            case '√': // when the square key is clicked 
               text.innerHTML = Math.sqrt(parseFloat(text.innerHTML, 10)).toString(10); // do the math and convert to string 
               animate();
               break; // end √

            /*---------------------------------------------------------------------------------------------
            POW KEY ---------------------------------------------------------------------------------------
            ---------------------------------------------------------------------------------------------*/
            case '^': // when it is not empty append the operator
               if (text.innerHTML !== "") text.innerHTML += '^'; break; // the rest happens in case '='

            /*---------------------------------------------------------------------------------------------
            NEVER APPEND ---------------------------------------------------------------------------------
            ---------------------------------------------------------------------------------------------*/
            case '±': 
               text.innerHTML += ''; break; // the rest happens later

            /*---------------------------------------------------------------------------------------------
            NUMBER KEYS & LOG PATTERN ---------------------------------------------------------------------
            ---------------------------------------------------------------------------------------------*/
            case '0':
               if(getLastChar(-1) !== '0') appendBtnVal();
               else if (operators.indexOf(getLastChar(-2)) > -1){ // if there is +0
                  text.innerHTML += "";
                  console.log('no +00');
               } else if (text.innerHTML !== '0' || operators.indexOf(getLastChar(-3)) > -1) {
                  appendBtnVal();
                  console.log('100 or +100'); 
               } 
               break;

            case '(':
               if(operators.indexOf(getLastChar(-2) > -1) && text.innerHTML !== '') set('Err'); 
               else appendBtnVal();
               break;
               
            case ')':
               if(length() === 1) set(text.innerHTML, "You need a number");
               else appendBtnVal();
               break;

            default: // if any number key, just append it OR if it's '()'
               if (text.innerHTML === '0') { // when it was evaluated to '0' don't append it to the new number
                  deleteLast();
                  console.log('no 099');
               } else if (getLastChar(-1) === '0' && operators.indexOf(getLastChar(-2)) > -1){
                  deleteLast();
                  console.log('no +099'); 
               } 
               appendBtnVal();
               roundReset();
         } // end switch
      } // end if
   }); // end event delegation

   /*///////////////////////////////////////////////////////////////////////////////////////////////
   LOAD ADVANCED KEYS //////////////////////////////////////////////////////////////////////////////
   ///////////////////////////////////////////////////////////////////////////////////////////////*/
   $("#navmore").click(() => { // $("#navmore").on("click", () => {
      $("#basic-op").load("adv-op.html");
      $('#more').hide();
      $('#navback').show();
      $('#back').show();
   });
   $("#navback").click(() => {
      $("#basic-op").load("basic-op.html");
      $('#navback').hide();
      $('#back').hide();
      $('#more').show();
   });
   /*//////////////////////////////////////////////////////////////////////////////////////////////
   ROUND KEY //////////////////////////////////////////////////////////////////////////////////////
   //////////////////////////////////////////////////////////////////////////////////////////////*/
   var n = 0; // 10e+0 = 10

   $("#round").click(() => { // each time we click '±' btn
      const { round } = Math; // deconstructing
     
      for (let i = 0; i < operators.length; i++) {
         if (indexOf(operators[i]) > -1) text.innerHTML = 'Err'; 
      } if(text.innerHTML === 'Err') set('Err');

      else if(text.innerHTML === '' || text.innerHTML === '0') set('0', 'It cannot be rounded any further');

      else if (indexOf('.') > -1) { // 12.888 -> 12.89
         let decimalPlaces = text.innerHTML.substring(indexOf('.') + 1, length()).length; // 1.123456 -> 123456 // 6
         text.innerHTML = (+text.innerHTML).toFixed(decimalPlaces - 1); // 1.12346 // 1.1235 // 1.124 // 1.12 // 1.1 // 1

      } else { // from the end // for (let i = 0; i < digits; i++){
        
         for (let i = length()-1; i > -1; i--){ // don't click 3 times for 1000 -> n: 0,1,2,3  
            if(text.innerHTML[i] === '0' && getLastChar(-1) === '0' && n < zerosCount()) n++;
         } // n (10e+) cannot exceed 10 --> 2 chars
        
         if(/[1-4]/.test(text.innerHTML[0]) && getLastChar(-1) === '0' && zerosCount() === length()-1) set(text.innerHTML, 'It cannot be rounded any further'); // 40 OR 1.000 -> stop 
         else text.innerHTML = round(text.innerHTML / `10e+${n}`) * `10e+${n}`;
      } // end else
      animate();
   }); // end the round 'click' event
}); // end ready