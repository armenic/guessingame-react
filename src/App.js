import { Container, Form, Button, Alert, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  //The maximum is inclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function App() {
  const [name, setName] = useState("");
  const [numberGuesses, setNumberGuesses] = useState(5);
  const [minNumber, setMinNumber] = useState(1);
  const [maxNumber, setMaxNumber] = useState(10);
  const [secretNumber, setSecretNumber] = useState(0);
  const [playerNumber, setPlayerNumber] = useState(0);
  const [playerNumbers, setPlayerNumbers] = useState([]);

  const [chunk, setChunk] = useState({
    nameSet: false,
    guessSet: false,
    rangeSet: false,
    gameEnd: false,
  });

  const [alert, setAlert] = useState({
    rangeShow: false,
    winShow: false,
    lostShow: false,
    diffShow: false,
  });

  useEffect(() => {
    if (chunk.gameEnd) {
      setAlert((alert) => ({ ...alert, diffShow: false }));
    }
  }, [chunk.gameEnd]);

  const alertStyle = { width: "50%" };

  const handleInputChange = (event) => {
    const target = event.target;
    const name = target.name;
    const value = parseInt(target.value);

    if (name === "playerName") {
      setName(
        // take each word
        target.value.replace(/\w*/g, (w) =>
          // take first character
          w.replace(/^\w/, (c) => c.toUpperCase())
        )
      );
    } else if (name === "playerNumber") {
      setPlayerNumber(String(value));
      setAlert({ ...alert, diffShow: false });
    } else if (name === "maxNumber") {
      setAlert({ ...alert, rangeShow: false });
      setMaxNumber(value);
    } else if (name === "minNumber") {
      setAlert({ ...alert, rangeShow: false });
      setMinNumber(value);
    } else if (name === "numberGuesses") {
      setNumberGuesses(value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const target = event.target;
    const name = target.name;

    if (name === "nameSubmit") {
      setChunk({ ...chunk, nameSet: true });
    } else if (name === "numberGuessesSubmit") {
      setChunk({ ...chunk, guessSet: true });
    } else if (name === "rangeSubmit") {
      if (maxNumber > minNumber) {
        setChunk({ ...chunk, rangeSet: true });
        setSecretNumber(getRandomIntInclusive(minNumber, maxNumber));
        setPlayerNumber(minNumber);
      } else {
        setAlert({ ...alert, rangeShow: true });
      }
    } else if (name === "playerNumberSubmit") {
      setPlayerNumbers((prevState) => [...prevState, playerNumber]);
      if (playerNumber === String(secretNumber)) {
        setAlert({ ...alert, winShow: true });
        setChunk({ ...chunk, gameEnd: true });
      } else if (numberGuesses - 1 === 0) {
        setNumberGuesses(numberGuesses - 1);
        setAlert({ ...alert, lostShow: true });
        setChunk({ ...chunk, gameEnd: true });
      } else {
        setNumberGuesses(numberGuesses - 1);
        setAlert({ ...alert, diffShow: true });
      }
    } else if (name === "playAgainSubmit") {
      setAlert((alert) => ({ ...alert, winShow: false }));
      setAlert((alert) => ({ ...alert, lostShow: false }));
      setNumberGuesses(5);
      setMinNumber(1);
      setMaxNumber(10);
      setPlayerNumbers([]);
      // using an updater function for state update here is important since
      // many state updates are scheduled and we want them to be done in a
      // sequence (queue)
      setChunk((chunk) => ({ ...chunk, guessSet: false }));
      setChunk((chunk) => ({ ...chunk, rangeSet: false }));
      setChunk((chunk) => ({ ...chunk, gameEnd: false }));
    }
  };

  return (
    <Container>
      <h1>Number Guessing Game</h1>
      <br />
      {chunk.rangeSet && (
        <>
          <h3>Guesses left: {numberGuesses}</h3>
          <h5>
            Numbers guessed:{" "}
            {/* need space in front and , at the end, except last one */}
            {playerNumbers.map((number, i) => {
              const commaString = i < playerNumbers.length - 1 ? "," : "";

              let lessOrBigger;
              if (number < secretNumber) {
                lessOrBigger = "(<)";
              } else if (number > secretNumber) {
                lessOrBigger = "(>)";
              } else {
                lessOrBigger = "(✔)";
              }

              return (
                <span key={i}>
                  {" "}
                  {number} {lessOrBigger}
                  {commaString}
                </span>
              );
            })}
          </h5>
        </>
      )}
      <br />
      {!chunk.nameSet && (
        <Form onSubmit={handleSubmit} name="nameSubmit">
          <Col xs={6}>
            <Form.Control
              type="text"
              placeholder="Type your name"
              required
              onChange={handleInputChange}
              value={name}
              name="playerName"
            />
          </Col>
          <br />
          <Button type="submit" variant="success">
            Enter
          </Button>
        </Form>
      )}

      {chunk.nameSet && !chunk.guessSet && (
        <Form onSubmit={handleSubmit} name="numberGuessesSubmit">
          <h3>Hello {name}!</h3>
          <h4>How lucky do you think you are?</h4>
          <h5>How many guesses do you want?</h5>
          <Col xs={3}>
            <Form.Control
              type="number"
              min={1}
              max={10}
              onChange={handleInputChange}
              name="numberGuesses"
              value={numberGuesses}
              required
            />
          </Col>
          <br />
          <Button type="submit" variant="success">
            Enter
          </Button>
        </Form>
      )}

      {chunk.guessSet && !chunk.rangeSet && (
        <Form onSubmit={handleSubmit} name="rangeSubmit">
          <h5>{name}, please select min and max numbers to start the game.</h5>
          <Form.Label htmlFor="maxNumber">
            The largest number to choose from
          </Form.Label>
          <Col xs={3}>
            <Form.Control
              type="number"
              min={2}
              max={100}
              onChange={handleInputChange}
              value={maxNumber}
              id="maxNumber"
              name="maxNumber"
              required
            />
          </Col>
          <br />
          <Form.Label htmlFor="minNumber">
            The smallest number to choose from
          </Form.Label>
          <Col xs={3}>
            <Form.Control
              type="number"
              min={1}
              max={100}
              onChange={handleInputChange}
              value={minNumber}
              id="minNumber"
              name="minNumber"
              required
            />
          </Col>
          <br />
          <Button type="submit" variant="success">
            Enter
          </Button>
        </Form>
      )}

      {chunk.rangeSet && !chunk.gameEnd && (
        <Form onSubmit={handleSubmit} name="playerNumberSubmit">
          <h5>
            {name}, I am thinking of a number between {minNumber} and{" "}
            {maxNumber}.
          </h5>
          <Form.Label htmlFor="playerNumber">
            Enter your guessed number
          </Form.Label>
          <Col xs={3}>
            <Form.Control
              type="number"
              min={minNumber}
              max={maxNumber}
              onChange={handleInputChange}
              value={playerNumber}
              id="playerNumber"
              name="playerNumber"
              required
            />
          </Col>
          <br />
          <Button type="submit" variant="success">
            Enter
          </Button>
        </Form>
      )}

      {alert.rangeShow && (
        <>
          <br />
          <Alert
            variant="danger"
            onClose={() => setAlert({ ...alert, rangeShow: false })}
            dismissible
            style={alertStyle}
          >
            <Alert.Heading>Invalid largest number selected</Alert.Heading>
            <p>
              The largest number ({maxNumber}) has to be bigger than the
              smallest ({minNumber}) number.
            </p>
          </Alert>
        </>
      )}

      {alert.diffShow && (
        <>
          <br />
          <Alert
            variant="warning"
            onClose={() => setAlert({ ...alert, diffShow: false })}
            dismissible
            style={alertStyle}
          >
            <Alert.Heading>Not quite right</Alert.Heading>
            <p>
              That's {playerNumber < secretNumber ? "smaller" : "bigger"} than I
              was thinking.
            </p>
          </Alert>
        </>
      )}

      {alert.winShow && (
        <>
          <br />
          <Alert variant="success" style={alertStyle}>
            <Alert.Heading>You won!</Alert.Heading>
            <p>Congratulations {name}, you won the game!.</p>
            <p>The number I was thinking of was {secretNumber}.</p>
          </Alert>
          <Form onSubmit={handleSubmit} name="playAgainSubmit">
            <Button type="submit" variant="success">
              Play Again
            </Button>
          </Form>
        </>
      )}

      {alert.lostShow && (
        <>
          <br />
          <Alert variant="danger" style={alertStyle}>
            <Alert.Heading>You Lost :(</Alert.Heading>
            <p>Sorry {name}, you lost the game!.</p>
            <p>The number I was thinking of was {secretNumber}.</p>
          </Alert>
          <Form onSubmit={handleSubmit} name="playAgainSubmit">
            <Button type="submit" variant="success">
              Play Again
            </Button>
          </Form>
        </>
      )}

      <Container className="text-center">
        <h6 className="fixed-bottom">
          Refresh the page at any time to start over.
        </h6>
      </Container>
    </Container>
  );
}

export default App;
