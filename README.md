# Educational Battleship

## Description
An educational take on the battleship game. To fire a round the player must correctly solve an english exercise.

## Game Setup Phase

### HOST CLIENT
 
- Define the Row and Column Tags.
- Establish Connection with the server.
- Request a New Game Session based on the row and col tags previously defined.

### SERVER

- Instantiates a new game session based on the tags.
- Returns the new session's ID to the HOST.

### HOST CLIENT

- Store and Present Game ID.

### GUEST CLIENT

- Establish Server connection using a provided Game ID.

### SERVER - when both HOST and CLIENT are connected.

- Return Empty Boards to both clients with correct size based on tags.

### GUEST AND HOST CLIENTS.

- Send Ship Positions to SERVER, signalling READY state.

### SERVER

- Send Game Start message to both CLIENTS, with appropriate GameBoard States.

## Game Ongoing Phase

### TODO ...
 
