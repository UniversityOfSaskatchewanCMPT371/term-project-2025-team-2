import { render, screen, fireEvent } from '@testing-library/react';
import { AnonPopup } from '../../../src/components/DicomData/TableComponents/AnonPopup';

const mockTags = [
    { tagId: 'X00100010', tagName: 'PatientName', newValue: 'John Doe' },
    { tagId: 'X00100020', tagName: 'PatientID', newValue: '123456' },
];

describe('AnonPopup', () => {
    // ***** UNIT TEST onConfirm called on OK pressed *****
    test('calls onConfirm when OK button is clicked', () => {
        const onConfirm = jest.fn();
        render(<AnonPopup tags={mockTags} onConfirm={onConfirm} onCancel={jest.fn()} />);

        fireEvent.click(screen.getByText('OK'));
        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    // ***** UNIT TEST onCancel called on Cancel pressed *****
    test('calls onCancel when Cancel button is clicked', () => {
        const onCancel = jest.fn();
        render(<AnonPopup tags={mockTags} onConfirm={jest.fn()} onCancel={onCancel} />);

        fireEvent.click(screen.getByText('Cancel'));
        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    // ***** UNIT TEST renders the popup with tags *****
    test('renders the popup with tags', () => {
        render(<AnonPopup tags={mockTags} onConfirm={jest.fn()} onCancel={jest.fn()} />);

        // title of popup
        expect(screen.getByText('Tags to be Anonymized')).toBeInTheDocument();

        // checks list items (li elements) in popup
        const listItems = screen.getAllByRole("listitem");
        expect(listItems[0]).toHaveTextContent("X00100010 (PatientName): John Doe");
        expect(listItems[1]).toHaveTextContent("X00100020 (PatientID): 123456");
    });

});