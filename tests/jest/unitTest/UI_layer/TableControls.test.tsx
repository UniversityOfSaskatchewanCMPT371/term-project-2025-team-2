import { render, screen, fireEvent } from '@testing-library/react';
import TableControls from '../../../../src/components/DicomData/TableComponents/TableControls';

describe('TableControls', () => {
    test('renders the component with initial props', () => {
        render(<TableControls searchTerm="" onSearchChange={jest.fn()} onSave={jest.fn()} />);
        expect(screen.getByText('Download File')).toBeInTheDocument();
        expect(screen.getByText('Auto Anon')).toBeInTheDocument();
    });

    test('calls onSearchChange when search term is changed', () => {
        const onSearchChange = jest.fn();
        render(<TableControls searchTerm="" onSearchChange={onSearchChange} onSave={jest.fn()} />);
        const searchInput = screen.getByRole('textbox');
        fireEvent.change(searchInput, { target: { value: 'test' } });
        expect(onSearchChange).toHaveBeenCalledWith('test');
    });

});