import React from 'react';
import './AssignmentList.css'

const AssignmentList = () => {
    return (
        <div className='assignment-list-container'>
            <div className="assignment-list-wrapper">
                <div className="assignment-list-title-section">
                    <h1 className="assignment-list-title">Assignments</h1>
                </div>
                <div className="assignment-list-body">
                    <div className="assignment-list"></div>
                </div>
            </div>
        </div>
    );
}

export default AssignmentList;
