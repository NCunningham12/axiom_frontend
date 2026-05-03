import React, { useState, useEffect } from 'react';
import './AssignmentCreator.css';
import { Link, useNavigate } from 'react-router-dom';
import curriculum from '../curriculum';

const AssignmentCreator = () => {
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [expandedConcept, setExpandedConcept] = useState(null);
  const [assignmentSkills, setAssignmentSkills] = useState([]);

  const navigate = useNavigate();

  // Reset expanded concept when the domain changes
  useEffect(() => {
    setExpandedConcept(null);
  }, [selectedDomain]);

  const handleRemove = (indexToRemove) => {
    setAssignmentSkills((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleNextClick = () => {
    const skillsWithIds = assignmentSkills.map((skill, index) => ({
      ...skill,
      id: index + 1,
    }));

    console.log('Navigating with assignmentSkills:', skillsWithIds);
    navigate('/teachers/assignment-editor', {
      state: { problems: skillsWithIds },
    });
  };

  const grade = '8th';
  const domains = curriculum[grade].domains;

  return (
    <div className="ac-container">
      <h1 className="ac-title">Assignment Creator</h1>
      <div className="ac-content-wrapper">
        <div className="ac-left-side ac-panel">
          {!selectedDomain ? (
            // === DOMAIN LIST SCREEN ===
            <div className="domain-screen">
              <h2 className="select-domain">Select a Domain</h2>
              {domains.map((domain) => (
                <button
                  className="domain-btn"
                  key={domain.id}
                  onClick={() => setSelectedDomain(domain)}
                  style={{ display: 'block', margin: '10px 0' }}
                >
                  {domain.name}
                </button>
              ))}
            </div>
          ) : (
            // === CONCEPT DROPDOWNS SCREEN ===
            <div className="concept-accordian">
              <button
                className="back-button"
                onClick={() => setSelectedDomain(null)}
              >
                ← Back to Domains
              </button>
              <h2 className="domain-name">{selectedDomain.name}</h2>
              <div className="topic-wrapper">
                {selectedDomain.concepts.map((concept) => (
                  <div
                    key={concept.id}
                    style={{ margin: '10px 0' }}
                    className="topic-card"
                  >
                    <button
                      className="sub-button"
                      onClick={() =>
                        setExpandedConcept((prev) =>
                          prev === concept.id ? null : concept.id,
                        )
                      }
                    >
                      {concept.name}
                    </button>

                    {expandedConcept === concept.id && (
                      <ul>
                        {concept.skills.map((skill) => (
                          <li className="topic-li" key={skill.slug}>
                            <span>{skill.name}</span>
                            <button
                              className="add-btn"
                              onClick={() => {
                                console.log(skill.name);
                                setAssignmentSkills((prev) => [...prev, skill]);
                              }}
                            >
                              Add
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="ac-middle ac-panel">
          <h2 className="ac-preview-title">Assignment Preview</h2>
          <div className="assignment-list">
            {assignmentSkills.map((skill, index) => (
              <div key={index} className="question-card">
                <span>{skill.name}</span>
                <button
                  className="remove-btn"
                  onClick={() => handleRemove(index)}
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="ac-right-side ac-panel">
          <h2 className="ac-preview-title">Assignment Overview</h2>

          <form className="assignment-form">
            <div className="form-group">
              <label htmlFor="assignment-name">Assignment Name</label>
              <input
                id="assignment-name"
                type="text"
                name="assignmentName"
                placeholder="Enter assignment name"
              />
            </div>

            <div className="ac-dropdown form-group">
              <label htmlFor="periods">Periods Assigned</label>
              <select id="periods" name="periods">
                <option value="all">All Periods</option>
                <option value="period1">Period 1</option>
                <option value="period2">Period 2</option>
                <option value="period3">Period 3</option>
                <option value="period4">Period 4</option>
                <option value="period5">Period 5</option>
                <option value="period6">Period 6</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="folder">Folder</label>
              <select id="folder" name="folder">
                <option value="">Select a folder</option>
                <option value="unit-1">Unit 1</option>
                <option value="unit-2">Unit 2</option>
                <option value="review">Review</option>
                <option value="test-prep">Test Prep</option>
                <option value="new-folder">Create New Folder</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="due-date">Due Date</label>
              <input id="due-date" type="date" name="dueDate" />
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input type="checkbox" name="acceptLate" />
                Accept late submissions?
              </label>
            </div>
          </form>

          <div className="right-btn-wrapper">
            <button className="next-btn right-btn" onClick={handleNextClick}>
              Next
            </button>
            <button className="cancel-btn right-btn">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentCreator;
