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

  function addGuess(guess) {
    if (guessIndex >= NUM_OF_GUESSES_ALLOWED) {
      window.alert('You have reached 6 guesses')
      return;
    }
    newGuesses = [...guesses]
    const evalGuess = checkGuess(guess, answer)
    newGuesses[guessIndex].letters.forEach((letter, index) => {
      letter.char = evalGuess[index].letter
      letter.status = evalGuess[index].status
    })
    setGuesses(newGuesses)
    setGuessIndex(guessIndex + 1)
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
    <GuessInput addGuess={addGuess} />
  </>;
}

export default Game;
