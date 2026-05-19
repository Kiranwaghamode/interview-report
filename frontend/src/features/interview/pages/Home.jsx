import React, { useState, useRef, use, useEffect } from 'react';
import '../style/home.scss';
import { useInterview } from '../hook/useInterview.js';
import { useNavigate } from 'react-router';
import { useAuth } from '../../auth/hooks/useAuth.js';


const Home = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [selfDescription, setSelfDescription] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: '' });
  const fileInputRef = useRef(null);


  const { handleLogout, user } = useAuth()

  const navigate = useNavigate()


  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > 3) {
        setAlertModal({ isOpen: true, message: `File size is ${fileSizeMB.toFixed(2)} MB. Maximum allowed size is 3 MB.` });
        return;
      }
      setResumeFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > 3) {
        setAlertModal({ isOpen: true, message: `File size is ${fileSizeMB.toFixed(2)} MB. Maximum allowed size is 3 MB.` });
        return;
      }
      setResumeFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleRemoveFile = () => {
    setResumeFile(null);
    fileInputRef.current.value = '';
  };


  const {loading, generateReport, fetchReportById, reports} = useInterview()

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ jobDescription, resumeFile, selfDescription });

    const response = await generateReport({ jobDescription, selfDescription, resumeFile });
    navigate(`/interview/${response._id}`)
  };

  const formatDateToIndian = (dateString) => {
    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    });
    return formatter.format(date);
  };



  const isFormValid = jobDescription.trim() !== '' && resumeFile !== null;



  if(loading){
    return (
      <div className="loading-overlay">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h1 className="loading-title">Loading<span className="loading-dots"><span>.</span><span>.</span><span>.</span></span></h1>
          <p className="loading-subtitle">Generating Your Report</p>
        </div>
      </div>
    )
  }

  return (
    <div className="home-page">
      {/* Custom Alert Modal */}
      {alertModal.isOpen && (
        <div className="alert-modal-overlay" onClick={() => setAlertModal({ isOpen: false, message: '' })}>
          <div className="alert-modal" onClick={(e) => e.stopPropagation()}>
            <div className="alert-modal__header">
              <svg className="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <h3 className="alert-modal__title">File Size Exceeded</h3>
            </div>
            <p className="alert-modal__message">{alertModal.message}</p>
            <button
              className="alert-modal__button"
              onClick={() => setAlertModal({ isOpen: false, message: '' })}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="home-nav">
        <div className="home-nav__logo">
          <div className="home-nav__logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span>INTERVIEW<span>_AI</span></span>
        </div>
        <div className="home-nav__links">
          {user ? (
          <div className="user-profile">
            <div className="user-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <span className="user-name">{user.username}</span>
            <button onClick={async () => {
              await handleLogout();
              navigate('/');
            }} className="home-nav__cta">
              Logout
            </button>
          </div>
        ) : (
          <>
            <a href="/login">Sign In</a>
          </>
        )}
        </div>
      </nav>

      {/* Hero */}
      <div className="home-hero">
        <div className="home-hero__badge">AI-Powered Resume Analyzer</div>
        <h1 className="home-hero__title">
          Land your <span>dream job</span><br />with smarter applications
        </h1>
        <p className="home-hero__subtitle">
          Paste a job description, upload your resume, and let AI analyze
          how well you match — in seconds.
        </p>
      </div>

      {/* Form Card */}
      <div className="home-container">
        <form className="home-card" onSubmit={handleSubmit}>

          {/* Job Description */}
          <div className="form-group">
            <label htmlFor="jobDesc">
              Job Description
              <span className="badge-required">Required</span>
            </label>
            <p className="field-hint">Paste the full job posting or describe the role</p>
            <textarea
              id="jobDesc"
              rows={6}
              placeholder="e.g. We are looking for a React developer with 3+ years of experience..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              required
            />
            <span className="char-count">{jobDescription.length} characters</span>
          </div>

          {/* Resume Upload */}
          <div className="form-group">
            <label>
              Resume Upload
              <span className="badge-required">Required</span>
            </label>
            <p className="field-hint">Only PDF files are accepted</p>

            {!resumeFile ? (
              <div
                className={`upload-zone ${dragOver ? 'upload-zone--active' : ''}`}
                onClick={() => fileInputRef.current.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <div className="upload-zone__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <p className="upload-zone__text">
                  <span>Click to upload</span> or drag and drop
                </p>
                <p className="upload-zone__hint">PDF only · Max 3MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleResumeChange}
                  style={{ display: 'none' }}
                />
              </div>
            ) : (
              <div className="file-preview">
                <div className="file-preview__info">
                  <div className="file-preview__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <div>
                    <p className="file-preview__name">{resumeFile.name}</p>
                    <p className="file-preview__size">
                      {(resumeFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="file-preview__remove"
                  onClick={handleRemoveFile}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Self Description */}
          <div className="form-group">
            <label htmlFor="selfDesc">
              Self Description
              <span className="badge-optional">Optional</span>
            </label>
            <p className="field-hint">Briefly describe yourself, your strengths, or career goals</p>
            <textarea
              id="selfDesc"
              rows={4}
              placeholder="e.g. I am a passionate frontend developer with a love for building..."
              value={selfDescription}
              onChange={(e) => setSelfDescription(e.target.value)}
            />
            <span className="char-count">{selfDescription.length} characters</span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`btn-primary ${!isFormValid ? 'btn-primary--disabled' : ''}`}
            disabled={!isFormValid}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Analyze My Resume and Generate Report
          </button>

        </form>

        {reports.length > 0 && (
          <div className="report-history">
            <div className="report-history__header">
              <h2 className="report-history__title">Recent Reports</h2>
              <p className="report-history__subtitle">Access your previously generated analysis reports</p>
            </div>
            <div className="report-history__list">
              {reports.map((report) => (
                <div 
                  key={report._id} 
                  className="report-card"
                  onClick={() => navigate(`/interview/${report._id}`)}
                >
                  <div className="report-card__content">
                    <h3 className="report-card__title">{report.title || 'Untitled Report'}</h3>
                    <p className="report-card__meta">
                      <span className="report-card__date">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        {formatDateToIndian(report.createdAt)}
                      </span>
                    </p>
                  </div>
                  <div className="report-card__arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default Home;