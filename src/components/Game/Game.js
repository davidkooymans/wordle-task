import React from 'react';

import { range, sample } from '../../utils';
import { WORDS } from '../../data';
import { checkGuess } from '../../game-helpers'
import { NUM_OF_GUESSES_ALLOWED } from '../../constants'
import GuessInput from '../GuessInput'
import Keyboard from '../Keyboard/Keyboard';

const keyboardChars = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']];



function Game() {

  function buildKeyboard() {
    let chars = [];
    {
      keyboardChars.forEach((charRow, index) => {
        let row = []
        {
          charRow.forEach(key => {
            row.push({ key: key, status: '' })
          })
        }
        chars.push(row);
      })
    }
    return chars;
  }

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


  const [answer, setAnswer] = React.useState(sample(WORDS))
  const [guesses, setGuesses] = React.useState(buildGuesses())
  const [guess, setGuess] = React.useState('')
  const [guessIndex, setGuessIndex] = React.useState(0)
  // states can be playing/won/lost
  const [gameState, setGameState] = React.useState('playing');
  const [characters, setCharacters] = React.useState(buildKeyboard())


  function reset() {
    setAnswer(sample(WORDS));
    setGuessIndex(0);
    setGuesses(buildGuesses());
    setGameState('playing');
    setCharacters(buildKeyboard())
  }

  function addGuessCharacter(char) {
    if (guess.length >= 5) {
      return;
    }
    let newGuess = guess;
    newGuess = newGuess + char;
    setGuess(newGuess);
  }

  function compareStatus(oldStatus, newStatus) {
    // if the old status is blank then the new status is true
    if(oldStatus == '') return newStatus;
    if(newStatus == '') return oldStatus;
    //status correct is the top of the heirarchy
    if(newStatus === 'correct') return newStatus;
    if(oldStatus === 'correct') return oldStatus;
    // if one status is incorrect then it will always be the other status, at worst they are the same
    if(oldStatus === 'incorrect') return newStatus;
    if(newStatus === 'incorrect') return oldStatus;
    // only other possibility is that they are misplaced
    if(oldStatus === 'misplaced') return 'misplaced';
    if(newStatus === 'misplaced') return 'misplaced';
    return '';
  }

  function addGuess(guess) {
    if (guessIndex >= NUM_OF_GUESSES_ALLOWED) {
      window.alert('You have reached 6 guesses');
      return;
    }
    let newGuesses = [...guesses]
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
    //update the keyboard
    const newCharacters = [...characters]
    newCharacters.forEach(row=>{
      row.forEach(character=>{
        character.status = guesses.reduce((oldStatus, guess)=>{
          return compareStatus(oldStatus, guess.letters.filter(x=>x.char === character.key).reduce((currentStatus,key)=>{
            return compareStatus(key.status, currentStatus)
          }, ''));
        }, '')
      })
    })
    setCharacters(newCharacters)
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
    <GuessInput addGuess={addGuess} guess={guess} setGuess={setGuess} gameState={gameState} />
    <Keyboard addCharacter={addGuessCharacter} characters={characters}></Keyboard>
    {gameState === 'won' && (<div className="happy banner">
      <p>
        <strong>Congratulations!</strong> Got it in{' '}
        <strong>{guessIndex} guess{guessIndex > 1 ? 'es' : ''}</strong>.
      </p>
      <button onClick={() => reset()} className='reset-button'>RESET</button>
    </div>
    )}

    {gameState === 'lost' && (
      <div className="sad banner">
        <p>Sorry, the correct answer is <strong>{answer}</strong>.</p>
        <button onClick={() => reset()} className='reset-button'>RESET</button>
      </div>
    )}


  </>
}

export default Game;
