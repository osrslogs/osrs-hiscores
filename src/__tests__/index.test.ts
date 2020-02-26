import Hiscores from '..';

describe('Module entrypoint', () => {
  it('Imports the Hiscores class', () => {
    const hiscores = new Hiscores();
    expect(hiscores).toBeTruthy();
  });
});
