import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
// editors
import PythagSolvingEditor from '../components/editors/PythagSolvingEditor';
import PoPEditor from '../components/editors/PoPEditor';
// generators
import generatorMap from '../utils/generators/generatorMap';
import { generateProductOfPowers } from '../utils/generators/exponents/productOfPowers.js';

import './AssignmentEditor.css';

const AssignmentEditor = () => {
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [problems, setProblems] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('location.state:', location.state);
    if (location.state?.problems) {
      setProblems(location.state.problems);
      console.log('Loaded problems into state:', location.state.problems);
    }
  }, [location.state]);

  const renderEditor = (type) => {
    switch (type) {
      case 'Solving PT':
        return <PythagSolvingEditor />;
      case 'Exponent Rules (Product of Powers)':
        return <PoPEditor />;
      default:
        return (
          <div style={{ color: '#999' }}>
            ⚠️ No editor available for this type.
          </div>
        );
    }
  };

  // Next Button
  const handleNext = () => {
    console.log(generatorMap);
    const generatedProblems = problems
      .map((prob) => {
        const generatorFunc = generatorMap[prob.slug];
        if (!generatorFunc) {
          console.warn(`❌ Missing generator for slug: ${prob.slug}`);
          return null;
        }
        return generatorFunc(); // generate problem object
      })
      .filter(Boolean); // strips out nulls (bad types)

    const newAssignment = {
      title: '',
      topic: '',
      type: '',
      problems: generatedProblems,
    };

    navigate('/assignment', { state: { assignment: newAssignment } });
  };

  return (
    <div className="editor-container">
      <h1 className="ae-title">Assignment Editor</h1>
      <div className="editor-wrapper">
        <div className="problem-list">
          <ol>
            {problems.length > 0 ? (
              problems.map((problem, index) => (
                <li
                  key={problem.id}
                  onClick={() => setSelectedProblem(problem)}
                  style={{
                    fontWeight:
                      selectedProblem?.id === problem.id ? 'bold' : 'normal',
                    color:
                      selectedProblem?.id === problem.id ? 'darkred' : 'white',
                    cursor: 'pointer',
                  }}
                >
                  {problem.name}
                </li>
              ))
            ) : (
              <li>No problems loaded.</li>
            )}
          </ol>
        </div>
        <div className="editor-pane">
          <h2>Editor Pane</h2>
          {selectedProblem ? (
            <div>
              <p>
                <strong>ID:</strong> {selectedProblem.id} <br />
                <strong>Name:</strong> {selectedProblem.name}
              </p>
              <div className="editor-inner-pane">
                {renderEditor(selectedProblem.name)}
              </div>
            </div>
          ) : (
            <p>Select a problem to edit</p>
          )}
          <button className="next" onClick={handleNext}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentEditor;
