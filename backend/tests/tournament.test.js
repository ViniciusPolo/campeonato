const sinon = require('sinon');
const assert = require('assert'); 
const Tournaments = require('../database/models/tournament');

describe('Tournaments model test', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('Should create a new tournament', async () => {
    const mockTournaments = { name: 'Copa-Rei' };
    sinon.stub(Tournaments, 'create').resolves(mockTournaments);

    const result = await Tournaments.create(mockTournaments);

    assert.deepStrictEqual(result, mockTournaments);
    assert(Tournaments.create.calledOnce);
  });

  it('Should return an error if tournament is missing', async () => {
    sinon.stub(Tournaments, 'create').throws(new Error('Tournament required'));

    try {
      await Tournaments.create({ name: 'Copa-Rei' });
    } catch (err) {
      assert.strictEqual(err.message, 'Tournament required');
    }
  });
});
