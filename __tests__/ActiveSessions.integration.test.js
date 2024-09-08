import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ActiveSessions from '../tabs/ActiveSessions'; 
import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';
import { DeviceEventEmitter } from 'react-native';

jest.mock('axios');

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve('mock-token')),
}));

jest.mock('react-native-audio', () => ({
  AudioRecorder: {
    startRecording: jest.fn(),
    stopRecording: jest.fn(() => Promise.resolve('mocked_file_path')), 
    prepareRecordingAtPath: jest.fn(),
  },
  AudioUtils: {
    DocumentDirectoryPath: 'mocked_directory_path',
  },
}));

describe('ActiveSessions Component - Integration Test', () => {
  const mockSessionData = [
    {
      sessionId: 1,
      courseName: 'Math Tutoring',
      grade: 'Senior One',
      fullName: 'John Doe',
      date: '2024-09-09',
      startTime: '14:00',
      endTime: '15:00',
      location: 'Home',
      image: 'image-url',
      recording: false,
    },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockSessionData });
    jest.clearAllMocks();
  });

  test('fetches and displays session data, handles recording interaction', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <ActiveSessions />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Math Tutoring')).toBeTruthy(); 
      expect(getByText('Senior One')).toBeTruthy();    
      expect(getByText(/Teacher:\s*John Doe/i)).toBeTruthy();  
      expect(getByText(/Location:\s*Home/i)).toBeTruthy();   
    });

    const recordButton = getByText('Record');
    fireEvent.press(recordButton);

    fireEvent.press(recordButton); 

    axios.post.mockResolvedValueOnce({ status: 200 });
  });
    

  test('handles session cancellation and updates the UI', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <ActiveSessions />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Math Tutoring')).toBeTruthy();
    });

    const cancelButton = getByText('Cancel');
    fireEvent.press(cancelButton);

    const confirmCancelButton = getByText('Yes, Cancel');
    fireEvent.press(confirmCancelButton);

    axios.post.mockResolvedValueOnce({ status: 200 });

    axios.get.mockResolvedValueOnce({ data: [] });

    DeviceEventEmitter.emit('updateCancelledSessions');

    await waitFor(() => {
      expect(getByText('No active sessions currently.')).toBeTruthy();
    });
  });
});