//import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
//import '@testing-library/jest-dom/extend-expect';
import AnonPopup from '../../../src/components/DicomData/TableComponents/AnonPopup';

const mockTags = [
    { tagId: '0010,0010', tagName: 'PatientName', newValue: 'John Doe' },
    { tagId: '0010,0020', tagName: 'PatientID', newValue: '123456' },
];

describe('AnonPopup', () => {
    test('calls onConfirm when OK button is clicked', () => {
        const onConfirm = jest.fn();
        render(<AnonPopup tags={mockTags} onConfirm={onConfirm} onCancel={jest.fn()} />);

        fireEvent.click(screen.getByText('OK'));
        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    test('calls onCancel when Cancel button is clicked', () => {
        const onCancel = jest.fn();
        render(<AnonPopup tags={mockTags} onConfirm={jest.fn()} onCancel={onCancel} />);

        fireEvent.click(screen.getByText('Cancel'));
        expect(onCancel).toHaveBeenCalledTimes(1);
    });
});