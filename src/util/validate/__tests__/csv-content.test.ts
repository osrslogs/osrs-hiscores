import isValidCsvContent from '../csv-content';

describe('isValidCsvContent', () => {
  it('returns true when given valid csvContent', () => {
    const csvContent = {
      skills: [['1', '2', '3']],
      activities: [['1', '2']],
      remaining: [['']],
    };

    const isValid = isValidCsvContent(csvContent);
    expect(isValid).toBe(true);
  });

  it('returns false if `remaining` is empty', () => {
    const csvContent = {
      skills: [['1', '2', '3']],
      activities: [['1', '2']],
      remaining: [[]],
    };

    const isValid = isValidCsvContent(csvContent);
    expect(isValid).toBe(false);
  });

  it('returns false if there are multiple elements in `remaining`', () => {
    const csvContent = {
      skills: [['1', '2', '3']],
      activities: [['1', '2']],
      remaining: [[], []],
    };

    const isValid = isValidCsvContent(csvContent);
    expect(isValid).toBe(false);
  });

  it('returns false if the element in `remaining` is invalid', () => {
    const csvContent = {
      skills: [['1', '2', '3']],
      activities: [['1', '2']],
      remaining: [['not empty']],
    };

    const isValid = isValidCsvContent(csvContent);
    expect(isValid).toBe(false);
  });

  it('returns false if `skills` is empty', () => {
    const csvContent = {
      skills: [[]],
      activities: [['1', '2']],
      remaining: [['']],
    };

    const isValid = isValidCsvContent(csvContent);
    expect(isValid).toBe(false);
  });

  it('returns false if `skills` have elements of length > 3', () => {
    const csvContent = {
      skills: [
        ['1', '2', '3'],
        ['1', '2', '3', '4'],
      ],
      activities: [['1', '2']],
      remaining: [['']],
    };

    const isValid = isValidCsvContent(csvContent);
    expect(isValid).toBe(false);
  });

  it('returns false if `skills` have elements of length < 3', () => {
    const csvContent = {
      skills: [
        ['1', '2', '3'],
        ['1', '2'],
      ],
      activities: [['1', '2']],
      remaining: [['']],
    };

    const isValid = isValidCsvContent(csvContent);
    expect(isValid).toBe(false);
  });

  it('returns false if `skills` have elements that are not parseable to number', () => {
    const csvContent = {
      skills: [['1', '2', 'not a number']],
      activities: [['1', '2']],
      remaining: [['']],
    };

    const isValid = isValidCsvContent(csvContent);
    expect(isValid).toBe(false);
  });

  it('returns false if `activities` is empty', () => {
    const csvContent = {
      skills: [['1', '2', '3']],
      activities: [[]],
      remaining: [['']],
    };

    const isValid = isValidCsvContent(csvContent);
    expect(isValid).toBe(false);
  });

  it('returns false if `activities` have elements of length > 2', () => {
    const csvContent = {
      skills: [
        ['1', '2', '3'],
        ['1', '2', '3', '4'],
      ],
      activities: [
        ['1', '2'],
        ['1', '2', '3'],
      ],
      remaining: [['']],
    };

    const isValid = isValidCsvContent(csvContent);
    expect(isValid).toBe(false);
  });

  it('returns false if `activities` have elements of length < 3', () => {
    const csvContent = {
      skills: [
        ['1', '2', '3'],
        ['1', '2'],
      ],
      activities: [['1', '2'], ['1']],
      remaining: [['']],
    };

    const isValid = isValidCsvContent(csvContent);
    expect(isValid).toBe(false);
  });

  it('returns false if `activities` have elements that are not parseable to number', () => {
    const csvContent = {
      skills: [['1', '2', '3']],
      activities: [['1', 'not a number']],
      remaining: [['']],
    };

    const isValid = isValidCsvContent(csvContent);
    expect(isValid).toBe(false);
  });
});
