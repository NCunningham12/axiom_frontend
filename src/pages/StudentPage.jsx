import React from 'react';

const StudentPage = () => {
    return (
        <div className='student-page-container'>
            <div className="student-page-wrapper">
                <div className="student-page-title-section">
                    <h1 className="student-page-title">Student Page</h1>
                </div>
                <div className="student-page-body">
                    <div className="assignment-name"></div>
                    <div className="periods-assigned"></div>
                    <div className="due-date"></div>
                </div>
            </div>
        </div>
    );
}

export default StudentPage;
