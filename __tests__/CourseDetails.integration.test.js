import { render, waitFor, fireEvent } from '@testing-library/react-native';
import CourseDetails from '../screens/CourseDetails';
import axios from 'axios';
import config from '../config';

jest.mock('axios');

describe('CourseDetails Integration Tests', () => {
  const mockCourseData = {
    courseId: 1,
    courseName: 'Mathematics',
    grade: 'Senior One',
    price: 200,
    rating: 4.5,
    numReviews: 120,
    image: 'https://example.com/image1.jpg',
  };

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockCourseData });
  });

  it('displays course data and handles user interactions correctly', async () => {
    const navigateMock = jest.fn();
    const goBackMock = jest.fn();
    
    const { getAllByText, getByText, getByTestId } = render(
      <CourseDetails 
        route={{ params: { courseId: 1 }}} 
        navigation={{ navigate: navigateMock, goBack: goBackMock }} 
      />
    );

    const loadingElements = getAllByText('Loading...');
    expect(loadingElements.length).toBeGreaterThan(0);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(`${config.API_URL}/api/courses/1`);
      expect(getByText('Mathematics | Senior One')).toBeTruthy();
      expect(getByText('¥200/h')).toBeTruthy();
      expect(getByText('4.5')).toBeTruthy();
      expect(getByText('(120 reviews)')).toBeTruthy();
    });

    fireEvent.press(getByTestId('back-button'));
    expect(goBackMock).toHaveBeenCalled();

    fireEvent.press(getByText('Mathematics | Senior One'));
    expect(navigateMock).toHaveBeenCalledWith('CourseDescription', { courseId: 1 });

    fireEvent.press(getByText('Teaching Staff'));
    expect(navigateMock).toHaveBeenCalledWith('AllTeacherProfiles');

    fireEvent.press(getByText('Buy Now'));
    expect(navigateMock).toHaveBeenCalledWith('CourseDetailsAddItem', { courseId: 1 });
  });
});