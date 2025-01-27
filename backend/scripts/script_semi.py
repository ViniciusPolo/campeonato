import sys
import json
import random


def process_teams(data):
    # Simulates processing the teams
    result = []
    for team in data:
        team_result = {
            "winner": team.get("winner"),
            "eliminated": team.get("eliminated"),
        }
        result.append(team_result)

    # Shuffle the list of processed teams randomly (only 4 positions)
    random.shuffle(result)
    return result


if __name__ == "__main__":
    # Read input data from stdin
    input_data = json.load(sys.stdin)

    # Check if input is a list
    if not isinstance(input_data, list):
        print(json.dumps({"error": "Input data must be a list of teams"}, ensure_ascii=False, indent=4))
        sys.exit(1)

    # Process the teams
    processed_teams = process_teams(input_data)

    # Return the processed teams array as JSON
    print(json.dumps(processed_teams, ensure_ascii=False, indent=4))
