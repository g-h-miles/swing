# Simple Record Tasks

## Task Overview
Simple 8-hour implementation: Record webcam → Download video file

## Task 1: MediaRecorder Hook (4 hours)

### Task 1.1: Basic MediaRecorder Hook
- **Status**: ⏳ Pending
- **Description**: Create simple MediaRecorder wrapper hook
- **Deliverables**:
  - [ ] `useSimpleRecorder` hook
  - [ ] Start/stop recording functions
  - [ ] Basic error handling
  - [ ] Blob generation on stop
- **Files to Create**: `src/lib/hooks/use-simple-recorder.ts`
- **Acceptance Criteria**:
  - Hook manages MediaRecorder lifecycle
  - Returns recording blob on stop
  - Handles permission and format errors
  - Integrates with existing recording atoms

### Task 1.2: Stream Integration  
- **Status**: ⏳ Pending
- **Description**: Connect MediaRecorder to webcam stream
- **Deliverables**:
  - [ ] Extract video stream from webcam component
  - [ ] Pass stream to MediaRecorder
  - [ ] Handle stream errors
- **Files to Modify**: `src/components/recording-controls.tsx`
- **Dependencies**: Task 1.1
- **Acceptance Criteria**:
  - Records video from selected webcam
  - Maintains video quality
  - Handles stream interruptions

## Task 2: Download Functionality (2 hours)

### Task 2.1: Download Manager
- **Status**: ⏳ Pending  
- **Description**: Create video download utility
- **Deliverables**:
  - [ ] Blob to download URL conversion
  - [ ] Automatic download trigger
  - [ ] Filename generation with timestamp
  - [ ] Cleanup after download
- **Files to Create**: `src/lib/utils/download-video.ts`
- **Acceptance Criteria**:
  - Downloads work in Chrome/Firefox/Safari
  - Meaningful filenames (e.g., "recording-2024-01-15-10-30.webm")
  - Proper resource cleanup

### Task 2.2: Download Integration
- **Status**: ⏳ Pending
- **Description**: Connect download to recording stop
- **Deliverables**:
  - [ ] Auto-download on recording stop
  - [ ] Download state feedback
  - [ ] Error handling for download failures
- **Files to Modify**: `src/components/recording-controls.tsx`
- **Dependencies**: Task 2.1
- **Acceptance Criteria**:
  - Download triggered immediately on stop
  - User sees download progress/completion
  - Graceful handling of download errors

## Task 3: Error Handling & Polish (2 hours)

### Task 3.1: Error States
- **Status**: ⏳ Pending
- **Description**: Implement comprehensive error handling
- **Deliverables**:
  - [ ] Permission denied handling
  - [ ] MediaRecorder not supported
  - [ ] Recording failure recovery
  - [ ] User-friendly error messages
- **Files to Create**: `src/lib/utils/recording-errors.ts`
- **Dependencies**: Task 1.1
- **Acceptance Criteria**:
  - Clear error messages for users
  - Graceful fallbacks where possible
  - No silent failures

### Task 3.2: Browser Compatibility
- **Status**: ⏳ Pending
- **Description**: Ensure cross-browser functionality
- **Deliverables**:
  - [ ] MediaRecorder feature detection
  - [ ] Format fallback (WebM → MP4)
  - [ ] Browser-specific workarounds
- **Files to Modify**: `src/lib/hooks/use-simple-recorder.ts`
- **Dependencies**: Task 1.1
- **Acceptance Criteria**:
  - Works in Chrome 88+, Firefox 85+, Safari 14.1+
  - Appropriate fallback messages
  - Format selection based on browser support

## Task Dependencies

```
Task 1.1 (MediaRecorder Hook)
    ↓
Task 1.2 (Stream Integration)
    ↓
Task 2.1 (Download Manager)
    ↓
Task 2.2 (Download Integration)
    ↓
Task 3.1 (Error States) & Task 3.2 (Browser Compatibility)
```

## Implementation Notes

### Existing Components (No Changes Needed)
- ✅ `RecordingControls` - UI orchestration
- ✅ `RecordingButton` - Visual button states  
- ✅ Recording state atoms - State management
- ✅ Webcam integration - Already positioned

### New Components Required
- `useSimpleRecorder` hook
- `downloadVideo` utility
- `recordingErrors` utility

### Testing Strategy
- Manual testing in Chrome, Firefox, Safari
- Test with different webcam sources
- Test recording durations (10s, 30s, 60s)
- Test error scenarios (permission denied, etc.)

## Success Criteria

### Task 1 Complete
- [ ] Can start recording from webcam
- [ ] Recording state updates correctly
- [ ] Timer shows elapsed time
- [ ] Recording stops and produces blob

### Task 2 Complete  
- [ ] Blob converts to downloadable file
- [ ] Download triggers automatically
- [ ] File plays in video player
- [ ] Filename includes timestamp

### Task 3 Complete
- [ ] Error messages are user-friendly
- [ ] Works across target browsers
- [ ] Handles edge cases gracefully
- [ ] No memory leaks or crashes

## Timeline

- **Task 1**: 4 hours (MediaRecorder implementation)
- **Task 2**: 2 hours (Download functionality)  
- **Task 3**: 2 hours (Error handling & polish)
- **Total**: 8 hours

## Next Steps After Completion

1. **Test thoroughly** across browsers and scenarios
2. **Document learnings** for future complex recording system
3. **Create new spec** for swing detection system
4. **Consider** what components can be reused for the bigger system

## Out of Scope Reminders

- No multi-panel recording
- No replay system integration
- No cloud storage
- No advanced video settings
- No recording history/persistence
- No video editing features

Focus only on: Record → Stop → Download