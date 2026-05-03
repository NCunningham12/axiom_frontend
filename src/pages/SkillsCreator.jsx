import React, { useState, useEffect } from 'react';
import './SkillsCreator.css';
import { Link, useNavigate } from 'react-router-dom';
import curriculum from '../curriculum';

const SkillsCreator = () => {
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
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleNextClick = () => {
    const skillsWithIds = assignmentSkills.map((skill, index) => ({
      ...skill,
      id: index + 1,
    }));

    console.log('Navigating with assignmentSkills:', skillsWithIds);
    navigate('/teachers/skills-editor', { state: { problems: skillsWithIds } });
  };

  const handleAddSkill = (skill) => {
    setAssignmentSkills((prev) => {
      const alreadyAdded = prev.some((existingSkill) => existingSkill.slug === skill.slug);

      if (alreadyAdded) {
        return prev;
      }

      return [...prev, skill];
    })
  }

  const grade = '8th';
  const domains = curriculum[grade].domains;

  return (
    <div className="sc-container">
      <h1 className="sc-title">Skills Assignment Creator</h1>
      <div className="sc-content-wrapper">
        <div className="sc-left-side sc-panel">
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
            <div>
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
                          prev === concept.id ? null : concept.id
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
                                handleAddSkill(skill);
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
        <div className="ac-right-side ac-panel">
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

export default SkillsCreator;

