const { Op } = require("sequelize");
const { spawn } = require("child_process"); // Módulo para executar o script Python

const Games = require("../database/models/games");
const Teams = require("../database/models/teams");
const Tournament = require("../database/models/tournament");

async function randomGoals() {
	return new Promise((resolve, reject) => {
		const pythonProcess = spawn("python3", ["./scripts/random_goals.py"]); // Path to your Python script

		let result = "";

		// Capture the output from the Python script
		pythonProcess.stdout.on("data", (data) => {
			result += data.toString(); // Accumulate the result
		});

		// Handle errors
		pythonProcess.stderr.on("data", (data) => {
			console.error("Error:", data.toString());
		});

		// When the process finishes, parse the output and resolve the promise
		pythonProcess.on("close", (code) => {
			if (code === 0) {
				try {
					const output = JSON.parse(result); // Parse the output from Python
					resolve(output.random_number); // Resolve with the random number
				} catch (err) {
					console.error("Error parsing Python script output:", err);
					reject(err);
				}
			} else {
				console.error("Python script failed with code:", code);
				reject(new Error("Python script failed"));
			}
		});
	});
}

async function randomSemi(data) {
	return new Promise((resolve, reject) => {
		// Start the Python process and provide input via stdin
		const pythonProcess = spawn("python3", ["./scripts/script_semi.py"]); // Path to your Python script

		let result = "";

		// Send the input data to the Python script through stdin
		pythonProcess.stdin.write(JSON.stringify(data)); // Passing the data to Python
		pythonProcess.stdin.end(); // Close stdin stream

		// Capture the output from the Python script
		pythonProcess.stdout.on("data", (data) => {
			result += data.toString(); // Accumulate the result
		});

		// Handle errors
		pythonProcess.stderr.on("data", (data) => {
			console.error("Error:", data.toString());
		});

		// When the process finishes, parse the output and resolve the promise
		pythonProcess.on("close", (code) => {
			if (code === 0) {
				try {
					const output = result; // Parse the output from Python
					resolve(output); // Resolving with the parsed result
				} catch (err) {
					console.error("Error parsing Python script output:", err);
					reject(new Error("Error parsing Python output"));
				}
			} else {
				console.error("Python script failed with code:", code);
				reject(new Error("Python script failed"));
			}
		});
	});
}

function randomicTeams(teams) {
	return new Promise((resolve, reject) => {
		// Execute the Python script
		const pythonProcess = spawn("python3", ["./scripts/script.py"]); // Path to your Python script

		// Send the JSON data to the script via stdin
		pythonProcess.stdin.write(JSON.stringify(teams));
		pythonProcess.stdin.end();

		// Capture the output from the script
		let output = "";
		pythonProcess.stdout.on("data", (data) => {
			output += data.toString();
		});

		// Capture errors from the script
		pythonProcess.stderr.on("data", (data) => {
			console.error(`Python script error: ${data}`);
		});

		// When the script finishes, parse the output and resolve the Promise
		pythonProcess.on("close", (code) => {
			if (code !== 0) {
				return reject({ error: "Error executing Python script" });
			}
			try {
				const result = JSON.parse(output); // Convert the output JSON to an object
				resolve(result.processed_teams); // Return the processed teams
			} catch (err) {
				console.error("Error processing Python script output:", err);
				reject({ error: "Error processing Python script output" });
			}
		});
	});
}

module.exports = {
	async indexAll(req, res) {
		try {
			const games = await Games.findAll();
			return res.json(games);
		} catch (err) {
			return res.status(400).send("Broked ->" + err);
		}
	},

	async AddrandomGames(req, res) {
		try {
			const teams = await Teams.findAll();
			if (teams.length < 8) {
				return res.status(200).send({
					message: "There aren't suficient teams to play",
				});
			}

			const roundOf = req.query.round_of || "quarter";
			const tournament = req.query.tournament;

			const tournaments = await Tournament.findOne({
				where: {
					name: tournament , 
                    winner: null }
				}
			);

			if (!tournaments) {
				return res.status(200).send({
					message: "There aren't a valid tournament",
				});
			}

            const roundSimulated = await Games.findAll({
                where: {
                    round_of: roundOf,
                    tournament: String(tournaments.id) || tournaments.id
                }
            })

            if (roundSimulated.length) {
                return res.status(409).send({
                    status: 1,
                    message: "Round already simulated for this tournament.",
                })
            }

			if (roundOf === "quarter") {
				const randomTeams = await randomicTeams(teams);
				for (let i = 0; i < 4; i++) {
					const local_goals = await randomGoals();
					const visitor_goals = await randomGoals();
					let local_penalty_goals = 0;
					let visitor_penalty_goals = 0;
					const local_points = local_goals - visitor_goals;
					const visitor_points = visitor_goals - local_goals;
					const penalities = local_goals == visitor_goals ? true : false;
					let winner =
						!penalities && local_goals > visitor_goals
							? randomTeams[i].team_id
							: randomTeams[i + 4].team_id;
					let eliminated =
						!penalities && local_goals < visitor_goals
							? randomTeams[i].team_id
							: randomTeams[i + 4].team_id;
					if (penalities) {
						do {
							local_penalty_goals = await randomGoals();
							visitor_penalty_goals = await randomGoals();
							winner =
								local_penalty_goals > visitor_penalty_goals
									? randomTeams[i].team_id
									: randomTeams[i + 4].team_id;
							eliminated =
								local_penalty_goals < visitor_penalty_goals
									? randomTeams[i].team_id
									: randomTeams[i + 4].team_id;
						} while (local_penalty_goals == visitor_penalty_goals);
					}

					const games = await Games.create({
						local_team: randomTeams[i].team_id,
						visitor_team: randomTeams[i + 4].team_id,
						local_goals: local_goals,
						visitor_goals: visitor_goals,
						penalities: penalities,
						local_penalty_goals: local_penalty_goals,
						visitor_penalty_goals: visitor_penalty_goals,
						winner: winner,
						eliminated: eliminated,
						local_points: local_points,
						visitor_points: visitor_points,
						tournament: String(tournaments.id) || tournaments.id,
						round_of: roundOf,
					});
				}
				return res.status(200).send({
					status: 1,
					message: "Matchs sucessefull included",
				});
			} else if (roundOf === "semi") {
				const semiTeams = await Games.findAll({
					where: {
						round_of: "quarter",
						tournament: String(tournaments.id),
					},
					raw: true,
				});

				const randomTeams = JSON.parse(await randomSemi(semiTeams));

				for (let i = 0; i < 2; i++) {
					const local_goals = await randomGoals();
					const visitor_goals = await randomGoals();
					let local_penalty_goals = 0;
					let visitor_penalty_goals = 0;
					const local_points = local_goals - visitor_goals;
					const visitor_points = visitor_goals - local_goals;
					const penalities = local_goals == visitor_goals ? true : false;
					let winner =
						!penalities && local_goals > visitor_goals
							? randomTeams[i].winner
							: randomTeams[i + 2].winner;
					let eliminated =
						!penalities && local_goals < visitor_goals
							? randomTeams[i].winner
							: randomTeams[i + 2].winner;
					if (penalities) {
						do {
							local_penalty_goals = await randomGoals();
							visitor_penalty_goals = await randomGoals();
							winner =
								local_penalty_goals > visitor_penalty_goals
									? randomTeams[i].winner
									: randomTeams[i + 2].winner;
							eliminated =
								local_penalty_goals < visitor_penalty_goals
									? randomTeams[i].winner
									: randomTeams[i + 2].winner;
						} while (local_penalty_goals == visitor_penalty_goals);
					}

					const games = await Games.create({
						local_team: randomTeams[i].winner,
						visitor_team: randomTeams[i + 2].winner,
						local_goals: local_goals,
						visitor_goals: visitor_goals,
						penalities: penalities,
						local_penalty_goals: local_penalty_goals,
						visitor_penalty_goals: visitor_penalty_goals,
						winner: winner,
						eliminated: eliminated,
						local_points: local_points,
						visitor_points: visitor_points,
						tournament: tournaments.id,
						round_of: roundOf,
					});
				}
				return res.status(200).send({
					status: 1,
					message: "Matchs semi sucessefull included",
				});
			} else if (roundOf === "third") {
				const thirdTeams = await Games.findAll({
					where: {
						round_of: "semi",
						tournament: String(tournaments.id),
					},
					raw: true,
				});

				const randomTeams = JSON.parse(await randomSemi(thirdTeams));
				const local_goals = await randomGoals();
				const visitor_goals = await randomGoals();
				let local_penalty_goals = 0;
				let visitor_penalty_goals = 0;
				const local_points = local_goals - visitor_goals;
				const visitor_points = visitor_goals - local_goals;
				const penalities = local_goals == visitor_goals ? true : false;
				let winner =
					!penalities && local_goals > visitor_goals
						? randomTeams[0].eliminated
						: randomTeams[1].eliminated;
				let eliminated =
					!penalities && local_goals < visitor_goals
						? randomTeams[0].eliminated
						: randomTeams[1].eliminated;
				if (penalities) {
					do {
						local_penalty_goals = await randomGoals();
						visitor_penalty_goals = await randomGoals();
						winner =
							local_penalty_goals > visitor_penalty_goals
								? randomTeams[0].eliminated
								: randomTeams[1].eliminated;
						eliminated =
							local_penalty_goals < visitor_penalty_goals
								? randomTeams[0].eliminated
								: randomTeams[1].eliminated;
					} while (local_penalty_goals == visitor_penalty_goals);
				}

				const games = await Games.create({
					local_team: randomTeams[0].eliminated,
					visitor_team: randomTeams[1].eliminated,
					local_goals: local_goals,
					visitor_goals: visitor_goals,
					penalities: penalities,
					local_penalty_goals: local_penalty_goals,
					visitor_penalty_goals: visitor_penalty_goals,
					winner: winner,
					eliminated: eliminated,
					local_points: local_points,
					visitor_points: visitor_points,
					tournament: tournaments.id,
					round_of: roundOf,
				});
				return res.status(200).send({
					status: 1,
					message: "Matchs third sucessefull included",
				});
			} else if (roundOf === "final") {
				const finalTeams = await Games.findAll({
					where: {
						round_of: "semi",
						tournament: String(tournaments.id),
					},
					raw: true,
				});

				const randomTeams = JSON.parse(await randomSemi(finalTeams));
				const local_goals = await randomGoals();
				const visitor_goals = await randomGoals();
				let local_penalty_goals = 0;
				let visitor_penalty_goals = 0;
				const local_points = local_goals - visitor_goals;
				const visitor_points = visitor_goals - local_goals;
				const penalities = local_goals == visitor_goals ? true : false;
				let winner =
					!penalities && local_goals > visitor_goals
						? randomTeams[0].winner
						: randomTeams[1].winner;
				let eliminated =
					!penalities && local_goals < visitor_goals
						? randomTeams[0].winner
						: randomTeams[1].winner;
				if (penalities) {
					do {
						local_penalty_goals = await randomGoals();
						visitor_penalty_goals = await randomGoals();
						winner =
							local_penalty_goals > visitor_penalty_goals
								? randomTeams[0].winner
								: randomTeams[1].winner;
						eliminated =
							local_penalty_goals < visitor_penalty_goals
								? randomTeams[0].winner
								: randomTeams[1].winner;
					} while (local_penalty_goals == visitor_penalty_goals);
				}

				const games = await Games.create({
					local_team: randomTeams[0].winner,
					visitor_team: randomTeams[1].winner,
					local_goals: local_goals,
					visitor_goals: visitor_goals,
					penalities: penalities,
					local_penalty_goals: local_penalty_goals,
					visitor_penalty_goals: visitor_penalty_goals,
					winner: winner,
					eliminated: eliminated,
					local_points: local_points,
					visitor_points: visitor_points,
					tournament: tournaments.id,
					round_of: roundOf,
				}).then(async () => {
					const championship = await Teams.findOne({
						where: {
							id: winner,
						},
					});
					const tournamentChampionship = await Tournament.update(
						{
							winner: winner,
						},
						{
							where: {
								id: tournaments.id,
								winner: null,
							},
						}
					);
					return res.status(200).send({
						status: 1,
						message: `${championship.name} is the Champion`,
					});
				});
			} else {
                return res.status(202).send({
                    status: 1,
                    message: "Quarter of is not valid",
                });
            }
		} catch (error) {
			return res.status(400).send(error);
		}
	},
};
