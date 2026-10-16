#!/usr/bin/env node
'use strict';

const readline = require('node:readline');

// Supported operations: addition (+), subtraction (-), multiplication (* or ×),
// division (/ or ÷), modulo (%), exponentiation (**), and square root (sqrt).
const operations = {
  '+': (left, right) => left + right,
  '-': (left, right) => left - right,
  '*': (left, right) => left * right,
  '×': (left, right) => left * right,
  '/': (left, right) => left / right,
  '÷': (left, right) => left / right,
  '%': (left, right) => left % right,
  '**': (left, right) => left ** right,
};
const supportedOperations = [...Object.keys(operations), 'sqrt'];

function calculate(left, operator, right) {
  if (!supportedOperations.includes(operator)) {
    throw new Error(`Choose one of the supported operations: ${supportedOperations.join(', ')}.`);
  }

  if (!Number.isFinite(left)) {
    throw new Error('Operands must be valid finite numbers.');
  }

  if (operator === 'sqrt') {
    if (left < 0) {
      throw new Error('Cannot take the square root of a negative number.');
    }
    return Math.sqrt(left);
  }

  if (!Number.isFinite(right)) {
    throw new Error('Operands must be valid finite numbers.');
  }

  if ((operator === '/' || operator === '÷') && right === 0) {
    throw new Error('Cannot divide by zero.');
  }
  if (operator === '%' && right === 0) {
    throw new Error('Cannot modulo by zero.');
  }

  const result = operations[operator](left, right);
  if (!Number.isFinite(result)) {
    throw new Error('The result must be a valid finite number.');
  }
  return result;
}

function parseOperand(input) {
  const trimmed = input.trim();
  const value = Number(trimmed);
  if (!trimmed || !Number.isFinite(value)) {
    throw new Error('Operands must be valid finite numbers.');
  }
  return value;
}

function main() {
  const prompt = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  let step = 0;
  let left;
  let operator;
  let completed = false;

  function ask(question) {
    process.stdout.write(question);
  }

  ask('First number: ');

  prompt.on('line', (input) => {
    try {
      if (step === 0) {
        left = parseOperand(input);
        step = 1;
        ask('Operation (+, -, *, /, %, **, sqrt): ');
      } else if (step === 1) {
        operator = input.trim();
        if (operator === 'sqrt') {
          console.log(`Result: ${calculate(left, operator)}`);
          completed = true;
          prompt.close();
          return;
        }
        if (!supportedOperations.includes(operator)) {
          throw new Error(`Choose one of the supported operations: ${supportedOperations.join(', ')}.`);
        }
        step = 2;
        ask('Second number: ');
      } else {
        const right = parseOperand(input);
        console.log(`Result: ${calculate(left, operator, right)}`);
        completed = true;
        prompt.close();
      }
    } catch (error) {
      console.error(`\nError: ${error.message}`);
      process.exitCode = 1;
      completed = true;
      prompt.close();
    }
  });

  prompt.on('close', () => {
    if (!completed) {
      console.error('\nError: Input ended before the calculation was complete.');
      process.exitCode = 1;
    }
  });
}

if (require.main === module) {
  main();
}

module.exports = { calculate };
