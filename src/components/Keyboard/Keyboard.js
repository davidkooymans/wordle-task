import React from 'react';



function Keyboard({ addCharacter, characters }) {


  // assumes both are either incorrect, misplaced or correct
  function compareStatus(oldStatus, newStatus) {
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

  return <div>
    {characters.map((row, index) => {
      return <p key={index}>
        {row.map(key => {
          return <button key={key.key} className={`button key ${key.status}`} onClick={() => addCharacter(key.key)}>{key.key}</button>
        })}
      </p>
    })}
  </div>;
}

export default Keyboard;
