const sinon = require('sinon');
const assert = require('assert'); // Usando assert do Node.js
const Teams = require('../database/models/teams');

describe('Teams model test', () => {
  afterEach(() => {
    sinon.restore(); // Restaura os mocks após cada teste
  });

  it('Should create a new team', async () => {
    const mockTeams = { name: 'Francana' };
    sinon.stub(Teams, 'create').resolves(mockTeams);

    const result = await Teams.create(mockTeams);

    assert.deepStrictEqual(result, mockTeams);
    assert(Teams.create.calledOnce);
  });

  it('Should return an error if team is missing', async () => {
    sinon.stub(Teams, 'create').throws(new Error('Team required'));

    try {
      await Teams.create({ name: 'Francana' });
    } catch (err) {
      assert.strictEqual(err.message, 'Team required');
    }
  });
});
