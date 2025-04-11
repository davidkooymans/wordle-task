import React from 'react';

import { range, sample } from '../../utils';
import { WORDS } from '../../data';
import { checkGuess } from '../../game-helpers'
import { NUM_OF_GUESSES_ALLOWED } from '../../constants'
import GuessInput from '../GuessInput'

// Pick a random word on every pageload.
const answer = sample(WORDS);
// To make debugging easier, we'll log the solution in the console.
console.info({ answer });

function Game() {
  function buildGuesses() {
    let guesses = [];
    range(NUM_OF_GUESSES_ALLOWED).forEach(index => {
      let guess = { row: index, letters: [] }
      range(5).forEach(charIndex => {
        guess.letters.push({ char: '', index: charIndex, status: '' })
      })
      guesses.push(guess)
    })
    return guesses;
  }

  const [guesses, setGuesses] = React.useState(buildGuesses())
  const [guessIndex, setGuessIndex] = React.useState(0)
  // states can be playing/won/lost
  const [gameState, setGameState] = React.useState('playing');

  function addGuess(guess) {
    if (guessIndex >= NUM_OF_GUESSES_ALLOWED) {
      window.alert('You have reached 6 guesses');
      return;
    }
    newGuesses = [...guesses]
    const evalGuess = checkGuess(guess, answer)
    newGuesses[guessIndex].letters.forEach((letter, index) => {
      letter.char = evalGuess[index].letter;
      letter.status = evalGuess[index].status;
    })
    setGuesses(newGuesses)
    setGuessIndex(guessIndex + 1)
    if (guess === answer) {
      setGameState('won');
    }
    else if (guessIndex == 5) {
      setGameState('lost');
    }
  }

  return <>
    <div className="guess-results">
      {guesses.map((guess, index) => {
        return <p className="guess" key={index}>
          {range(5).map(charIndex => {
            return <span className={`cell ${guess.letters[charIndex].status}`} key={guess.letters[charIndex].index}>{guess.letters[charIndex].char}</span>
          }

          )}
        </p>
      })}
    </div>
    <GuessInput addGuess={addGuess} gameState={gameState}/>
    {gameState === 'won' && (<div class="happy banner">
      <p>
        <strong>Congratulations!</strong> Got it in{' '}
        <strong>{guessIndex} guess{guessIndex > 1?'es':''}</strong>.
      </p>
    </div>
    )}

    {gameState === 'lost' && (
      <div class="sad banner">
        <p>Sorry, the correct answer is <strong>{answer}</strong>.</p>
      </div>
    )}


    </>
}

    export default Game;
