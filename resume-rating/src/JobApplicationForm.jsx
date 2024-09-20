import React, { useState } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FormControl, FormLabel, Input, Box, Typography, Alert } from '@mui/material';

const API_URL = import.meta.env.VITE_API_BASE_URL;
console.log(API_URL);

const JobApplicationForm = ({ onResults }) => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescriptionText, setJobDescriptionText] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescriptionFile, setJobDescriptionFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    let formData = new FormData();
    if (resumeFile) {
      formData.append('resume_file', resumeFile);
    } else {
      formData.append('resume_text', resumeText);
    }

    if (jobDescriptionFile) {
      formData.append('job_description_file', jobDescriptionFile);
    } else {
      formData.append('job_description_text', jobDescriptionText);
    }

    try {
      console.log(`Calling analysis endpoint,{${API_URL}/upload `);

      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const documentId = response.data.DocumentID;
      console.log(`Calling analysis endpoint,{${API_URL}/extract`,documentId);

      // Trigger text extraction and analysis
      console.log(`Calling analysis endpoint,{${API_URL}/extract`);
      await fetch(`${API_URL}/extract`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ DocumentID: documentId }),
      })
      // await axios.post(`${API_URL}/extract`, { DocumentID: documentId });

      console.log(`Calling analysis endpoint,{${API_URL}/analyze`);
      const analyzeUrl = `${API_URL}/analyze`;
      const analysisResponse = await axios.post(analyzeUrl, { DocumentID: documentId }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      onResults(analysisResponse.data.analysis_results);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="job-application-form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h4" gutterBottom>Upload Resume and Job Description</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        label="Resume Text"
        multiline
        rows={4}
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
        disabled={!!resumeFile}
        placeholder="Enter resume text here"
        fullWidth
      />
      <TextField
        label="Job Description Text"
        multiline
        rows={4}
        value={jobDescriptionText}
        onChange={(e) => setJobDescriptionText(e.target.value)}
        disabled={!!jobDescriptionFile}
        placeholder="Enter job description text here"
        fullWidth
      />
      <FormControl>
        <FormLabel>Upload Resume File:</FormLabel>
        <Input type="file" onChange={(e) => handleFileChange(e, setResumeFile)} disabled={!!resumeText} />
      </FormControl>
      <FormControl>
        <FormLabel>Upload Job Description File:</FormLabel>
        <Input type="file" onChange={(e) => handleFileChange(e, setJobDescriptionFile)} disabled={!!jobDescriptionText} />
      </FormControl>
      <Button type="submit" variant="contained" color="primary" disabled={loading}>
        {loading ? 'Processing...' : 'Submit'}
      </Button>
    </Box>
  );
};

export default JobApplicationForm;
