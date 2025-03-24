//import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HiddenTagsOption } from '../../../../src/Components/Navigation/HiddenTagsOption';

describe('HiddenTagsOption', () => {
    const mockSetShowHiddenTags = jest.fn();

    beforeEach(() => {
        mockSetShowHiddenTags.mockClear();
    });

    it('renders with showHiddenTags set to false', () => {
        render(<HiddenTagsOption showHiddenTags={false} setShowHiddenTags={mockSetShowHiddenTags} />);
        
        expect(screen.getByText('Show Hidden Tags')).toBeInTheDocument();
        expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('renders with showHiddenTags set to true', () => {
        render(<HiddenTagsOption showHiddenTags={true} setShowHiddenTags={mockSetShowHiddenTags} />);
        
        expect(screen.getByText('Show Hidden Tags')).toBeInTheDocument();
        expect(screen.getByRole('checkbox')).toBeChecked();
    });
}); 