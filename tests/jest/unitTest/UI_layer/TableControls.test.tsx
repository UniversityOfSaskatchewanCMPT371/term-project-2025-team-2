import { render, screen } from '@testing-library/react';
import TableControls from '../../../../src/components/DicomData/TableComponents/TableControls';

describe('TableControls', () => {
    test('renders the component with initial props', () => {
        render(<TableControls searchTerm="" onSearchChange={jest.fn()} onSave={jest.fn()} />);
        expect(screen.getByText('Download File')).toBeInTheDocument();
        expect(screen.getByText('Auto Anon')).toBeInTheDocument();
    });

});