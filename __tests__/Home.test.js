import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import Home from '../screens/Home';
import axios from 'axios';

// Mock axios for API calls
jest.mock('axios');

describe('Home Screen', () => {
  const mockCategories = [
    { categoryId: 'all', categoryName: 'All' },
    { categoryId: 'math', categoryName: 'Math' },
    { categoryId: 'science', categoryName: 'Science' },
  ];

  const mockCourses = [
    {
      courseId: 1,
      courseName: 'Mathematics 101',
      grade: 'A',
      price: 100,
      rating: 4.5,
      numReviews: 120,
      image: 'path/to/image',
    },
    {
      courseId: 2,
      courseName: 'Physics Basics',
      grade: 'B',
      price: 80,
      rating: 4.0,
      numReviews: 90,
      image: 'path/to/image',
    },
  ];

  const mockTeachers = [
    {
      teacherId: 1,
      fullName: 'John Doe',
      photo: 'path/to/photo',
      courseName: 'Physics Basics',
      grade: 'B',
      rating: 4.0,
      numReviews: 90,
    },
    {
      teacherId: 2,
      fullName: 'Jane Smith',
      photo: 'path/to/photo',
      courseName: 'Mathematics 101',
      grade: 'A',
      rating: 4.5,
      numReviews: 120,
    },
  ];

  beforeEach(() => {
    axios.get.mockImplementation((url) => {
      if (url.includes('/categories')) {
        return Promise.resolve({ data: mockCategories });
      } else if (url.includes('/courses')) {
        return Promise.resolve({ data: mockCourses });
      } else if (url.includes('/teachers')) {
        return Promise.resolve({ data: mockTeachers });
      }
    });
  });

  it('renders correctly', async () => {
    const { getAllByText, findAllByText, getByText } = render(<Home navigation={{ navigate: jest.fn() }} />);
  
    // Check if loading text appears
    const loadingElements = getAllByText('Loading...');
    expect(loadingElements.length).toBeGreaterThan(0); 
  
    // Wait for categories to load
    await waitFor(() => {
      const mathElements = getAllByText('Math');
      expect(mathElements.length).toBeGreaterThan(0); 
    });
  
    // Check if category buttons render
    const allElements = await findAllByText('All');
    expect(allElements.length).toBeGreaterThan(0); 
  
    const scienceElements = await findAllByText('Science');
    expect(scienceElements.length).toBeGreaterThan(0); 
  
    // Wait for courses and teachers to load
    const mathCourseElements = await findAllByText('Mathematics 101');
    expect(mathCourseElements.length).toBeGreaterThan(0); 
  
    const physicsCourseElements = await findAllByText('Physics Basics');
    expect(physicsCourseElements.length).toBeGreaterThan(0); 
  
    // Check for teachers
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('Jane Smith')).toBeTruthy();
  });

  it('handles category selection', async () => {
    const { getByText, getAllByText, findAllByText } = render(<Home navigation={{ navigate: jest.fn() }} />);
  
    // Wait for categories to load
    const mathElements = await findAllByText('Math');
    expect(mathElements.length).toBeGreaterThan(0);
  
    // Simulate category selection
    const mathCategory = mathElements[0];
    fireEvent.press(mathCategory);
  });

  it('navigates to the search screen when search bar is pressed', () => {
    const navigateMock = jest.fn();
    const { getByPlaceholderText } = render(<Home navigation={{ navigate: navigateMock }} />);

    const searchInput = getByPlaceholderText('Search');
    fireEvent.press(searchInput);

    expect(navigateMock).toHaveBeenCalledWith('Search');
  });

  it('navigates to course details when a course card is clicked', async () => {
    const navigateMock = jest.fn();
    const { findAllByText } = render(<Home navigation={{ navigate: navigateMock }} />);
  
    // Wait for courses to load and get all elements with the text "Mathematics 101"
    const mathCourseCards = await findAllByText('Mathematics 101');
    
    // Simulate clicking on the first course card (or whichever one you want to test)
    fireEvent.press(mathCourseCards[0]);
  
    // Check that the navigation function was called with the correct arguments
    expect(navigateMock).toHaveBeenCalledWith('CourseDetails', { courseId: 1 }); // Assuming courseId is 1
  });

  it('navigates to teacher details when a teacher card is clicked', async () => {
    const navigateMock = jest.fn();
    const { getByText, findByText } = render(<Home navigation={{ navigate: navigateMock }} />);
  
    // Wait for teachers to load
    const teacherCard = await findByText('John Doe');
  
    // Simulate clicking on the teacher card
    fireEvent.press(teacherCard);
  
    // Check that the navigation function was called with the correct arguments
    expect(navigateMock).toHaveBeenCalledWith('TeacherDetails', { teacherId: 1 }); // Assuming teacherId is 1
  });
});