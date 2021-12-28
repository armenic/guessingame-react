import { Container, Form, Button, Alert, Col } from "react-bootstrap";
import { useState } from "react";

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
  const [maxNumber, setMaxNumber] = useState(2);
  const [secretNumber, setSecretNumber] = useState(0);
  const [playerNumber, setPlayerNumber] = useState(0);
  const [playerNumbers, setPlayerNumbers] = useState([]);

  const [nameSet, setNameSet] = useState(false);
  const [guessSet, setGuessSet] = useState(false);
  const [rangeSet, setRangeSet] = useState(false);
  const [gameEnd, setGameEnd] = useState(false);

  const [alertRangeShow, setAlertRangeShow] = useState(false);
  const [alertWinShow, setAlertWinShow] = useState(false);
  const [alertLostShow, setAlertLostShow] = useState(false);
  const [alertDiffShow, setAlertDiffShow] = useState(false);

  const alertStyle = { width: "50%" };

  const handleInputChange = (event) => {
    const target = event.target;
    const name = target.name;
    const value = parseInt(target.value);

    if (name === "playerName") {
      setNameSet(false);
      setName(
        // take each word
        target.value.replace(/\w*/g, (w) =>
          // take first character
          w.replace(/^\w/, (c) => c.toUpperCase())
        )
      );
    } else if (name === "playerNumber") {
      setPlayerNumber(value);
      setAlertDiffShow(false);
    } else if (name === "maxNumber") {
      setAlertRangeShow(false);
      setMaxNumber(value);
    } else if (name === "minNumber") {
      setAlertRangeShow(false);
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
      setNameSet(true);
    } else if (name === "numberGuessesSubmit") {
      setGuessSet(true);
    } else if (name === "rangeSubmit") {
      if (maxNumber > minNumber) {
        setRangeSet(true);
        setSecretNumber(getRandomIntInclusive(minNumber, maxNumber));
        setPlayerNumber(minNumber);
      } else {
        setAlertRangeShow(true);
      }
    } else if (name === "playerNumberSubmit") {
      setPlayerNumbers((prevState) => [...prevState, playerNumber]);
      setAlertDiffShow(false);
      if (playerNumber === secretNumber) {
        setAlertWinShow(true);
        setGameEnd(true);
      } else if (numberGuesses - 1 === 0) {
        setAlertLostShow(true);
        setGameEnd(true);
      } else {
        setNumberGuesses(numberGuesses - 1);
        setAlertDiffShow(true);
      }
    } else if (name === "playAgainSubmit") {
      setAlertWinShow(false);
      setAlertLostShow(false);
      setNumberGuesses(5);
      setMinNumber(1);
      setMaxNumber(2);
      setPlayerNumbers([]);
      setGuessSet(false);
      setRangeSet(false);
      setGameEnd(false);
    }
  };

  return (
    <Container>
      <h1>Guessing Game</h1>
      <br />
      {rangeSet && (
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
                <span>
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
      {!nameSet && (
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

      {nameSet && !guessSet && (
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

      {guessSet && !rangeSet && (
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

      {rangeSet && !gameEnd && (
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

      {alertRangeShow && (
        <>
          <br />
          <Alert
            variant="danger"
            onClose={() => setAlertRangeShow(false)}
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

      {alertDiffShow && (
        <>
          <br />
          <Alert
            variant="warning"
            onClose={() => setAlertDiffShow(false)}
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

      {alertWinShow && (
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

      {alertLostShow && (
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
