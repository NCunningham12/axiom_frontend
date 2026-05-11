import React, { useState, useEffect } from 'react';
import './AssignmentCreator.css';
import { Link, useNavigate } from 'react-router-dom';
import curriculum from '../curriculum';

const AssignmentCreator = () => {
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [expandedConcept, setExpandedConcept] = useState(null);
  const [assignmentSkills, setAssignmentSkills] = useState([]);
  const [assignmentType, setAssignmentType] = useState('standard');
  const [assignmentMetadata, setAssignmentMetadata] = useState({
    assignmentName: '',
    periods: 'all',
    folder: '',
    dueDate: '',
    acceptLate: false,
  });

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

  const handleMetadataChange = (event) => {
    const { name, value, type, checked } = event.target;

    setAssignmentMetadata((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleNextClick = () => {
    const problemsForAssignment = assignmentSkills.map((skill, index) => ({
      ...skill,
      id: index + 1,
      type: skill.slug,
      targetScore: skill.targetScore
    }));

    const assignmentData = {
      metadata: {
        ...assignmentMetadata,
        assignmentType,
      },
      problems: problemsForAssignment,
    };

    if (assignmentType === "skill") {
      console.log('Navigating with assignmentData:', assignmentData);
      navigate('/students/skill-assignment', {
        state: { assignment: assignmentData },
      });
    } else if (assignmentType === "standard") {
      console.log('Navigating with assignmentData:', assignmentData);
      navigate('/students/assignment', {
        state: { assignment: assignmentData },
      });
    } else {
      console.log("No assignment tyoe detected")
    }
  };

  const handleAssignmentTypeChange = (clickedType) => {
    if (clickedType === assignmentType) {
      return;
    }

    setAssignmentSkills([]);
    setAssignmentType(clickedType);
  };

  const handleSkillTargetChange = (index, value) => {
    setAssignmentSkills((prev) => 
      prev.map((skill, i) =>
        i === index
        ? {...skill, targetScore: Number(value)}
        : skill
      )
    );
  };

  const grade = '8th';
  const domains = curriculum[grade].domains;

  console.log(assignmentMetadata);

  return (
    <div className="ac-container">
      <h1 className="ac-title">Assignment Creator</h1>
      <div className="ac-top-section">
        <div className="type-toggle">
          <button
            className={assignmentType === 'standard' ? 'active' : 'disabled'}
            onClick={() => {
              handleAssignmentTypeChange('standard');
            }}
          >
            Standard Assignment
          </button>
          <button
            className={assignmentType === 'skill' ? 'active' : 'disabled'}
            onClick={() => {
              handleAssignmentTypeChange('skill');
            }}
          >
            Skill Assignment
          </button>
        </div>
        <div className="assignment-type-title">
          <h2>
            {assignmentType === 'standard' ? 'Standard' : 'Skill'} Assignment
          </h2>
        </div>
      </div>
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
                        {concept.skills.map((skill) => {
                          const alreadyAdded = assignmentSkills.some(
                            (existingSkill) =>
                              existingSkill.slug === skill.slug,
                          );
                          const isSkillMode = assignmentType === 'skill';
                          const shouldDisableButton =
                            isSkillMode && alreadyAdded;
                          return (
                            <li className="topic-li" key={skill.slug}>
                              <span>{skill.name}</span>
                              <button
                                className="add-btn"
                                disabled={shouldDisableButton}
                                onClick={() => {
                                  console.log(skill.name);

                                  if (isSkillMode && alreadyAdded) {
                                    return;
                                  }

                                  setAssignmentSkills((prev) => [
                                    ...prev,
                                    skill,
                                  ]);
                                }}
                              >
                                {shouldDisableButton ? 'Added' : 'Add'}
                              </button>
                            </li>
                          );
                        })}
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
                className="form-input"
                type="text"
                name="assignmentName"
                placeholder="Enter assignment name"
                value={assignmentMetadata.assignmentName}
                onChange={handleMetadataChange}
              />
            </div>

            <div className="ac-dropdown form-group">
              <label htmlFor="periods">Periods Assigned</label>
              <select
                id="periods"
                className="form-input"
                name="periods"
                value={assignmentMetadata.periods}
                onChange={handleMetadataChange}
              >
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
              <select
                id="folder"
                className="form-input"
                name="folder"
                value={assignmentMetadata.folder}
                onChange={handleMetadataChange}
              >
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
              <input
                id="due-date"
                className="form-input"
                type="date"
                name="dueDate"
                value={assignmentMetadata.dueDate}
                onChange={handleMetadataChange}
              />
            </div>

            {assignmentType === "skill" && assignmentSkills.map((skill, index) => (
              <div className="form-group" key={index}>
                <label>
                  {skill.name} Score Target
                </label>
                <input 
                  type="number"    
                  className="form-input"
                  name='targetScore'
                  value={skill.targetScore || ''}
                  onChange={(e) => handleSkillTargetChange(index, e.target.value)}
                />
              </div>
            ))}

            <div className="form-group checkbox-group">
              <label>
                <input
                  id="acceptLate"
                  type="checkbox"
                  name="acceptLate"
                  value={assignmentMetadata.acceptLate}
                  onChange={handleMetadataChange}
                />
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
