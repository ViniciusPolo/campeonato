import sys
import json
import random


def process_teams(data):
    # Simulates processing the teams
    result = []
    for team in data:
        team_result = {
            "team_id": team.get("id"),
        }
        result.append(team_result)

    # Select 8 random teams from the processed list
    selected_teams = random.sample(result, k=min(8, len(result)))
    return selected_teams


if __name__ == "__main__":
    # Read input data from stdin
    input_data = json.load(sys.stdin)

    # Check if input is a list
    if not isinstance(input_data, list):
        print(json.dumps({"error": "Input data must be a list of teams"}, ensure_ascii=False, indent=4))
        sys.exit(1)

    # Process the teams
    processed_teams = process_teams(input_data)

    # Prepare the output
    output = {
        "message": "Processamento realizado com sucesso",
        "processed_teams": processed_teams
    }

    # Return the output as JSON
    print(json.dumps(output, ensure_ascii=False, indent=4))
