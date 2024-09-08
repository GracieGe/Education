import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import ActiveSessions from '../tabs/ActiveSessions'; 
import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';

jest.mock('axios');

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve('mock-token')),
}));

jest.mock('react-native-audio');

describe('ActiveSessions Component - Unit Tests', () => {
  test('fetches and displays session data correctly', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
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
      ],
    });

    const { getByText, queryByText } = render(
      <NavigationContainer>
        <ActiveSessions />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Math Tutoring')).toBeTruthy(); 
      expect(getByText('Senior One')).toBeTruthy();     
      expect(getByText(/Teacher:\s*John Doe/i)).toBeTruthy();  
      expect(queryByText(/Location:\s*Home/i)).toBeTruthy(); 
    });
  });

  test('displays empty state when no sessions are available', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    const { getByText } = render(
      <NavigationContainer>
        <ActiveSessions />
      </NavigationContainer>
    );

    await waitFor(() => expect(getByText('No active sessions currently.')).toBeTruthy());
  });
});