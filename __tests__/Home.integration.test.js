import { render, fireEvent } from '@testing-library/react-native';
import Home from '../screens/Home';
import axios from 'axios';

jest.mock('axios');

// Mock Image to handle source prop correctly
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

  RN.Image = (props) => {
    const { source } = props;
    if (typeof source === 'number') {
      return <img alt="" />;
    } else if (typeof source === 'object' && source.uri) {
      return <img src={source.uri} alt="" />;
    }
    return null;
  };

  return RN;
});

describe('Home Screen Integration Tests', () => {
  beforeEach(() => {
    axios.get.mockClear();
  });

  it('loads and displays courses after selecting a category', async () => {
    // Mock API responses for categories and courses
    axios.get.mockImplementation((url) => {
      if (url.includes('/categories')) {
        return Promise.resolve({
          data: [
            { categoryId: 'math', categoryName: 'Math' },
            { categoryId: 'science', categoryName: 'Science' },
          ],
        });
      } else if (url.includes('/courses')) {
        return Promise.resolve({
          data: [
            {
              courseId: 1,
              courseName: 'Mathematics 101',
              grade: 'A',
              price: 100,
              rating: 4.5,
              numReviews: 120,
              image: { uri: 'https://example.com/image1.jpg' },
            },
            {
              courseId: 2,
              courseName: 'Advanced Math',
              grade: 'A',
              price: 150,
              rating: 4.7,
              numReviews: 95,
              image: { uri: 'https://example.com/image2.jpg' },
            },
          ],
        });
      }
    });

    const { findAllByText, findByText } = render(<Home navigation={{ navigate: jest.fn() }} />);

    // Wait for categories to load
    const mathElements = await findAllByText('Math');
    expect(mathElements.length).toBeGreaterThan(0); 

    // Simulate selecting the first "Math" category element
    fireEvent.press(mathElements[0]);

    // Wait for courses to load after selecting category
    const mathCourse1 = await findByText('Mathematics 101');
    const mathCourse2 = await findByText('Advanced Math');

    // Verify that the courses are displayed
    expect(mathCourse1).toBeTruthy();
    expect(mathCourse2).toBeTruthy();
  });

  it('loads and displays teachers after selecting a category', async () => {
    // Mock API responses for categories and teachers
    axios.get.mockImplementation((url) => {
      if (url.includes('/categories')) {
        return Promise.resolve({
          data: [
            { categoryId: 'math', categoryName: 'Math' },
            { categoryId: 'science', categoryName: 'Science' },
          ],
        });
      } else if (url.includes('/teachers')) {
        return Promise.resolve({
          data: [
            {
              teacherId: 1,
              fullName: 'John Doe',
              photo: { uri: 'https://example.com/photo1.jpg' },
              courseName: 'Mathematics 101',
              grade: 'Senior Two',
              rating: 4.8,
              numReviews: 150,
            },
            {
              teacherId: 2,
              fullName: 'Jane Smith',
              photo: { uri: 'https://example.com/photo2.jpg' },
              courseName: 'Physics Basics',
              grade: 'Senior One',
              rating: 4.9,
              numReviews: 200,
            },
          ],
        });
      }
    });

    const { findAllByText, findByText } = render(<Home navigation={{ navigate: jest.fn() }} />);

    // Wait for categories to load
    const mathElements = await findAllByText('Math');
    expect(mathElements.length).toBeGreaterThan(0); 

    // Simulate selecting the first "Math" category element
    fireEvent.press(mathElements[0]);

    // Wait for teachers to load after selecting category
    const teacher1 = await findByText('John Doe');
    const teacher2 = await findByText('Jane Smith');

    // Verify that the teachers are displayed
    expect(teacher1).toBeTruthy();
    expect(teacher2).toBeTruthy();
  });
});