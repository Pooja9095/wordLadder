import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [startWord, setStartWord] = useState('');
  const [endWord, setEndWord] = useState('');
  const [currentWord, setCurrentWord] = useState('');
  const [wordLadder, setWordLadder] = useState([]);
  const [error, setError] = useState('');

  const handleStartWordChange = (e) => {
    setStartWord(e.target.value);
  };

  const handleEndWordChange = (e) => {
    setEndWord(e.target.value);
  };

  const handleCurrentWordChange = (e) => {
    setCurrentWord(e.target.value);
  };

  const isValidWord = async (word) => {
    try {
      const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      return response.status === 200;
    } catch {
      return false;
    }
  };

  const isOneLetterDifferent = (word1, word2) => {
    if (word1.length !== word2.length) return false;
    let diffCount = 0;
    for (let i = 0; i < word1.length; i++) {
      if (word1[i] !== word2[i]) diffCount++;
      if (diffCount > 1) return false;
    }
    return diffCount === 1;
  };

  const handleAddWord = async (e) => {
    e.preventDefault();
    setError('');
    if (!isOneLetterDifferent(wordLadder[wordLadder.length - 1], currentWord)) {
      setError('The word must change exactly one letter from the previous word.');
      return;
    }
    const valid = await isValidWord(currentWord);
    if (!valid) {
      setError('The word must be a valid English word.');
      return;
    }
    setWordLadder([...wordLadder, currentWord]);
    setCurrentWord('');
  };

  const handleStartGame = async (e) => {
    e.preventDefault();
    setError('');
    if (startWord.length !== endWord.length) {
      setError('Start and End words must be of the same length.');
      return;
    }
    const startValid = await isValidWord(startWord);
    const endValid = await isValidWord(endWord);
    if (!startValid || !endValid) {
      setError('Both words must be valid English words.');
      return;
    }
    setWordLadder([startWord]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Word Ladder Game</h1>
        <form onSubmit={handleStartGame} className="mb-3">
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Start Word"
              value={startWord}
              onChange={handleStartWordChange}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="End Word"
              value={endWord}
              onChange={handleEndWordChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">Start Game</button>
        </form>
        {wordLadder.length > 0 && (
          <form onSubmit={handleAddWord} className="mb-3">
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Next Word"
                value={currentWord}
                onChange={handleCurrentWordChange}
              />
            </div>
            <button type="submit" className="btn btn-primary">Add Word</button>
          </form>
        )}
        {error && <p className="error">{error}</p>}
        <ul>
          {wordLadder.map((word, index) => (
            <li key={index}>{word}</li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
