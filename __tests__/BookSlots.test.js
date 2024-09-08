import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import BookSlots from '../screens/BookSlots';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';

jest.mock('axios');
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
}));

describe('BookSlots Screen', () => {
  const mockTeacherData = {
    photo: 'https://example.com/photo.jpg',
  };

  const mockSlots = [
    { slotId: 1, startTime: '10:00', endTime: '11:00', location: 'Room 101' },
    { slotId: 2, startTime: '11:00', endTime: '12:00', location: 'Room 102' },
  ];

  beforeEach(() => {
    AsyncStorage.getItem.mockResolvedValue('mocked-token');
    axios.get.mockResolvedValue({ data: mockTeacherData });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the initial UI components correctly', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <BookSlots 
          route={{ params: { teacherId: 1, fullName: 'John Doe' } }} 
          navigation={{ navigate: jest.fn(), goBack: jest.fn() }} 
        />
      </NavigationContainer>
    );

    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('Select a date')).toBeTruthy();
    expect(getByText('Select a slot')).toBeTruthy();
    expect(getByText('Select the location')).toBeTruthy();
  });

  it('fetches and displays teacher details', async () => {
    const mockNavigation = {
      navigate: jest.fn(),
      goBack: jest.fn(),
    };

    const { getByText, getByTestId } = render(
      <NavigationContainer>
        <BookSlots 
          route={{ params: { teacherId: 1, fullName: 'John Doe' } }} 
          navigation={mockNavigation}
        />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(`${config.API_URL}/api/teachers/1`, expect.anything());
      
      const avatar = getByTestId('avatar');
      expect(avatar.props.source.uri).toBe(`${config.API_URL}/https://example.com/photo.jpg`);
      
      expect(getByText('John Doe')).toBeTruthy();
    });
  });
});