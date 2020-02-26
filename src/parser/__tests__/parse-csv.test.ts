import parseCsv from '../parse-csv';
import { InvalidCsvError } from '../../util/error';
import csvConfig from '../../util/test-util/csv-mock.json';

describe('', () => {
  it('returns stats when given valid data', () => {
    const result = parseCsv(csvConfig.valid);
    expect(result).toMatchSnapshot();
  });

  it('throws CsvError when given data with NaN values', () => {
    expect(() => parseCsv(csvConfig.invalidNaN)).toThrow(InvalidCsvError);
  });

  it('throws CsvError when given data with missing skill', () => {
    expect(() => parseCsv(csvConfig.invalidMissingSkill)).toThrow(InvalidCsvError);
  });

  it('throws CsvError when given data with missing activity', () => {
    expect(() => parseCsv(csvConfig.invalidMissingActivity)).toThrow(InvalidCsvError);
  });

  it('throws CsvError when given data with missing newline EO', () => {
    expect(() => parseCsv(csvConfig.invalidMissingNewlineEOF)).toThrow(InvalidCsvError);
  });

  it('throws CsvError when given data with empty element in skill', () => {
    expect(() => parseCsv(csvConfig.invalidEmptyEntry)).toThrow(InvalidCsvError);
  });

  it('errors include raw csv data', () => {
    const expected = csvConfig.invalidEmptyEntry;
    try {
      parseCsv(expected);
    } catch (err) {
      expect(err.data).toBe(expected);
    }
  });
});
