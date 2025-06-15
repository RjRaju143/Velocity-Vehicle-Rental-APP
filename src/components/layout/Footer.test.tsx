
import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer Component', () => {
  it('renders the copyright text', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    const copyrightText = screen.getByText(`© ${currentYear} Velocity Vehicle Rentals. All rights reserved.`);
    expect(copyrightText).toBeInTheDocument();
  });

  it('renders the designer credit text', () => {
    render(<Footer />);
    const designerText = screen.getByText('Designed by an expert designer for a professional feel.');
    expect(designerText).toBeInTheDocument();
  });
});
