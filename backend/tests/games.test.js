const sinon = require('sinon');
const assert = require('assert'); 
const Games = require('../database/models/games');

describe('Games model test', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('Should create a new game', async () => {
    const mockTournaments = { 
        local_team: "9",
        visitor_team: "7",
        local_goals: 1,
        visitor_goals: 2,
        penalities: false,
        local_penalty_goals: 0,
        visitor_penalty_goals: 0,
        winner: "7",
        eliminated: "9",
        local_points: -1,
        visitor_points: 1,
        tournament: "1",
        round_of: "quarter",
    };
    sinon.stub(Games, 'create').resolves(mockTournaments);

    const result = await Games.create(mockTournaments);

    assert.deepStrictEqual(result, mockTournaments);
    assert(Games.create.calledOnce);
  });

  it('Should return an error if round_of is missing', async () => {
    sinon.stub(Games, 'create').throws(new Error('Round_of is required'));

    try {
      await Games.create({ 
        local_team: "9",
        visitor_team: "7",
        local_goals: 1,
        visitor_goals: 2,
        penalities: false,
        local_penalty_goals: 0,
        visitor_penalty_goals: 0,
        winner: "7",
        eliminated: "9",
        local_points: -1,
        visitor_points: 1,
        tournament: "1",
      });
    } catch (err) {
      assert.strictEqual(err.message, 'Round_of is required');
    }
  });

  it('Should return an error if tournament is missing', async () => {
    sinon.stub(Games, 'create').throws(new Error('Tournament_id is required'));

    try {
      await Games.create({ 
        local_team: "9",
        visitor_team: "7",
        local_goals: 1,
        visitor_goals: 2,
        penalities: false,
        local_penalty_goals: 0,
        visitor_penalty_goals: 0,
        winner: "7",
        eliminated: "9",
        local_points: -1,
        visitor_points: 1,
        round_of: "quarter",
      });
    } catch (err) {
      assert.strictEqual(err.message, 'Tournament_id is required');
    }
  });
});
