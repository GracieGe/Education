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

  it('opens the date picker and selects a date', async () => {
    const { getByText, getByTestId, queryByText, debug } = render(
      <NavigationContainer>
        <BookSlots 
          route={{ params: { teacherId: 1, fullName: 'John Doe' } }} 
          navigation={{ navigate: jest.fn(), goBack: jest.fn() }} 
        />
      </NavigationContainer>
    );

    debug();

    // Simulate pressing the "Select a date" button
    fireEvent.press(getByText('Select a date'));

    // Check if the date picker opens by checking for the "Close" button inside the modal
    await waitFor(() => {
      expect(queryByText('Close')).toBeTruthy();
    });

    // Simulate selecting a date in the date picker
    const selectedDate = '2023/09/10'; // Match the format used by your DatePicker
    fireEvent.press(getByText(selectedDate));

    // Verify that the selected date is displayed in the UI
    await waitFor(() => {
      expect(getByText(selectedDate)).toBeTruthy();
    });
  });

  it('fetches and displays available slots when a date is selected', async () => {
    axios.get.mockResolvedValueOnce({ data: mockSlots });

    const { getByText } = render(
      <NavigationContainer>
        <BookSlots 
          route={{ params: { teacherId: 1, fullName: 'John Doe' } }} 
          navigation={{ navigate: jest.fn(), goBack: jest.fn() }} 
        />
      </NavigationContainer>
    );

    // Simulate selecting a date
    fireEvent.press(getByText('Select a date'));
    fireEvent.press(getByText('2023/09/10')); // Date selection

    // Simulate opening the available slots dropdown
    fireEvent.press(getByText('Select a slot'));

    // Check if the available slots are displayed
    await waitFor(() => {
      expect(getByText('10:00 - 11:00')).toBeTruthy();
      expect(getByText('11:00 - 12:00')).toBeTruthy();
    });
  });

  it('submits the booking form successfully', async () => {
    axios.post.mockResolvedValueOnce({ status: 200 });
    axios.get.mockResolvedValueOnce({ data: { studentId: 1 } });

    const mockNavigation = {
      navigate: jest.fn(),
      goBack: jest.fn(),
    };

    const { getByText } = render(
      <NavigationContainer>
        <BookSlots 
          route={{ params: { teacherId: 1, fullName: 'John Doe' } }} 
          navigation={mockNavigation}
        />
      </NavigationContainer>
    );

    // Simulate selecting a date
    fireEvent.press(getByText('Select a date'));
    fireEvent.press(getByText('2023/09/10')); // Date selection

    // Simulate selecting a slot
    fireEvent.press(getByText('Select a slot'));
    fireEvent.press(getByText('10:00 - 11:00')); // Slot selection

    // Simulate submitting the form
    fireEvent.press(getByText('Submit'));

    // Wait for the submission to complete
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(2); // 1st for updating slot, 2nd for adding session
      expect(mockNavigation.goBack).toHaveBeenCalled();
    });
  });
});