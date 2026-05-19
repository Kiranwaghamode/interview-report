import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import '../style/interview.scss'
import { useInterview } from '../hook/useInterview.js'

const Interview = () => {
  const [activeSection, setActiveSection] = useState('technical')
  const [expandedIndex, setExpandedIndex] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const { report } = useInterview()

  console.log(report)


  if(!report){
    return (
      <div className="interview-container">
        <h2>Report Not Found</h2>
        <p>The requested interview report could not be found.</p>
      </div>
    )
  }

  const getQuestionsData = () => {
    return activeSection === 'technical' 
      ? report.technicalQuestions 
      : report.behavioralQuestions
  }

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'low':
        return 'low'
      case 'medium':
        return 'medium'
      case 'high':
        return 'high'
      default:
        return 'low'
    }
  }

  const getSeverityLabel = (severity) => {
    return severity.charAt(0).toUpperCase() + severity.slice(1)
  }

  return (
    <div className="interview-container">
      {/* Top Navbar */}
      <nav className="interview-navbar">
        <button 
          className="navbar-logo"
          onClick={() => navigate('/')}
          aria-label="Go to home"
        >
          <span className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </span>
          <span className="logo-text">InterviewAI</span>
        </button>
      </nav>

      {/* Mobile Header */}
      <div className="mobile-header">
        <button 
          className="hamburger-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className="mobile-score-display">
          <div className="score-circle">
            <svg className="score-svg" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="95"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                opacity="0.1"
              />
              <circle
                cx="100"
                cy="100"
                r="95"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 95 * (report.matchScore / 100)} ${2 * Math.PI * 95}`}
                transform="rotate(-90 100 100)"
                className="score-progress"
              />
            </svg>
            <div className="score-text">
              <span className="score-value">{report.matchScore}</span>
              <span className="score-label">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-menu-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Left Sidebar - Sections */}
      <aside className={`interview-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-section">
          <h3 className="sidebar-title">Sections</h3>
          <div className="section-buttons">
            <button
              className={`section-btn ${activeSection === 'technical' ? 'active' : ''}`}
              onClick={() => {
                setActiveSection('technical')
                setIsMobileMenuOpen(false)
              }}
            >
              Technical Questions
            </button>
            <button
              className={`section-btn ${activeSection === 'behavioral' ? 'active' : ''}`}
              onClick={() => {
                setActiveSection('behavioral')
                setIsMobileMenuOpen(false)
              }}
            >
              Behavioral Questions
            </button>
            <button
              className={`section-btn ${activeSection === 'roadmap' ? 'active' : ''}`}
              onClick={() => {
                setActiveSection('roadmap')
                setIsMobileMenuOpen(false)
              }}
            >
              Roadmap
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="interview-main">
        <div className="main-content">
          {activeSection === 'roadmap' ? (
            <div className="roadmap-section">
              <div className="roadmap-header">
                <h2>7-Day Preparation Roadmap</h2>
                <p className="roadmap-subtitle">Complete these tasks to bridge your skill gaps</p>
              </div>
              {report.PreparationPlan && report.PreparationPlan.length > 0 ? (
                <div className="roadmap-timeline">
                  {report.PreparationPlan.map((plan, index) => (
                    <div key={index} className="roadmap-day">
                      <div className="roadmap-day-header">
                        <div className="day-badge">Day {plan.day}</div>
                        <h3 className="day-title">{plan.focus}</h3>
                      </div>

                      <div className="roadmap-content">
                        <div className="roadmap-section-block">
                          <h4 className="block-title">Tasks</h4>
                          <ul className="tasks-list">
                            {plan.tasks.map((task, idx) => (
                              <li key={idx}>
                                <span className="bullet"></span>
                                {task}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-preparation-state">
                  <p>No preparation plan available yet.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="questions-section">
              <h2 className="section-heading">
                {activeSection === 'technical' ? 'Technical Questions' : 'Behavioral Questions'}
              </h2>
              <div className="questions-list">
                {getQuestionsData().map((item, index) => (
                  <div
                    key={index}
                    className={`question-card ${expandedIndex === index ? 'expanded' : ''}`}
                  >
                    <div
                      className="question-header"
                      onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    >
                      <div className="question-content">
                        <h3 className="question-text">{item.question}</h3>
                        <p className="question-intention">{item.intention}</p>
                      </div>
                      <div className="expand-icon">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>
                    </div>
                    {expandedIndex === index && (
                      <div className="question-answer">
                        <p>{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Right Sidebar - Score & Skills */}
      <aside className="interview-right-sidebar">
        {/* Match Score - Desktop only */}
        <div className="score-box desktop-score-box">
          <h3 className="score-title">Match Score</h3>
          <div className="score-circle">
            <svg className="score-svg" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="95"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                opacity="0.1"
              />
              <circle
                cx="100"
                cy="100"
                r="95"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 95 * (report.matchScore / 100)} ${2 * Math.PI * 95}`}
                transform="rotate(-90 100 100)"
                className="score-progress"
              />
            </svg>
            <div className="score-text">
              <span className="score-value">{report.matchScore}</span>
              <span className="score-label">%</span>
            </div>
          </div>
        </div>

        {/* Skill Gaps */}
        <div className="skills-box">
          <h3 className="skills-title">Skill Gaps</h3>
          <div className="skills-list">
            {report.skillGap.map((item, index) => (
              <div key={index} className={`skill-item skill-${getSeverityColor(item.severity)}`}>
                <div className="skill-header">
                  <span className="skill-name">{item.skill}</span>
                  <span className={`skill-badge badge-${getSeverityColor(item.severity)}`}>
                    {getSeverityLabel(item.severity)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  )
}

export default Interview