import random
import json

# Generate a random number between 0 and 5
random_number = random.randint(0, 5)

# Return the number as JSON
print(json.dumps({"random_number": random_number}))
