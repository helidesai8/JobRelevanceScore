import React from 'react';
import './AnalysisResults.css';

const AnalysisResults = ({ results }) => {
  const highlightText = (text, keywords, uniqueKeywords) => {
    const regex = new RegExp(`\\b(${keywords.join('|')}|${uniqueKeywords.join('|')})\\b`, 'gi');
    return text.split('\n').map((line, lineIndex) => (
      <React.Fragment key={`line-${lineIndex}`}>
        {line.split(regex).map((part, index) => {
          if (keywords.includes(part.toLowerCase())) {
            return <span key={`highlight-${lineIndex}-${index}`} className="highlight">{part}</span>;
          } else if (uniqueKeywords.includes(part.toLowerCase())) {
            return <span key={`unique-${lineIndex}-${index}`} className="highlight-unique">{part}</span>;
          } else {
            return <React.Fragment key={`text-${lineIndex}-${index}`}>{part}</React.Fragment>;
          }
        })}
        <br key={`br-${lineIndex}`} />
      </React.Fragment>
    ));
  };

  const resumeText = results.resume_text || '';
  const jobDescriptionText = results.job_description_text || '';
  const commonKeywords = results.common_keywords.map(keyword => keyword.toLowerCase());
  const uniqueKeywords = results.unique_keywords.map(keyword => keyword.toLowerCase());

  return (
    <div className="analysis-results">
      <h2>Analysis Results</h2>
      <p><strong>Relevance Score:</strong> {results.relevance_score}</p>
      <p><strong>Unique Keywords:</strong> {results.unique_keywords.join(', ')}</p>
      <h3>Resume:</h3>
      <p className="highlighted-text">{highlightText(resumeText, commonKeywords, [])}</p>
      <h3>Job Description:</h3>
      <p className="highlighted-text">{highlightText(jobDescriptionText, commonKeywords, uniqueKeywords)}</p>
    </div>
  );
};

export default AnalysisResults;
