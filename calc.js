// Mark Oosting (355903), CMV1G
// 355903.cmd16a.cmi.hanze.nl/calculator
// Only works on ES6 / ECMAscript 6 compatible browsers.

'use strict';

class Calculator {

    // The Calculator class contains values and methods which will be called using event listeners (see below)
    
    constructor(){

        // The constructor function is called when instantiating the class.
        
        // Set DOM objects
        this.displayOperation;      // Display for the current operation
        this.displayAns;            // Display for the answer
        this.displayMem;            // Display for the memory
        
        // Variables
        this.enteredValue = '';     // String value entered in the display
        this.operation = '+';       // The operation used in the calculation
        this.operationValue = 0;    // Stores the value to do the next operation with
        this.memory = 0;            // Stores the memory value
        this.ans = 0;               // Stores the current answer
        
        this.init();
    }

    init() {

        // Select elements from the DOM and assign them to variables.
        
        this.displayOperation = document.getElementById('fulloperation');
        this.displayAns = document.getElementById('currentValue');
        this.displayMem = document.getElementById('memory');

        // Return the status of the selected DOM objects. If they're all found, this will return 'true'.
        
        return (this.displayOperation && this.displayAns && this.displayMem);
    }

    calculate(){

        // The main calculation function. 

        this.setFullOperation(this.ans, this.operation, this.operationValue); // See this.setFullOperation()
        
        // Switch to do a math operation based on this.operationValue.
        // I use shorthand notation (ie. +=) to save a few characters.

        switch(this.operation) {
            case '+':
                this.ans += this.operationValue;
                break;
            case '-':
                this.ans -= this.operationValue;
                break;
            case '*':
                this.ans *= this.operationValue;
                break;
            case '÷':
                if(this.operationValue == 0) {
                    
                    // If this.operationValue is zero while doing division, alert the user.
                    alert('Division by 0 is impossible.');
                    this.clear();

                } else {
                    this.ans /= this.operationValue;
                }
                break;
            default:
                // By default (no operation set), clear the calculator.
                this.clear();
        }

        // Set this.enteredValue to the answer, converted to string.
        // Also set the display to this.enteredValue so we can append() to it later. 

        this.enteredValue = this.ans.toString();
        this.setDisplay(this.enteredValue);
    }

    calculateScientific(operation) {

        // Advanced calculations, like square root or powers.
        // This method is similar to this.calculate(), but does operations instantly.

        this.setFullOperation();

        // If the operation value equals zero, the user hasn't calculated anything yet.
        // In that case, we have to set it directly based on this.enteredValue.
        if(this.operationValue !== 0) {
            this.operationValue = parseFloat(this.enteredValue);
        }

        // Switch to do a math operation based on the operation.

        switch(operation) {
            case 'pow2':
                this.ans = Math.pow(this.operationValue, 2);
                break;
            case 'pow3':
                this.ans = Math.pow(this.operationValue, 3);
                break;
            case 'inv':
                this.ans = Math.pow(this.operationValue, -1);
                break;
            case 'sqrt':
                this.ans = Math.sqrt(this.operationValue);
                break;
            default:
                // By default (no operation set), clear the calculator.
                this.clear();
        }

        // Set this.enteredValue to the answer, converted to string.
        // Then set the display to the enteredValue so we can append() to it later. 

        this.enteredValue = this.ans.toString();
        this.setDisplay(this.enteredValue);
    }
    
    setOperation(operation){

        // Set the operation (stored in a button value)
        // Also clear this.enteredValue, so we get a 'blank slate' for the next input session.

        this.operation = operation;
        this.enteredValue = '';

        // Ternary operator (shorthand if-statement):
        // If this.ans is zero, the user has not started a calculation yet.
        // In this case, we should set the answer to operationValue (initial calculation).
        // After this.ans is set (!== 0), 'continue' the calculation by setting operationValue to the answer.
        (this.ans == 0) ? this.ans = this.operationValue : this.operationValue = this.ans;
        
        this.setFullOperation(this.ans, this.operation);
    }
    
    handleMemory(operation){

        // Get the current memory value
        var memoryvalue = this.memory;

        // If the currently entered value is set (not empty), set the memory to the entered value.
        if(this.enteredValue !== ''){
            // Use parseFloat() to convert the string to a basic javascript 'number', which is a float by default.
            memoryvalue = parseFloat(this.enteredValue);
        } else {
            // If there is not entered value, set the memory to the current answer.
            memoryvalue = this.ans;
        }
        
        // Switch over the various memory operations. Similar to this.calculate().

        switch(operation){
            case 'MR':
                // Set the operation value to the current memory and set the display to that value.
                this.operationValue = this.memory;
                this.setDisplay(this.operationValue.toString()); 
                break;
            case 'MC':
                this.memory = 0;
                break;
            case 'M+':
                this.memory += memoryvalue;
                break;
            case 'M-':
                this.memory -= memoryvalue;
                break;
        }

        this.displayMem.innerHTML = this.memory; // Display the memory value on the screen.

    }

    appendNumber(number){
        
        // This method modifies this.enteredValue by appending (adding) stringified numbers to it.

        // If the entered value is empty or 0, simply set this.enteredValue to that value.
        // Else, append the number to the this.enteredValue by using + (works on strings in JS). 
        if(this.enteredValue == '' || this.enteredValue == '0'){
            this.enteredValue = number;
        } else {
            this.enteredValue += number;
        }

        this.operationValue = parseFloat(this.enteredValue); // Set the operation value to the 'numberfied' entered value
        this.setDisplay(this.enteredValue); // Update the display with the new value.
    }
    
    addDecimal(){

        // Adds a decimal point to the entered value.

        // If the operation value is 0, simply set this.enteredValue to zero with a decimal point.
        if(this.operationValue == 0){
            this.enteredValue = '0.';
        }

        // If the entered value doesn't contain a decimal point (indexOf() returns -1), append it. (otherwise, don't add anything.)
        if(this.enteredValue.indexOf('.') == -1){
            this.enteredValue += '.';
        }
        
        this.setDisplay(this.enteredValue); // Update the display with the new value.
    }
    
    flipSign(){

        // If the entered value is not empty, we can flip the sign to plus or minus.

        if(this.enteredValue !== '') {

            // Convert the entered value to a number and multiply it my -1.
            // Then assign it back to this.enteredValue using the toString() function.
            this.enteredValue = (parseFloat(this.enteredValue) * -1).toString();

            // Assign the value to this.operationValue so we can use it in future calculations.
            this.operationValue = parseFloat(this.enteredValue);

            this.setDisplay(this.enteredValue);
        }
        
    }
    
    setDisplay(value){

        // Set the display to a given value, using innerHTML on a given DOM object.

        // First check if the value fits on the screen by casting it to a string and checking its length.
        if(value.toString().length >= 12) {

            // if the value is larger than 12 characters, use toPrecision() to limit it's significant digits to 6.
            this.displayAns.innerHTML = parseFloat(value).toPrecision(6);
        
        } else {

            // Otherwise, simply set the value directly.
            this.displayAns.innerHTML = value;

        }

        // Log the current state of the calculator to the console for debugging purposes.
        console.log(this);
    };
    
    setFullOperation(ans = '', operation = '', val = ''){

        // Shows the complete operation on the screen (x + y = ...). 
        // Default values are empty strings, so we can reset the display by not giving any parameters.

        // Javascript currently supports string interpolation by using back ticks and ${expr} notation;
        // It makes it easier to interpret the output than using the old notation: var string = 'x' + ' ' + 'y' + ' ' + 'z';

        var interpolatedString = `${ans} ${operation} ${val}`;

        // If all values are set, append an equals sign for readability.
        if(ans && operation && val){
            interpolatedString += ' =';
        }

        // Set the value of the operation display to the created string.
        this.displayOperation.innerHTML = interpolatedString;
    }
    
    clear() {

        // Clear the calculator by setting all values to the defaults set in the constructor.

        this.enteredValue = '';
        this.operationValue = 0;
        this.operation = '+';
        this.ans = 0;
        
        this.setDisplay(0);
        this.setFullOperation();
        
        // Also clear the console and output the current state of the calculator.
        console.clear();
        console.log(this);
    };
    
}



window.onload = function() {

    // When the DOM is done loading, instantiate the calculator class as 'calc'.
    // We have to use window.onload because not all DOM objects are loaded at the moment we start running this script.
    var calc = new Calculator();

    // Initialize the calculator (returns true on success).
    if(calc.init()) {

        // If the calculator is successfully initialized, we can start assigning elements to 'talk' to it.

        // Get all buttons by using a query selector which finds all DOM objects with the class '.number'.
        var numbers = document.querySelectorAll('.number');
        for (var i = 0; i < numbers.length; i++) {
            // Loop over all numbers (length of the array), and add an 'click' event listener to them.
            // The event listener calls calc.appendNumber() and sets the innerHTML value as an argument.
            numbers[i].addEventListener('click', function() {
                calc.appendNumber(this.innerHTML);
            });
        }

        // Similar to the pervious code, this selects all memory buttons and sets calc.handleMemory() method to them.
        var memorybtns = document.querySelectorAll('.memory');
        for (var i = 0; i < memorybtns.length; i++) {
            memorybtns[i].addEventListener('click', function() {
                calc.handleMemory(this.value);
            });
        }

        // Again, here we select all option buttons and call calc.setOperation with them based on their values.
        var options = document.querySelectorAll('.option');
        for (var i = 0; i < options.length; i++) {
            options[i].addEventListener('click', function() {
                calc.setOperation(this.value);
            });
        }

        // And here we select all scientific options and add eventlisteners to them.
        var optionsScientific = document.querySelectorAll('.option-sci');
        for (var i = 0; i < optionsScientific.length; i++) {
            optionsScientific[i].addEventListener('click', function() {
                calc.calculateScientific(this.value);
            });
        }

        // The following event listeners call functions when the corresponding buttons are clicked.

        document.getElementById('equals').addEventListener('click', function() {
            calc.calculate();
        });

        document.getElementById('clear').addEventListener('click', function() {
            calc.clear();
        });

        document.getElementById('decimal').addEventListener('click', function() {
            calc.addDecimal();
        });

        document.getElementById('sign').addEventListener('click', function() {
            calc.flipSign();
        });

    } else {
        // The calculator could not be initialised, so we alert the user.
        alert('Sorry, the calculator could not be loaded.');
    }
    
}
