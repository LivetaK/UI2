const display = document.querySelector(".display input");

function appendToDisplay(input) {
    if (input === 'X') {
        display.value += '*';
    } else if (input === '÷') {
        display.value += '/';
    } else {
        display.value += input;
    }
}

function appendPowerSymbol() {
    if (display.value !== '') {
        display.value = `(${display.value})^`;
    }
}


function calculate() {
    const expression = display.value;
    if (expression === '') {
        return;
    }
    try {
        const result = evaluateExpression(expression);
        if (result === Infinity || result === -Infinity || isNaN(result)) {
            display.value = "Error";
        } else {
            display.value = result;
        }
    } catch (error) {
        display.value = "Error";
    }
}


function clearDisplay() {
    display.value = "";
}

function kelimasKvadratu() {
    const expression = display.value;
    if (expression === '') {
        return;
    }
    try {
        const result = evaluateExpression(expression);
        display.value = roundValue(result * result);
    } catch (error) {
        display.value = "Error";
    }
}

function saknis() {
    const expression = display.value;
    if (expression === '') {
        return;
    }
    try {
        const result = evaluateExpression(expression);
        if (result < 0) {
            display.value = "Invalid Input";
        } else {
            display.value = roundValue(Math.sqrt(result));
        }
    } catch (error) {
        display.value = "Error";
    }
}

function modulis() {
    const expression = display.value;
    if (expression === '') {
        return;
    }

    try {
        const result = evaluateExpression(expression);
        display.value = roundValue(Math.abs(result));
    } catch (error) {
        display.value = "Error";
    }
}

function factorial() {
    const expression = display.value;

    if (expression === '') {
        return;
    }

    try {
        const result = evaluateExpression(expression);

        if (result < 0 || !Number.isInteger(result)) {
            display.value = "Invalid Input";
        } else {
            display.value = calculateFactorial(result);
        }
    } catch (error) {
        display.value = "Error";
    }
}

function calculateFactorial(num) {
    if (num === 0 || num === 1) {
        return 1;
    }
    let factorial = 1;
    for (let i = 2; i <= num; i++) {
        factorial *= i;
    }
    return factorial;
}

function evaluateExpression(expression) {
    if (expression.includes('^')) {
        const [baseExpression, exponentPart] = expression.split('^');
        const baseValue = evaluateSimpleExpression(baseExpression);
        const exponentValue = parseFloat(exponentPart);

        if (isNaN(baseValue) || isNaN(exponentValue)) {
            throw new Error("Invalid Expression");
        }

        return roundValue(Math.pow(baseValue, exponentValue));
    }
    return evaluateSimpleExpression(expression);
}

function skirstymas(expression) {
    const numbers = [];
    const operators = [];
    let currentNumber = '';

    for (let i = 0; i < expression.length; i++) {
        const char = expression[i];

        if ('0123456789.'.includes(char)) {
            currentNumber += char;
        } else if (char === '-' && (i === 0 || '+-*/'.includes(expression[i - 1]))) {
            currentNumber += char;
        } else if ('+-*/'.includes(char)) {
            if (currentNumber === '' || currentNumber === '-') {
                throw new Error("Invalid Expression");
            }
            numbers.push(parseFloat(currentNumber));
            operators.push(char);
            currentNumber = '';
        }
    }

    if (currentNumber !== '') {
        numbers.push(parseFloat(currentNumber));
    }
    return { numbers, operators };
}

function multDiv(numbers, operators) {
    let i = 0;
    while (i < operators.length) {
        if (operators[i] === '*' || operators[i] === '/') {
            const num1 = numbers[i];
            const num2 = numbers[i + 1];
            const result = operators[i] === '*' ? num1 * num2 : num1 / num2;

            numbers.splice(i, 2, roundValue(result));
            operators.splice(i, 1);
        } else {
            i++;
        }
    }
}

function plusMinus(numbers, operators) {
    let i = 0;
    while (i < operators.length) {
        const num1 = numbers[i];
        const num2 = numbers[i + 1];
        const result = operators[i] === '+' ? num1 + num2 : num1 - num2;

        numbers.splice(i, 2, result);
        operators.splice(i, 1);
    }
}

function evaluateSimpleExpression(expression) {
    const { numbers, operators } = skirstymas(expression);

    multDiv(numbers, operators);
    plusMinus(numbers, operators);

    return numbers[0];
}

function roundValue(value, precision = 10) {
    const factor = Math.pow(10, precision);
    return Math.round(value * factor) / factor;
}
