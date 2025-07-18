# Simple Record Design

## Overview
Basic webcam recording functionality: click record → capture video → click stop → download file.

## Architecture

### State Management
Simplified recording state using existing Jotai atoms:

```typescript
type RecordingState = {
    isRecording: boolean;
    recordingDuration: number;
    recordedBlob: Blob | null;
    startTime: number | null;
};
```

**Key Atoms (from existing work):**
- `readRecordingStateAtom(panelId)` - Read recording state
- `startRecordingAtom(panelId)` - Start recording
- `stopRecordingAtom(panelId)` - Stop recording with blob

### Component Architecture

#### RecordingControls (existing)
- **Purpose**: UI orchestration for recording
- **Responsibilities**:
  - Start/stop recording
  - Display timer
  - Trigger download on stop

#### RecordingButton (existing) 
- **Purpose**: Visual record/stop button
- **States**: Red circle (ready) → Red square (recording)

### New Components Needed

#### DownloadManager
- **Purpose**: Handle video file downloads
- **Responsibilities**:
  - Create download URL from blob
  - Trigger browser download
  - Cleanup blob URLs

## Technical Implementation

### MediaRecorder Integration
Simple MediaRecorder wrapper:
```typescript
const useSimpleRecorder = (stream: MediaStream, panelId: string) => {
    // Basic start/stop recording
    // Update recording atoms
    // Return blob on stop
};
```

### Download Flow
1. Recording stops → blob created
2. Generate download URL
3. Trigger browser download
4. Cleanup resources

## Constraints

### Single Panel Only
- Only one panel can record at a time
- Simpler state management
- No sync complexity

### Basic Error Handling
- Permission denied
- MediaRecorder not supported
- Recording failure

### No Persistence
- No replay system integration
- No cloud storage
- Direct download only

## Visual Design

### Recording States
- **Idle**: Red circle button
- **Recording**: Red square button + timer
- **Stopping**: Brief loading state
- **Complete**: Download triggered

### Layout
```
┌─────────────────────────────────────┐
│  [Status]              [Timer] [●] [📹] │
│                                     │
│           Webcam Feed               │
│                                     │
└─────────────────────────────────────┘
```

## Success Criteria
- Record 10+ second video
- Download works in Chrome/Firefox/Safari
- Clean UI feedback
- No memory leaks
- Handles basic errors gracefully