import isValidPlayerName from '../player-name';

describe('isValidPlayerName', () => {
  it('returns false when name length less than 1', () => {
    const valid = isValidPlayerName('');
    expect(valid).toBe(false);
  });

  it('returns false when name length is greater than 12', () => {
    const valid = isValidPlayerName('qwertyuiopasdfghjklzxc');
    expect(valid).toBe(false);
  });

  it('returns false when name contains invalid characters', () => {
    const valid = isValidPlayerName('sdf$sxcv/');
    expect(valid).toBe(false);
  });

  it('returns true when name length is equal to 1', () => {
    const valid = isValidPlayerName('a');
    expect(valid).toBe(true);
  });

  it('returns true when name length is equal to 12', () => {
    const valid = isValidPlayerName('asdfghjkzxcv');
    expect(valid).toBe(true);
  });

  it('returns true when name contains underscore', () => {
    const valid = isValidPlayerName('some_name');
    expect(valid).toBe(true);
  });

  it('returns true when name contains space', () => {
    const valid = isValidPlayerName('name space');
    expect(valid).toBe(true);
  });
});
