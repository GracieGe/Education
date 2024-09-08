export const AudioRecorder = {
    startRecording: jest.fn(),
    stopRecording: jest.fn(() => Promise.resolve('mocked_file_path')),
    prepareRecordingAtPath: jest.fn(),
    onProgress: jest.fn(),
    onFinished: jest.fn(),
  };
  
  export const AudioUtils = {
    DocumentDirectoryPath: 'mocked_directory_path',
  };