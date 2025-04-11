import React from 'react';


function GuessInput({addGuess, gameState}) {

  const [guess, setGuess] = React.useState('')

  function submit(event) {
    event.preventDefault()
    if(guess.length != 5){
      window.alert('Must be 5 characters')
      return;
    }
    addGuess(guess);
    setGuess('');
  }

  return <form className="guess-input-wrapper" onSubmit={event => submit(event)}>
    <label htmlFor="guess-input">Enter guess:</label>
    <input id="guess-input" type="text" disabled={gameState!=='playing'} value={guess} onChange={event => {
      let newGuess = event.target.value;
      if(newGuess.length > 5){
        return;
      }
      
      setGuess(newGuess.toUpperCase())
    }} />
  </form>;
}

export default GuessInput;
