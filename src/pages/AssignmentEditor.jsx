import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './AssignmentEditor.css';

const AssignmentEditor = () => {
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [problems, setProblems] = useState([]);

  const location = useLocation();
  
  useEffect(() => {
    console.log('location.state:', location.state);
    if (location.state?.problems) {
      setProblems(location.state.problems);
      console.log('Loaded problems into state:', location.state.problems);
    }
  }, [location.state]);

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
                  {problem.type}
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
                <strong>Type:</strong> {selectedProblem.type}
              </p>
              {/* You can swap this for a dynamic component later */}
            </div>
          ) : (
            <p>Select a problem to edit</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentEditor;
