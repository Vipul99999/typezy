# Typezy Software Requirements Specification (SRS)

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification defines the functional and non-functional requirements for Typezy, a multilingual typing practice Progressive Web App focused on fast access, accurate scoring, useful analytics, and local-first privacy.

### 1.2 Product Overview
Typezy is a frontend-first typing improvement platform that helps users practice typing, measure performance, analyze mistakes, and improve over time without requiring signup. The product supports multiple languages, works offline for core flows, and stores user progress locally on the device.

### 1.3 Goals
- Provide instant typing practice with zero signup friction
- Deliver accurate, trustworthy typing metrics
- Support five launch languages well
- Offer analytics that help users improve meaningfully
- Provide installable PWA behavior and offline core functionality
- Maintain strong UX across desktop and mobile

### 1.4 Intended Audience
- Product owners
- Designers
- Frontend engineers
- QA testers
- Future contributors and maintainers

## 2. Scope

### 2.1 In Scope
- Public marketing and SEO pages
- Practice experience for multiple typing modes
- Result screen and analytics dashboard
- Local settings and session persistence
- PWA manifest, offline fallback, and install support
- Export/import of local user data
- Multilingual content system

### 2.2 Out of Scope
- Mandatory user accounts
- Cloud sync in V1
- Paid plans and subscriptions
- Leaderboards and classroom features in V1
- Server-side personal data storage

## 3. Product Positioning

### 3.1 One-Line Positioning
Typezy is a fast, SEO-friendly, installable typing practice PWA with multilingual support, deep analytics, and zero-signup friction.

### 3.2 Product Promise
Practice typing beautifully, improve meaningfully, and keep everything fast and simple.

## 4. User Classes

### 4.1 Primary Users
- Students
- Job and exam aspirants
- Developers
- Office professionals
- Productivity-focused users

### 4.2 Secondary Users
- Bilingual users in India
- Casual daily practice users
- Teachers and training centers in future phases

## 5. Assumptions and Dependencies

### 5.1 Assumptions
- Users have a modern browser with JavaScript enabled
- IndexedDB and localStorage are available in most target environments
- The app will be deployed over HTTPS in production

### 5.2 Dependencies
- Next.js
- React
- Zustand
- Tailwind CSS
- Recharts
- Framer Motion
- Browser support for PWA features, local storage, and service workers

## 6. Supported Platforms

- Desktop browsers: latest Chrome, Edge, Firefox, Safari
- Mobile browsers: latest Chrome on Android, Safari on iPhone, Samsung Internet
- Installed PWA mode on supported browsers

## 7. Language Support

### 7.1 Launch Languages
- English
- Hindi
- Spanish
- French
- German

### 7.2 Language Requirements
- Each language must provide structured content packs
- Typing comparison must be grapheme-aware
- Hindi must support Devanagari display and fair grapheme-level comparison
- Language-specific content should include words, sentences, quotes, punctuation, numbers, and code where supported

## 8. Functional Requirements

### 8.1 Public Pages
The system shall provide:
- Home page
- Features page
- Languages page
- About page
- Privacy page
- SEO landing pages

### 8.2 Practice Page
The system shall:
- Let users start without signup
- Support language selection
- Support difficulty selection
- Support view selection: Text, Test, Practice
- Support modes including time, words, quote, numbers, punctuation, custom, code, zen, and adaptive where available
- Allow quick restart and quick mode changes
- Show a stable prompt that does not unexpectedly change after typing starts
- Maintain accurate progress and completion logic in every mode
- Keep the typing UI focused and readable on mobile and desktop

### 8.3 Typing Session Engine
The system shall:
- Initialize a session with a unique session identifier
- Track typed input, caret progression, timing, and keystrokes
- Compare input against prompt content using grapheme-aware logic
- Track correct, incorrect, extra, and missed characters
- Track backspaces and per-key error behavior
- Compute gross WPM, net WPM, accuracy, consistency, and error rate
- Support early finish behavior where relevant
- Produce a trusted session result immediately on completion

### 8.4 Result Experience
The system shall:
- Show immediate results after session completion
- Display core metrics clearly
- Show pace-over-time data
- Show weak keys and weak words where available
- Offer a fast retry option
- Provide a path to analytics or the detailed result page

### 8.5 Analytics Dashboard
The system shall:
- Show recent performance summaries
- Show trends over time
- Show language-wise progress
- Show mode-wise performance
- Show weak keys and recommendations
- Display session history and records
- Support streaks and achievement-style motivational indicators

### 8.6 Settings
The system shall:
- Support light, dark, and system theme behavior
- Support font and visual preferences
- Support sound effect preference
- Support layout/view preferences
- Persist settings locally
- Allow export of local data
- Allow import of validated local data
- Allow reset of local progress

### 8.7 Persistence
The system shall:
- Use localStorage for lightweight preferences and metadata
- Use IndexedDB for session history and larger analytics data
- Work without a backend database in the launch version
- Persist progress locally across sessions on the same device

### 8.8 Export and Import
The system shall:
- Export stored sessions as JSON
- Validate imported JSON strictly before use
- Reject malformed files
- Reject oversized files
- Reject invalid session shapes
- Normalize valid imported data before storage

### 8.9 PWA
The system shall:
- Provide a valid web manifest
- Support service worker registration in production
- Cache only approved shell and static assets
- Provide an offline fallback page
- Support install behavior on supported platforms

### 8.10 SEO
The system shall:
- Generate static or server-rendered SEO-friendly pages
- Provide language and intent-based landing pages
- Provide sitemap and robots support
- Use per-page metadata and Open Graph data

## 9. Non-Functional Requirements

### 9.1 Performance
- Initial page load should feel fast on typical broadband/mobile connections
- Typing input latency shall be imperceptible in normal use
- Prompt rendering shall remain stable while typing
- Large content libraries shall not break the practice experience

### 9.2 Reliability
- Result metrics shall be deterministic from session data
- The app shall not lose current-session state during normal interaction
- Offline fallback shall continue to work for the app shell

### 9.3 Security
- The app shall validate imported files strictly
- The app shall reject malformed or unexpected imported data
- The app shall apply browser security headers
- The app shall avoid over-broad service-worker caching
- The app shall not require storage of personal user data in V1

### 9.4 Usability
- The practice experience shall feel calm before typing, invisible during typing, and rewarding after typing
- The UI shall remain readable in light and dark mode
- The app shall remain usable on desktop and mobile screen sizes

### 9.5 Accessibility
- Important controls shall remain keyboard accessible
- Contrast shall remain readable in both themes
- Focus states shall be visible
- Text sizing shall remain legible on smaller screens
- Color shall not be the only signal for status where possible

### 9.6 Maintainability
- Content shall be stored in structured language packs
- Core logic shall be separated by concerns: typing, analytics, storage, content
- New languages and content packs shall be addable without major architecture changes

## 10. Data Requirements

### 10.1 Session Record
Each session record shall include:
- Session ID
- Completion timestamp
- Language
- Mode
- Duration
- Prompt metadata
- Metrics summary
- Pace points
- Weak keys
- Weak words
- Keystroke summary

### 10.2 Settings Data
Settings shall include:
- Theme preference
- Preferred language
- Preferred mode
- Difficulty preference
- Visual and sound preferences

### 10.3 Content Data
Content shall be organized by:
- Language
- Difficulty
- Content type

Content types shall include:
- Words
- Sentences
- Quotes
- Punctuation
- Numbers
- Code

## 11. View Mode Requirements

### 11.1 Text Mode
- Must minimize chrome and distractions
- Must emphasize a long, stable reading lane
- Must keep metrics lightweight

### 11.2 Test Mode
- Must emphasize measurement and strict completion feel
- Must present performance metrics more clearly
- Must make result transition feel immediate and definitive

### 11.3 Practice Mode
- Must be more coaching-oriented
- Must support friendlier cues and next-step guidance
- Must emphasize skill-building over strict test framing

## 12. Content Requirements

### 12.1 Content Scale
The product shall support large content libraries per language and difficulty.

### 12.2 Content Quality
Content should:
- Feel human-readable and natural
- Avoid obvious duplication
- Avoid repetitive synthetic tone
- Reflect difficulty progression
- Include realistic short and medium-length material

### 12.3 Difficulty Progression
The product shall support:
- Beginner
- Intermediate
- Advanced

Each difficulty level should influence:
- Prompt complexity
- Vocabulary difficulty
- Sentence structure
- Punctuation density

## 13. Analytics Requirements

The system shall provide:
- Gross WPM
- Net WPM
- Accuracy
- Consistency
- Error count
- Extra characters
- Missed characters
- Backspace count
- Pace timeline
- Weak keys
- Weak words
- Session history
- Best scores
- Streak tracking
- Recommendations for next practice

## 14. Trust Requirements

The system shall ensure:
- Prompt content does not unexpectedly change after session start
- Progress indicators reflect actual completion state
- Word targets are only counted when truly completed
- Result state is shown immediately after completion
- Users can clearly tell whether they are idle, typing, or finished

## 15. Deployment Requirements

- The system shall build successfully for production
- The system shall be deployable to modern frontend hosting platforms
- Production deployment shall run over HTTPS
- PWA files shall be served correctly

## 16. Testing Requirements

The project shall include:
- Unit tests for scoring and import validation
- Unit tests for prompt and progress logic
- Tests for content library availability
- Build verification
- Lint verification

Recommended manual QA shall include:
- Desktop practice flow
- Mobile practice flow
- Theme switching
- Offline fallback behavior
- Import/export behavior
- PWA install verification

## 17. Future Requirements

Potential later additions:
- Daily challenge
- Advanced adaptive drills
- Optional cloud sync
- Teacher or classroom features
- Social sharing
- More languages

## 18. Acceptance Criteria Summary

Typezy shall be considered ready for release when:
- Practice sessions are stable and trustworthy in all supported modes
- Results appear immediately and correctly
- Themes are visually consistent across major pages
- Local save, export, and import work safely
- PWA shell and offline fallback work in production
- SEO pages are generated and accessible
- Tests, lint, and production build all pass
