import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { AnonPopup } from '../../../../src/components/DicomData/TableComponents/AnonPopup';

const mockTags = [
    { tagId: 'X00100010', tagName: 'PatientName', newValue: 'John Doe' },
    { tagId: 'X00100020', tagName: 'PatientID', newValue: '123456' },
    { tagId: 'X00000001', tagName: 'Cool Guy Levels', newValue: 'Off the charts' },
    { tagId: 'X00000002', tagName: 'some fancy value', newValue: '0987654321' },
    { tagId: 'X00000003', tagName: 'Hydration', newValue: 'Sahara+Gobix10' },
];

let onConfirm: jest.Mock;
let onCancel: jest.Mock;
let onUpdateTag: jest.Mock;

describe('AnonPopup', () => {
    beforeEach(() => {
        cleanup();
        onConfirm = jest.fn();
        onCancel = jest.fn();
        onUpdateTag = jest.fn();
    });

    // ***** UNIT TEST onConfirm called on OK pressed *****
    test('calls onConfirm when OK button is clicked', () => {
        render(<AnonPopup tags={mockTags} onConfirm={onConfirm} onCancel={onCancel} onUpdateTag={onUpdateTag}/>);

        fireEvent.click(screen.getByText('OK'));
        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    // ***** UNIT TEST onCancel called on Cancel pressed *****
    test('calls onCancel when Cancel button is clicked', () => {
        render(<AnonPopup tags={mockTags} onConfirm={onConfirm} onCancel={onCancel} onUpdateTag={onUpdateTag}/>);

        fireEvent.click(screen.getByText('Cancel'));
        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    // ***** UNIT TEST renders the popup with tags *****
    test('renders the popup with tags', () => {
        render(<AnonPopup tags={mockTags} onConfirm={onConfirm} onCancel={onCancel} onUpdateTag={onUpdateTag} />);

        // title of popup
        expect(screen.getByText('Tags to be Anonymized')).toBeInTheDocument();

        // checks list items (li elements) in popup
        const listItems = screen.getAllByRole("listitem");
        expect(listItems[0]).toHaveTextContent("X00100010 (PatientName):John Doe");
        expect(listItems[1]).toHaveTextContent("X00100020 (PatientID):123456");
        expect(listItems[2]).toHaveTextContent("X00000001 (Cool Guy Levels):Off the charts");
        expect(listItems[3]).toHaveTextContent("X00000002 (some fancy value):0987654321");
        expect(listItems[4]).toHaveTextContent("X00000003 (Hydration):Sahara+Gobix10");
    });

    // // ***** UNIT TEST allows editing a tag value *****
    test('allows editing a tag value', () => {
        render(<AnonPopup tags={mockTags} onConfirm={onConfirm} onCancel={onCancel} onUpdateTag={onUpdateTag} />);

        fireEvent.click(screen.getByText('John Doe'));
        const input = screen.getByDisplayValue('John Doe');
        expect(input).toBeInTheDocument();
        fireEvent.change(input, { target: { value: 'General Aladeen' } });
        expect(onUpdateTag).toHaveBeenCalledWith('X00100010', 'General Aladeen');
    });

    // ***** UNIT TEST edits tag value on Enter *****
    test('edits tag value on Enter', () => {
        render(<AnonPopup tags={mockTags} onConfirm={onConfirm} onCancel={onCancel} onUpdateTag={onUpdateTag} />);

        fireEvent.click(screen.getByText('Off the charts'));
        const input = screen.getByDisplayValue('Off the charts');
        fireEvent.change(input, { target: { value: 'only 2' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
        expect(onUpdateTag).toHaveBeenCalledWith('X00000001', 'only 2');
    });

    // // ***** UNIT TEST calls handleBlur on input blur *****
    test('calls handleBlur on input blur, and input field gone', () => {
        render(<AnonPopup tags={mockTags} onConfirm={onConfirm} onCancel={onCancel} onUpdateTag={onUpdateTag} />);

        fireEvent.click(screen.getByText('0987654321'));
        const input = screen.getByDisplayValue('0987654321');
        fireEvent.blur(input);
        expect(screen.queryByDisplayValue('0987654321')).not.toBeInTheDocument();
    });

});
