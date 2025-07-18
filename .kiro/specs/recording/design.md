# Recording Implementation Design

## Overview
This document outlines the design for implementing webcam recording functionality in the Swing app. The implementation focuses on state management, component architecture, and integration with the existing multi-panel webcam system.

## Architecture

### State Management
The recording system uses Jotai atoms following the existing pattern in the codebase:

```typescript
// Core recording state per panel
type RecordingState = {
    isRecording: boolean;
    recordingDuration: number;
    recordedBlob: Blob | null;
    startTime: number | null;
};
```

**Atoms Structure:**
- `recordingStateAtomFamily(panelId)` - Core state atom for each panel
- `readRecordingStateAtom(panelId)` - Read-only accessor
- `startRecordingAtom(panelId)` - Action to start recording
- `stopRecordingAtom(panelId)` - Action to stop recording with optional blob
- `updateRecordingDurationAtom(panelId)` - Duration updates during recording

### Component Architecture

#### RecordingControls Component
- **Purpose**: Main orchestration component for recording UI
- **Props**: `panelId: string`, `className?: string`
- **Responsibilities**:
  - Connect to recording state atoms
  - Handle recording start/stop logic
  - Display recording duration
  - Layout recording button and timer

#### RecordingButton Component
- **Purpose**: Reusable button with recording states
- **Props**: `isRecording: boolean`, `onClick: () => void`, `className?: string`
- **States**:
  - **Not Recording**: Red circle icon, transparent background
  - **Recording**: Red square icon, red background
- **Dimensions**: Fixed `w-10 h-10` to match camera dropdown

### Integration Points

#### Webcam Panel Integration
- Recording controls positioned in top-right corner alongside camera dropdown
- Uses flexbox layout with consistent spacing
- Timer positioned left of button to prevent layout shift

#### Future Integration Points
- MediaRecorder API hook for actual recording
- Connection to replay system for playback
- Persistence layer for recorded videos

## Visual Design

### UI Layout
```
┌─────────────────────────────────────┐
│  [Status]              [Timer] [●] [📹] │
│                                     │
│           Webcam Feed               │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

### Color Scheme
- **Recording Button**: Red (#ef4444) for recording state
- **Timer Text**: Muted foreground color
- **Button States**: Transparent → Red background transition

### Responsive Behavior
- Controls maintain consistent dimensions across panel sizes
- Timer appears/disappears without affecting button position
- Layout remains stable during recording state changes

## Technical Decisions

### Why Jotai Atoms?
- Consistent with existing codebase patterns
- Per-panel state isolation using atomFamily
- Efficient re-renders through selective subscriptions
- Clean separation of read/write operations

### Component Separation
- **RecordingControls**: Business logic and state management
- **RecordingButton**: Pure UI component for reusability
- Clear separation of concerns for maintainability

### State Structure
- `recordingDuration` in milliseconds for precision
- `startTime` for accurate duration calculations
- `recordedBlob` as nullable for clean state transitions

## Performance Considerations

### Re-render Optimization
- Atomic state updates prevent unnecessary re-renders
- Timer updates isolated to specific components
- Button state changes don't trigger webcam re-renders

### Memory Management
- Blob cleanup on recording stop
- Duration timer cleanup on component unmount
- Proper atom disposal following Jotai patterns

## Accessibility

### Button States
- Clear visual indicators for recording state
- Consistent button dimensions for muscle memory
- Proper focus management

### Screen Reader Support
- Descriptive button labels
- Timer announcements for recording duration
- Status updates for recording state changes

## Future Enhancements

### Planned Features
1. **MediaRecorder Integration**: Actual video recording
2. **Replay System Connection**: Recorded video playback
3. **Export Options**: Save/download recorded videos
4. **Recording Quality Settings**: Resolution/bitrate controls

### Extensibility Points
- Recording state can be extended with quality settings
- Component props allow for custom styling
- Atom structure supports additional recording metadata

## Implementation Status

### ✅ Completed
- Recording state atom structure
- RecordingControls component
- RecordingButton component
- Webcam panel integration
- Visual design implementation

### 🔄 In Progress
- Documentation creation

### ⏳ Pending
- MediaRecorder hook implementation
- Replay system integration
- Video persistence layer