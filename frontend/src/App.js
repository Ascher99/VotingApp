// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VotingCard from './components/VotingCard';
import './App.css';

const App = () => {
  const [votes, setVotes] = useState({ cat: 0, dog: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

  const fetchVotes = async () => {
    try {
      const response = await axios.get(`${API_URL}/votes`);
      const voteData = response.data.reduce((acc, curr) => {
        acc[curr.animal] = parseInt(curr.count);
        return acc;
      }, { cat: 0, dog: 0 });
      setVotes(voteData);
      setError(null);
    } catch (error) {
      console.error('Error fetching votes:', error);
      setError('Failed to fetch votes. Please try again later.');
    }
  };

  useEffect(() => {
    fetchVotes();
    const interval = setInterval(fetchVotes, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleVote = async (animal) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${API_URL}/vote`, { animal });
      await fetchVotes();
    } catch (error) {
      console.error('Error voting:', error);
      setError('Failed to submit vote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Cats vs Dogs: Cast Your Vote!</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="voting-container">
        <VotingCard
          animal="cat"
          votes={votes.cat}
          onVote={() => handleVote('cat')}
          disabled={loading}
        />
        <VotingCard
          animal="dog"
          votes={votes.dog}
          onVote={() => handleVote('dog')}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default App;