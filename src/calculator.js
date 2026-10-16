#!/usr/bin/env node
'use strict';

const readline = require('node:readline');

// Supported operations: addition (+), subtraction (-), multiplication (* or ×), and division (/ or ÷).
const operations = {
  '+': (left, right) => left + right,
  '-': (left, right) => left - right,
  '*': (left, right) => left * right,
  '×': (left, right) => left * right,
  '/': (left, right) => left / right,
  '÷': (left, right) => left / right,
};

function calculate(left, operator, right) {
  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    throw new Error('Both operands must be valid finite numbers.');
  }

  const operation = operations[operator];
  if (!operation) {
    throw new Error('Choose one of the supported operations: +, -, *, or /.');
  }

  if ((operator === '/' || operator === '÷') && right === 0) {
    throw new Error('Cannot divide by zero.');
  }

  return operation(left, right);
}

function parseOperand(input) {
  const trimmed = input.trim();
  const value = Number(trimmed);
  if (!trimmed || !Number.isFinite(value)) {
    throw new Error('Both operands must be valid finite numbers.');
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
        ask('Operation (+, -, *, /): ');
      } else if (step === 1) {
        operator = input.trim();
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
