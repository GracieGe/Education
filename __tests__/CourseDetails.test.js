import { render, waitFor } from '@testing-library/react-native';
import CourseDetails from '../screens/CourseDetails';
import axios from 'axios';
import config from '../config';

jest.mock('axios');

describe('CourseDetails Screen', () => {
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

  it('renders loading state initially', () => {
    const { getAllByText } = render(<CourseDetails route={{ params: { courseId: 1 }}} navigation={{ navigate: jest.fn(), goBack: jest.fn() }} />);
    const loadingElements = getAllByText('Loading...');
    expect(loadingElements.length).toBeGreaterThan(0); 
  });

  it('fetches and displays course data', async () => {
    const { getByText, getByRole } = render(<CourseDetails route={{ params: { courseId: 1 }}} navigation={{ navigate: jest.fn(), goBack: jest.fn() }} />);

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith(`${config.API_URL}/api/courses/1`));
    await waitFor(() => expect(getByText('Mathematics | Senior One')).toBeTruthy());
    await waitFor(() => expect(getByText('¥200/h')).toBeTruthy());
    await waitFor(() => expect(getByText('4.5')).toBeTruthy());
    await waitFor(() => expect(getByText('(120 reviews)')).toBeTruthy());
  });
});