'use strict';

const { spawnSync } = require('node:child_process');
const path = require('node:path');
const { calculate, modulo, power, squareRoot } = require('../calculator');

const calculatorPath = path.join(__dirname, '..', 'calculator.js');

describe('modulo', () => {
  test('returns the example remainder from the image', () => {
    expect(modulo(5, 2)).toBe(1);
  });

  test('returns the remainder of the first operand divided by the second', () => {
    expect(modulo(10, 3)).toBe(1);
    expect(modulo(-10, 3)).toBe(-1);
  });

  test('rejects division by zero and non-finite operands', () => {
    expect(() => modulo(1, 0)).toThrow('Cannot modulo by zero.');
    expect(() => modulo(Infinity, 2)).toThrow(
      'Operands must be valid finite numbers.'
    );
  });
});

describe('power', () => {
  test('returns the example power from the image', () => {
    expect(power(2, 3)).toBe(8);
  });

  test('raises the base to the given exponent', () => {
    expect(power(2, 3)).toBe(8);
    expect(power(9, 0.5)).toBe(3);
  });

  test('rejects non-finite operands and results', () => {
    expect(() => power(Infinity, 2)).toThrow(
      'Operands must be valid finite numbers.'
    );
    expect(() => power(10, 1000)).toThrow(
      'The result must be a valid finite number.'
    );
  });
});

describe('squareRoot', () => {
  test('returns the example square root from the image', () => {
    expect(squareRoot(16)).toBe(4);
  });

  test('returns the square root of a non-negative number', () => {
    expect(squareRoot(25)).toBe(5);
    expect(squareRoot(0)).toBe(0);
  });

  test('rejects negative and non-finite inputs', () => {
    expect(() => squareRoot(-1)).toThrow(
      'Cannot take the square root of a negative number.'
    );
    expect(() => squareRoot(Infinity)).toThrow(
      'Operands must be valid finite numbers.'
    );
  });
});

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

  describe('modulo', () => {
    test('returns the remainder for positive, negative, and decimal operands', () => {
      expect(calculate(10, '%', 3)).toBe(1);
      expect(calculate(-10, '%', 3)).toBe(-1);
      expect(calculate(5.5, '%', 2)).toBe(1.5);
    });

    test('rejects a zero divisor', () => {
      expect(() => calculate(1, '%', 0)).toThrow('Cannot modulo by zero.');
      expect(() => calculate(1, '%', -0)).toThrow('Cannot modulo by zero.');
    });
  });

  describe('exponentiation', () => {
    test('raises positive and negative bases to integer and fractional powers', () => {
      expect(calculate(2, '**', 3)).toBe(8);
      expect(calculate(-2, '**', 3)).toBe(-8);
      expect(calculate(9, '**', 0.5)).toBe(3);
      expect(calculate(2, '**', 0)).toBe(1);
    });

    test('rejects operations that produce non-finite results', () => {
      expect(() => calculate(10, '**', 1000)).toThrow(
        'The result must be a valid finite number.'
      );
      expect(() => calculate(-1, '**', 0.5)).toThrow(
        'The result must be a valid finite number.'
      );
    });
  });

  describe('square root', () => {
    test('takes the square root of zero, positive, and decimal values', () => {
      expect(calculate(0, 'sqrt')).toBe(0);
      expect(calculate(25, 'sqrt')).toBe(5);
      expect(calculate(0.25, 'sqrt')).toBe(0.5);
    });

    test('rejects negative values', () => {
      expect(() => calculate(-1, 'sqrt')).toThrow(
        'Cannot take the square root of a negative number.'
      );
    });

    test.each([NaN, Infinity, -Infinity])(
      'rejects non-finite values (%s)',
      (value) => {
        expect(() => calculate(value, 'sqrt')).toThrow(
          'Operands must be valid finite numbers.'
        );
      }
    );
  });

  test.each([NaN, Infinity, -Infinity])(
    'rejects non-finite left operands (%s)',
    (value) => {
      expect(() => calculate(value, '+', 1)).toThrow(
        'Operands must be valid finite numbers.'
      );
    }
  );

  test.each([NaN, Infinity, -Infinity])(
    'rejects non-finite right operands (%s)',
    (value) => {
      expect(() => calculate(1, '+', value)).toThrow(
        'Operands must be valid finite numbers.'
      );
    }
  );

  test.each(['%', '**'])(
    'rejects non-finite operands for %s',
    (operator) => {
      expect(() => calculate(Infinity, operator, 2)).toThrow(
        'Operands must be valid finite numbers.'
      );
      expect(() => calculate(2, operator, NaN)).toThrow(
        'Operands must be valid finite numbers.'
      );
    }
  );

  test('rejects arithmetic that produces a non-finite result', () => {
    expect(() => calculate(Number.MAX_VALUE, '*', 2)).toThrow(
      'The result must be a valid finite number.'
    );
  });

  test('rejects unsupported operations', () => {
    expect(() => calculate(2, 'unknown', 2)).toThrow(
      'Choose one of the supported operations'
    );
    expect(() => calculate(2, 'toString', 2)).toThrow(
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
    ['5', '%', '2', 1],
    ['10', '%', '3', 1],
    ['2', '**', '3', 8],
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

  test('takes one operand for the square root example from the image', () => {
    const cli = spawnSync(
      process.execPath,
      [calculatorPath],
      { input: '16\nsqrt\n', encoding: 'utf8' }
    );

    expect(cli.status).toBe(0);
    expect(cli.stdout).toContain('Result: 4');
    expect(cli.stdout).not.toContain('Second number:');
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

  test('reports modulo by zero and exits unsuccessfully', () => {
    const cli = spawnSync(
      process.execPath,
      [calculatorPath],
      { input: '20\n%\n0\n', encoding: 'utf8' }
    );

    expect(cli.status).toBe(1);
    expect(cli.stderr).toContain('Cannot modulo by zero.');
  });

  test('reports a negative square root and exits unsuccessfully', () => {
    const cli = spawnSync(
      process.execPath,
      [calculatorPath],
      { input: '-1\nsqrt\n', encoding: 'utf8' }
    );

    expect(cli.status).toBe(1);
    expect(cli.stderr).toContain('Cannot take the square root of a negative number.');
  });

  test('rejects invalid operands', () => {
    const cli = spawnSync(
      process.execPath,
      [calculatorPath],
      { input: 'not-a-number\n', encoding: 'utf8' }
    );

    expect(cli.status).toBe(1);
    expect(cli.stderr).toContain('Operands must be valid finite numbers.');
  });
});
