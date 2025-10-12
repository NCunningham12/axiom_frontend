import React, { useState, useEffect } from 'react';
import './AssignmentCreator.css';
import { Link, useNavigate } from 'react-router-dom';

const AssignmentCreator = () => {
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [expandedSubdomain, setExpandedSubdomain] = useState(null);
  const [assignmentTopics, setAssignmentTopics] = useState([]);

  const navigate = useNavigate();

  // Reset expanded subdomain when the domain changes
  useEffect(() => {
    setExpandedSubdomain(null);
  }, [selectedDomain]);

  const handleRemove = (indexToRemove) => {
    setAssignmentTopics((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleNextClick = () => {
    const topicsWithIds = assignmentTopics.map((topic, index) => ({
      id: index + 1,
      type: topic,
    }));

    console.log('Navigating with assignmentTopics:', topicsWithIds);
    navigate('/assignment-editor', { state: { problems: topicsWithIds } });
  };

  // Sample placeholder data
  const domains = [
    {
      id: 1,
      name: 'Algebra',
      subdomains: [
        {
          id: 101,
          name: 'Linear Equations',
          topics: ['One-Step', 'Two-Step', 'Word Problems'],
        },
        {
          id: 102,
          name: 'Inequalities',
          topics: ['Graphing', 'Solving', 'Compound'],
        },
      ],
    },
    {
      id: 2,
      name: 'Geometry',
      subdomains: [
        { id: 201, name: 'Angles', topics: ['Acute', 'Right', 'Obtuse'] },
      ],
    },
  ];

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
            // === SUBDOMAIN DROPDOWNS SCREEN ===
            <div>
              <button
                className="back-button"
                onClick={() => setSelectedDomain(null)}
              >
                ← Back to Domains
              </button>
              <h2 className="domain-name">{selectedDomain.name}</h2>
              <div className="topic-wrapper">
                {selectedDomain.subdomains.map((sub) => (
                  <div
                    key={sub.id}
                    style={{ margin: '10px 0' }}
                    className="topic-card"
                  >
                    <button
                      className="sub-button"
                      onClick={() =>
                        setExpandedSubdomain((prev) =>
                          prev === sub.id ? null : sub.id
                        )
                      }
                    >
                      {sub.name}
                    </button>

                    {expandedSubdomain === sub.id && (
                      <ul>
                        {sub.topics.map((topic) => (
                          <li className="topic-li" key={topic}>
                            <span>{topic}</span>
                            <button
                              className="add-btn"
                              onClick={() => {
                                console.log(topic);
                                setAssignmentTopics((prev) => [...prev, topic]);
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
            {assignmentTopics.map((topic, index) => (
              <div key={index} className="question-card">
                <span>{topic}</span>
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

export default AssignmentCreator;
