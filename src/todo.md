# Axiom TODO List

---

## 🔥 Priority Fixes & Bugs

- [x] Consolidate Traditional/Skills Assignment Creator Page
- [x] Fix nested exponents input
- [ ] Fix "Your Answer" updating onChange instead of onSubmit
- [ ] Separate draft answers from persisted submitted answers
- [ ] Audit consistency between frontend and backend scoring
- [ ] Audit completion percentage calculations

---

## 🎨 Assignment Page Visual Overhaul

### General Layout

- [ ] Remove competing gradients and excessive shadows
- [ ] Adopt consistent Axiom green background
- [ ] Implement clean white rounded cards
- [ ] Implement constrained, centered workspace
- [ ] Establish consistent spacing and typography
- [ ] Consolidate assignment title and question header
- [ ] Increase mathematical expression readability
- [ ] Preserve flexible workspace for future problem types
  - Graphs
  - Geometry
  - Tables
  - Multi-part questions
- [ ] Rename individual Submit button to "Check Answer"

### Question Navigation

- [ ] Replace circular question buttons with rounded rectangles
- [ ] Implement muted semantic status colors
  - Neutral: Unanswered
  - Green: Correct
  - Red: Incorrect
- [ ] Add correctness icons alongside colors
- [ ] Implement distinct active-question outline
- [ ] Accommodate assignments containing 30–50+ questions
- [ ] Implement accessible keyboard navigation and focus states

### Assignment Progress Sidebar

- [ ] Replace existing sidebar with StudentPage-inspired card
- [ ] Add "Assignment progress" heading
- [ ] Display completion percentage
- [ ] Display completion progress bar
- [ ] Display attempted question count
- [ ] Display score and time spent side by side
- [ ] Display correct and incorrect question counts
- [ ] Add submission readiness section
- [ ] Display "Not ready to submit yet" when ineligible
- [ ] Display remaining submission requirements
- [ ] Display "Ready to submit!" when eligible
- [ ] Reveal prominent green Submit Assignment button when eligible
- [ ] Relocate Unsubmit & Edit action to appropriate sidebar state

### Previous Answer Display

- [ ] Remove floating previous-answer badge
- [ ] Relocate previous answer beneath answer input
- [ ] Integrate previous answer with inline feedback
- [ ] Update previous answer only after successful persistence
- [ ] Hide previous-answer display for unanswered questions
- [ ] Preserve previous submitted answer while editing draft

---

## ⚡ Answer Feedback & Navigation

### Correct Answers

- [ ] Replace blocking correctness modal with nonblocking notification
- [ ] Reduce notification duration
  - Initial target: 700–1000ms
  - Refine through student testing
- [ ] Immediately advance after successful answer persistence
- [ ] Decouple automatic navigation from notification animation
- [ ] Identify which question the notification refers to
- [ ] Update question navigation status immediately
- [ ] Update assignment progress immediately
- [ ] Handle final-question completion gracefully
- [ ] Prevent duplicate answer submissions during persistence

### Incorrect Answers

- [ ] Remove disruptive incorrect-answer modal
- [ ] Keep student on current question
- [ ] Implement constructive inline feedback
- [ ] Record incorrect status immediately upon first incorrect answer
- [ ] Count incorrect questions toward assignment completion
- [ ] Allow student to navigate away without exhausting retries
- [ ] Provide grace attempts before revealing correct work
- [ ] Display remaining attempts
- [ ] Persist remaining attempts across navigation and refresh
- [ ] Reveal worked solution after attempts are exhausted
- [ ] Prevent copying revealed answer for credit
- [ ] Provide equivalent recovery problem

### Worked Solutions

- [ ] Design reusable worked-solution component
- [ ] Display student's submitted answer
- [ ] Display correct answer
- [ ] Display step-by-step mathematical work
- [ ] Explain relevant mathematical rule or concept
- [ ] Provide mistake-specific instructional feedback where possible
- [ ] Add "Try a Similar Problem" button
- [ ] Support variable-length explanations
- [ ] Support future graphical and geometric explanations

---

## 🧮 Scoring & Question Status Refactor

### Remove Partial Correctness

- [ ] Remove "Partially Correct" question status
- [ ] Standardize question statuses
  - Unanswered
  - Correct
  - Incorrect
- [ ] Remove partial correctness from skill validators
- [ ] Remove partial correctness from frontend status logic
- [ ] Remove partial correctness from backend validation
- [ ] Remove partial-credit calculation from existing scoring logic
- [ ] Update database status definitions
- [ ] Determine migration strategy for existing partial-credit records
- [ ] Remove obsolete partial-correctness styles
- [ ] Remove obsolete partial-correctness feedback messages

### Scoring Architecture

- [ ] Separate question correctness from earned credit
- [ ] Separate completion percentage from assignment score
- [ ] Separate assignment submission from completion
- [ ] Implement teacher-adjustable incorrect-answer penalties
- [ ] Implement teacher-adjustable point recovery
- [ ] Support full credit recovery
- [ ] Support recovery with retained penalties
- [ ] Support disabled credit recovery
- [ ] Ensure penalties cannot produce negative question credit
- [ ] Recalculate assignment score after recovery
- [ ] Ensure teacher score views reflect persisted results

---

## 🔄 Equivalent Problem & Recovery System

- [ ] Design equivalent-problem generation architecture
- [ ] Generate recovery problems assessing the same mathematical concept
- [ ] Maintain comparable difficulty between original and recovery problems
- [ ] Preserve original assignment problem
- [ ] Persist generated recovery problems
- [ ] Associate recovery problems with original question number
- [ ] Preserve complete answer history
- [ ] Track incorrect attempts per problem
- [ ] Track recovery attempts
- [ ] Track whether worked solution has been revealed
- [ ] Restore active recovery problem after refresh
- [ ] Restore recovery state after navigating away
- [ ] Prevent recovery from increasing assignment question count
- [ ] Prevent revealed original answers from earning credit
- [ ] Apply teacher-defined recovery scoring policy
- [ ] Preserve recovery history in submitted assignment review
- [ ] Preserve recovery state after unsubmission

---

## 📤 Assignment Submission Refactor

- [ ] Remove permanently visible top-right Submit Assignment button
- [ ] Move Submit Assignment into progress sidebar
- [ ] Require all questions to be attempted before submission
- [ ] Count both correct and incorrect answers as attempted
- [ ] Do not require exhaustion of grace attempts before submission
- [ ] Implement teacher-defined minimum correctness requirement
- [ ] Default minimum correctness requirement to 0%
- [ ] Communicate teacher requirements from beginning of assignment
- [ ] Reveal submission button only when requirements are satisfied
- [ ] Display message beneath Check Answer when ready
  - "All questions done! Submit your assignment."
- [ ] Display unmet correctness requirements when applicable
- [ ] Enforce submission requirements in backend
- [ ] Update existing submission confirmation modal
- [ ] Remove obsolete incomplete-submission warning
- [ ] Preserve explicit student submission workflow
- [ ] Preserve To Do / Completed separation
- [ ] Preserve read-only review mode
- [ ] Preserve Unsubmit & Edit functionality
- [ ] Verify submission success notification

---

## 🏗️ Skill Architecture Refactor

- [ ] Define standardized skill contract
- [ ] Rewrite Product of Powers as reference implementation
- [ ] Ensure skills remain independent of assignment type

### Required Skill Capabilities

- [ ] generateProblem()
  - Generate mathematical problem data
- [ ] renderProblem()
  - Render problem and appropriate answer controls
- [ ] validateAnswer()
  - Determine binary correctness
  - Provide diagnostic information when applicable
- [ ] explainProblem()
  - Provide structured worked-solution data
- [ ] generateEquivalentProblem()
  - Generate comparable recovery problem

### Shared Assignment Infrastructure

- [ ] Centralize scoring outside individual skill files
- [ ] Centralize attempt limits
- [ ] Centralize recovery policies
- [ ] Centralize feedback presentation
- [ ] Centralize persistence
- [ ] Centralize automatic navigation
- [ ] Centralize submission eligibility
- [ ] Define consistent problem data structure
- [ ] Define consistent validation result structure
- [ ] Define consistent explanation data structure
- [ ] Validate reference implementation before expanding skill library

---

## ⚙️ Assignment Creator Improvements

- [ ] Consolidate assignment creation interface
- [ ] Implement assignment-type selection
- [ ] Implement type-specific configuration options
- [ ] Add answer and scoring settings section

### Standard Assignment Settings

- [ ] Minimum percentage correct required for submission
- [ ] Number of attempts before revealing worked solution
- [ ] Incorrect-answer point penalty
- [ ] Credit recovery policy
- [ ] Equivalent problem recovery limits, if applicable
- [ ] Provide clear descriptions of each setting
- [ ] Display example scoring outcomes
- [ ] Persist assignment settings in database
- [ ] Apply settings consistently during student attempts

---

## 📚 Assignment Types

### Standard Assignment

Purpose: Structured learning and practice

- [x] Persistent assignment problems
- [x] Finite assignment length
- [x] Persistent student answers
- [x] Persistent assignment progress
- [x] Explicit assignment submission
- [x] Read-only submitted assignment review
- [x] Unsubmit and resume editing
- [ ] Improved immediate feedback
- [ ] Grace attempts
- [ ] Worked solutions
- [ ] Equivalent recovery problems
- [ ] Teacher-adjustable scoring
- [ ] Teacher-adjustable submission requirements

### Skill Assignment

Purpose: Mastery through repetition

- [ ] Implement dynamic problem generation workflow
- [ ] Design SmartScore-style mastery algorithm
- [ ] Implement point gains for correct answers
- [ ] Implement point losses for incorrect answers
- [ ] Implement mastery targets
- [ ] Determine difficulty progression
- [ ] Persist mastery score and student progress
- [ ] Implement skill-specific progress interface
- [ ] Define skill assignment completion criteria
- [ ] Define skill assignment submission behavior
- [ ] Implement appropriate feedback and explanations

### Test Mode

Purpose: Independent assessment

- [ ] Implement Test Mode assignment type
- [ ] Reuse persistent standard assignment problems
- [ ] Persist student answers without immediate feedback
- [ ] Suppress correctness indicators during assessment
- [ ] Suppress visible score during assessment
- [ ] Disable worked solutions during assessment
- [ ] Disable equivalent recovery problems during assessment
- [ ] Prevent correctness data from being exposed prematurely
- [ ] Implement teacher-controlled result visibility
  - Results available after submission
  - Results withheld
- [ ] Define test review behavior
- [ ] Define test unsubmission and retake policies
- [ ] Implement test-specific Assignment Creator settings

---

## 🗄️ Backend & Database

- [ ] Audit assignment settings schema
- [ ] Add submission requirement fields
- [ ] Add attempt limit fields
- [ ] Add scoring penalty fields
- [ ] Add recovery policy fields
- [ ] Design answer history persistence
- [ ] Design recovery problem persistence
- [ ] Preserve original assignment problem data
- [ ] Persist active problem version
- [ ] Persist solution-revealed state
- [ ] Persist retry and recovery counts
- [ ] Update answer persistence endpoints
- [ ] Update scoring calculations
- [ ] Update submission eligibility validation
- [ ] Preserve transactional consistency
- [ ] Preserve protection against duplicate attempts
- [ ] Preserve protection against editing completed assignments
- [ ] Ensure frontend and backend scoring remain consistent

---

## ♿ Accessibility

- [ ] Maintain WCAG AA contrast targets
- [ ] Use readable primary text sizes (16px or larger)
- [ ] Increase mathematical expression readability
- [ ] Ensure superscripts remain legible
- [ ] Use generous interactive target sizes (approximately 44px)
- [ ] Never communicate correctness through color alone
- [ ] Implement visible keyboard focus indicators
- [ ] Maintain logical keyboard tab order
- [ ] Support keyboard-based answer submission
- [ ] Manage focus during automatic question navigation
- [ ] Add descriptive screen-reader labels
- [ ] Announce answer feedback to assistive technology
- [ ] Announce assignment readiness changes
- [ ] Respect reduced-motion preferences
- [ ] Audit MathLive accessibility
- [ ] Test keyboard-only assignment completion
- [ ] Test screen-reader assignment completion
- [ ] Conduct accessibility audit before production

---

## 🧪 Testing & Validation

### Assignment Lifecycle Regression Testing

- [ ] Verify answer persistence
- [ ] Verify progress persistence
- [ ] Verify score persistence
- [ ] Verify timer persistence
- [ ] Verify explicit submission
- [ ] Verify read-only review
- [ ] Verify unsubmission
- [ ] Verify editing resumes correctly
- [ ] Verify review time does not count toward working time

### New Behavior Testing

- [ ] Verify immediate navigation after correct answers
- [ ] Verify nonblocking success notification
- [ ] Verify previous answer does not change while typing
- [ ] Verify first incorrect answer counts toward completion
- [ ] Verify grace attempts persist after refresh
- [ ] Verify grace attempts persist after navigation
- [ ] Verify worked solution appears at correct attempt limit
- [ ] Verify equivalent problem persistence
- [ ] Verify recovery scoring
- [ ] Verify teacher-defined penalties
- [ ] Verify minimum correctness requirements
- [ ] Verify submission button appears only when eligible
- [ ] Verify backend rejects ineligible submission
- [ ] Verify concurrent requests do not corrupt progress
- [ ] Verify completed assignments cannot be edited through API

### Student Usability Testing

- [ ] Test redesigned interface with Ava and Andrew
- [ ] Test sidebar submission discoverability
- [ ] Test completion messaging beneath Check Answer
- [ ] Test correctness notification duration
- [ ] Test question navigation intuitiveness
- [ ] Test previous-answer display
- [ ] Test grace-attempt messaging
- [ ] Test worked-solution comprehension
- [ ] Test equivalent problem recovery workflow
- [ ] Refine interface based on observed student behavior

---

## 📄 Pages To Add

- [ ] Default NavBar
- [ ] About Page
- [ ] AssignmentEditor.jsx transition
- [ ] ClassManagement.jsx
- [ ] AnalyticsDashboard.jsx
- [ ] Free Practice Page
- [ ] Parent's Landing Page
- [ ] Login.jsx
- [ ] AdminDashboard.jsx
- [ ] Teacher Help & How-To Page
- [ ] Test Mode interface

---

## 📖 Teacher Help & How-To Page

- [ ] Design teacher-facing documentation interface
- [ ] Explain three assignment types
- [ ] Implement approved assignment-type overview card

### Approved Overview Card Design

- [ ] Single rounded card with subtle border
- [ ] Three vertically stacked assignment-type rows
- [ ] Thin horizontal dividers between rows
- [ ] Rounded pastel icon tiles
- [ ] Bold assignment-type headings
- [ ] Muted educational-purpose subtitles
- [ ] Concise assignment descriptions

### Standard Assignment

- Green icon tile: #e1f3e7
- Green clipboard-list icon: #23643e
- Subtitle: Structured learning and practice
- Description:
  Persistent questions, finite assignment length,
  immediate feedback, worked solutions, credit recovery,
  and explicit submission.

### Skill Assignment

- Blue icon tile: #e5edf9
- Blue target icon: #315c96
- Subtitle: Mastery through repetition
- Description:
  Dynamically generated problems, SmartScore-style
  progression, point gains and losses, and mastery targets.

### Test Mode

- Purple icon tile: #eee8f8
- Purple file-check icon: #69469b
- Subtitle: Independent assessment
- Description:
  Persistent questions, no immediate correctness feedback,
  and teacher-controlled release of results.

### Additional Documentation

- [ ] Explain completion vs. correctness vs. submission
- [ ] Explain grace attempts
- [ ] Explain point penalties
- [ ] Explain credit recovery
- [ ] Explain submission requirements
- [ ] Explain mastery scoring
- [ ] Explain test result visibility
- [ ] Provide assignment creation walkthroughs

---

## 🚀 Future Features

- [ ] Global Dark Mode Toggle
- [ ] Actual authentication and authorization
- [ ] Teacher-facing student answer history
- [ ] Teacher-facing remediation analytics
- [ ] Multi-part mathematical problems
- [ ] Independently assessed answer fields
- [ ] Graphing problem support
- [ ] Geometry problem support
- [ ] Table-based problem support
- [ ] Expand mathematical skill library
- [ ] Responsive desktop/tablet/mobile layouts

### Teacher Student View
- [ ] Teacher Student Preview mode with isolated practice data.
- [ ] Allow teachers to experience assignments and instructional feedback as a generic student.
- [ ] View as Specific Student functionality.
- [ ] Restrict specific student selection to the teacher's enrolled students.
- [ ] Display actual student assignments, progress, answers, scores, and remediation opportunities.
- [ ] Make specific student viewing read-only by default.
- [ ] Persistent student-view banner identifying the current viewing mode and student.
- [ ] Exit Student View button to return to the teacher interface.
- [ ] Separate authenticated identity from student viewing context.
- [ ] Repurpose existing StudentSwitcher infrastructure rather than removing it.
- [ ] Enforce teacher permissions and student data protection on the backend.

---

## 🖌️ UI Polish

- [ ] Navbar improvements
- [ ] Assignment Creator cleanup
- [ ] Standardize visual language across pages
- [ ] Standardize button styles
- [ ] Standardize card styles
- [ ] Standardize semantic status colors
- [ ] Standardize typography hierarchy
- [ ] Standardize modal styling
- [ ] Standardize notification styling
- [ ] Standardize spacing and border radii

---

## 🤔 Outstanding Design Decisions

- [ ] Finalize default number of grace attempts
  - Proposed: 2 total attempts before solution reveal
- [ ] Finalize default incorrect-answer penalty
  - Proposed: No penalty
- [ ] Finalize default credit recovery policy
  - Proposed: Full credit recovery
- [ ] Finalize equivalent recovery attempt limits
  - Proposed: Unlimited recovery opportunities
- [ ] Define exact penalty calculation rules
- [ ] Define penalty behavior across recovery problems
- [ ] Finalize database architecture for problem versions
- [ ] Finalize database architecture for answer history
- [ ] Determine migration of existing partial-credit records
- [ ] Determine behavior when all questions are attempted
      but some remain eligible for remediation
- [ ] Finalize Skill Assignment mastery algorithm
- [ ] Finalize Test Mode result release and review policies

---

## ✅ Completed Milestones

### Student Assignment Dashboard

- [x] StudentPage redesign
- [x] To Do / Completed tabs
- [x] Current Assignments column
- [x] Past Due column
- [x] Assignment progress cards
- [x] Assignment status badges
- [x] Start / Continue / Review Assignment actions

### Standard Assignment Infrastructure

- [x] Persistent generated problems
- [x] Database-backed student attempts
- [x] Persistent individual answers
- [x] Persistent assignment score
- [x] Persistent assignment progress
- [x] Time Spent logic
- [x] Submit Assignment button
- [x] Submission confirmation modal
- [x] Completed assignment review mode
- [x] Unsubmit & Edit workflow
- [x] Unsubmit confirmation modal
- [x] MathLive read-only support
- [x] Resume timer after unsubmission
- [x] Duplicate attempt prevention
- [x] StudentSwitcher and StudentContext
- [x] Standard assignment lifecycle testing
- [x] Commit and push working assignment lifecycle

---

## 💚 Core Design Principles

- Accessibility before aesthetics.
- Clarity before complexity.
- Professional, not infantilizing.
- Correctness is binary. Feedback doesn't have to be.
- Correct answers encourage momentum.
- Incorrect answers encourage understanding.
- Completion, correctness, and submission are independent.
- Grace attempts are remediation, not deferred grading.
- Question correctness and earned credit are independent.
- Skills remain agnostic of assignment type.
- Standard assignments facilitate structured learning.
- Skill assignments facilitate mastery.
- Test Mode facilitates independent assessment.
- Student testing informs UX decisions.
- Build the architecture correctly before expanding the skill library.
- Make it right, not merely make it work.
