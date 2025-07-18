# Simple Record Requirements

## Functional Requirements

### FR-001: Single Panel Recording
- **Description**: Record video from one webcam panel at a time
- **Acceptance Criteria**:
  - Record button available in each webcam panel
  - Only one panel can record simultaneously
  - Recording state isolated per panel
- **Priority**: High

### FR-002: Basic Recording Controls
- **Description**: Simple start/stop recording interface
- **Acceptance Criteria**:
  - Red circle button to start recording
  - Red square button to stop recording
  - Visual feedback during recording (timer)
- **Priority**: High

### FR-003: Video Download
- **Description**: Download recorded video file
- **Acceptance Criteria**:
  - Automatic download trigger on stop
  - Standard video format (WebM or MP4)
  - Meaningful filename with timestamp
- **Priority**: High

### FR-004: Recording Duration Display
- **Description**: Show elapsed time during recording
- **Acceptance Criteria**:
  - Timer updates every second
  - Format: "XXs" (e.g., "15s")
  - Positioned left of record button
- **Priority**: Medium

## Non-Functional Requirements

### NFR-001: Browser Compatibility
- **Description**: Works in modern browsers
- **Requirements**:
  - Chrome 88+, Firefox 85+, Safari 14.1+
  - MediaRecorder API support detection
  - Graceful fallback message for unsupported browsers
- **Priority**: High

### NFR-002: Basic Performance
- **Description**: Recording doesn't impact app performance
- **Requirements**:
  - No visible lag during recording
  - Memory usage reasonable for 30+ second videos
  - Clean resource cleanup on stop
- **Priority**: Medium

### NFR-003: Error Handling
- **Description**: Handle common recording errors
- **Requirements**:
  - Permission denied message
  - MediaRecorder failure recovery
  - User-friendly error messages
- **Priority**: Medium

## Technical Requirements

### TR-001: MediaRecorder API
- **Description**: Use native MediaRecorder for recording
- **Requirements**:
  - WebM format as primary
  - MP4 fallback if available
  - Basic error handling
- **Priority**: High

### TR-002: State Management
- **Description**: Use existing Jotai recording atoms
- **Requirements**:
  - Leverage existing recording state structure
  - Minimal changes to current atoms
  - Clean state transitions
- **Priority**: High

### TR-003: Download Implementation
- **Description**: Browser-native download functionality
- **Requirements**:
  - Blob URL generation
  - Automatic download trigger
  - Proper cleanup after download
- **Priority**: High

## Out of Scope

### Explicitly Not Included
- Multi-panel recording
- Cloud storage or upload
- Replay system integration
- Advanced video formats
- Quality settings
- Export options beyond download
- Video editing features
- Recording history/persistence

## Success Criteria

### Primary Success Metrics
1. **Basic Functionality**: Record → Stop → Download works
2. **Browser Support**: Works in Chrome, Firefox, Safari
3. **User Experience**: Clear visual feedback, no confusion
4. **Reliability**: No crashes or memory leaks in 30s recordings

### Acceptance Test
1. Select webcam in panel
2. Click record button (turns red square)
3. Record for 10 seconds (timer shows)
4. Click stop button
5. Video file downloads automatically
6. File plays in video player

## Dependencies

### Required
- Existing webcam state management
- Camera permission system
- Recording state atoms (already implemented)
- Recording controls UI (already implemented)

### Browser APIs
- MediaRecorder API
- Blob API
- URL.createObjectURL
- HTMLAnchorElement download

## Constraints

### Technical Constraints
- Single panel recording only
- No server-side components
- Client-side only storage (temporary)
- Standard web video formats only

### Time Constraints
- 8 hour implementation limit
- Focus on core functionality only
- Minimal feature set

## Risk Assessment

### Low Risk
- MediaRecorder API widely supported
- Download functionality well-established
- Existing UI components ready

### Medium Risk
- Browser format compatibility
- Memory usage with longer recordings
- Error handling completeness

### Mitigation Strategies
- Feature detection for MediaRecorder
- Time limits on recording length
- Comprehensive error messaging