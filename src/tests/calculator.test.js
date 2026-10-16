'use strict';

const { spawnSync } = require('node:child_process');
const path = require('node:path');
const { calculate } = require('../calculator');

const calculatorPath = path.join(__dirname, '..', 'calculator.js');

describe('calculate', () => {
  describe('addition', () => {
    test('adds the example operands from the image', () => {
      expect(calculate(2, '+', 3)).toBe(5);
    });

    test('supports negative, zero, and decimal operands', () => {
      expect(calculate(-2, '+', 3)).toBe(1);
      expect(calculate(0, '+', 0)).toBe(0);
      expect(calculate(0.5, '+', 0.25)).toBe(0.75);
    });
  });

  describe('subtraction', () => {
    test('subtracts the example operands from the image', () => {
      expect(calculate(10, '-', 4)).toBe(6);
    });

    test('supports negative, zero, and decimal operands', () => {
      expect(calculate(-2, '-', 3)).toBe(-5);
      expect(calculate(0, '-', 0)).toBe(0);
      expect(calculate(1.5, '-', 0.25)).toBe(1.25);
    });
  });

  describe('multiplication', () => {
    test('multiplies the example operands from the image', () => {
      expect(calculate(45, '*', 2)).toBe(90);
    });

    test('accepts the multiplication symbol and handles zero and negatives', () => {
      expect(calculate(3, '×', 4)).toBe(12);
      expect(calculate(-3, '*', 4)).toBe(-12);
      expect(calculate(123, '*', 0)).toBe(0);
    });
  });

  describe('division', () => {
    test('divides the example operands from the image', () => {
      expect(calculate(20, '/', 5)).toBe(4);
    });

    test('accepts the division symbol and handles negative and decimal results', () => {
      expect(calculate(20, '÷', 5)).toBe(4);
      expect(calculate(-9, '/', 2)).toBe(-4.5);
      expect(calculate(1, '/', 4)).toBe(0.25);
    });

    test('rejects division by positive or negative zero', () => {
      expect(() => calculate(1, '/', 0)).toThrow('Cannot divide by zero.');
      expect(() => calculate(1, '÷', -0)).toThrow('Cannot divide by zero.');
    });
  });

  test.each([NaN, Infinity, -Infinity])(
    'rejects non-finite left operands (%s)',
    (value) => {
      expect(() => calculate(value, '+', 1)).toThrow(
        'Both operands must be valid finite numbers.'
      );
    }
  );

  test.each([NaN, Infinity, -Infinity])(
    'rejects non-finite right operands (%s)',
    (value) => {
      expect(() => calculate(1, '+', value)).toThrow(
        'Both operands must be valid finite numbers.'
      );
    }
  );

  test('rejects unsupported operations', () => {
    expect(() => calculate(2, '%', 2)).toThrow(
      'Choose one of the supported operations'
    );
    expect(() => calculate(2, '**', 2)).toThrow(
      'Choose one of the supported operations'
    );
  });
});

describe('CLI', () => {
  test.each([
    ['2', '+', '3', 5],
    ['10', '-', '4', 6],
    ['45', '*', '2', 90],
    ['20', '/', '5', 4],
  ])('prints the result for %s %s %s', (left, operator, right, result) => {
    const cli = spawnSync(
      process.execPath,
      [calculatorPath],
      { input: `${left}\n${operator}\n${right}\n`, encoding: 'utf8' }
    );

    expect(cli.status).toBe(0);
    expect(cli.stdout).toContain(`Result: ${result}`);
    expect(cli.stderr).toBe('');
  });

  test('reports division by zero and exits unsuccessfully', () => {
    const cli = spawnSync(
      process.execPath,
      [calculatorPath],
      { input: '20\n/\n0\n', encoding: 'utf8' }
    );

    expect(cli.status).toBe(1);
    expect(cli.stderr).toContain('Cannot divide by zero.');
  });

  test('rejects invalid operands', () => {
    const cli = spawnSync(
      process.execPath,
      [calculatorPath],
      { input: 'not-a-number\n', encoding: 'utf8' }
    );

    expect(cli.status).toBe(1);
    expect(cli.stderr).toContain('Both operands must be valid finite numbers.');
  });
});
