
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Badge, type BadgeProps } from './badge'; // Ensure BadgeProps is exported from badge.tsx if needed for tests

describe('Badge Component', () => {
  it('renders with default variant', () => {
    render(<Badge>Default Badge</Badge>);
    const badgeElement = screen.getByText('Default Badge');
    expect(badgeElement).toBeInTheDocument();
    // Default variant class check (specific class depends on your badgeVariants)
    // Example: expect(badgeElement).toHaveClass('bg-primary');
  });

  it('renders with secondary variant', () => {
    render(<Badge variant="secondary">Secondary Badge</Badge>);
    const badgeElement = screen.getByText('Secondary Badge');
    expect(badgeElement).toBeInTheDocument();
    // Example: expect(badgeElement).toHaveClass('bg-secondary');
  });

  it('renders with destructive variant', () => {
    render(<Badge variant="destructive">Destructive Badge</Badge>);
    const badgeElement = screen.getByText('Destructive Badge');
    expect(badgeElement).toBeInTheDocument();
    // Example: expect(badgeElement).toHaveClass('bg-destructive');
  });

  it('renders with outline variant', () => {
    render(<Badge variant="outline">Outline Badge</Badge>);
    const badgeElement = screen.getByText('Outline Badge');
    expect(badgeElement).toBeInTheDocument();
    // Example: expect(badgeElement).toHaveClass('text-foreground');
  });

  it('applies additional className', () => {
    render(<Badge className="custom-class">Custom Class Badge</Badge>);
    const badgeElement = screen.getByText('Custom Class Badge');
    expect(badgeElement).toHaveClass('custom-class');
  });
});
