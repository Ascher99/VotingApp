import React from 'react';

const VotingCard = ({ animal, votes, onVote, disabled }) => {
  const imageUrl = animal === 'cat' 
    ? '/images/cat.png'
    : '/images/dog.png';

  return (
    <div className="voting-card">
      <img 
        src={imageUrl}
        alt={animal}
        className="animal-image"
        onError={(e) => {
          e.target.onerror = null; 
          e.target.src = '/images/fallback-image.png'; 
        }}
      />
      <h2>{animal.charAt(0).toUpperCase() + animal.slice(1)}</h2>
      <p>Votes: {votes}</p>
      <button 
        onClick={onVote}
        disabled={disabled}
        className="vote-button"
      >
        Vote for {animal}
      </button>
    </div>
  );
};

export default VotingCard;