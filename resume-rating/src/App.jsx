import React, { useState } from 'react';
import JobApplicationForm from './JobApplicationForm.jsx';
import AnalysisResults from './AnalysisResults.jsx';
import './App.css';

function App() {
  const [results, setResults] = useState(null);

  const handleResults = (data) => {
    setResults(data);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AI driven Resume Rating</h1>
      </header>
      <main>
        <JobApplicationForm onResults={handleResults} />
        {results && <AnalysisResults results={results} />}
      </main>
    </div>
  );
}

export default App;
