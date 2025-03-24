import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SettingsModal } from '../../../../src/Components/Navigation/SettingsModal';
import { useStore } from '../../../../src/State/Store';

// Mock use store
jest.mock('../../../../src/State/Store', () => ({
    useStore: jest.fn(),
}));

// Mock HTMLDialogElement
class MockDialog {
    showModal() {}
}
Object.defineProperty(window, 'HTMLDialogElement', {
    writable: true,
    value: MockDialog,
});

describe('SettingsModal', () => {
    const mockToggleModal = jest.fn();
    const mockSetShowHiddenTags = jest.fn();
    const mockSetDownloadOption = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        
        (useStore as unknown as jest.Mock).mockImplementation((selector: any) => {
            const state = {
                showHiddenTags: false,
                setShowHiddenTags: mockSetShowHiddenTags,
                files: [],
                downloadOption: 'single',
                setDownloadOption: mockSetDownloadOption
            };
            return selector(state);
        });
    });

    it('renders settings modal with all components', () => {
        render(<SettingsModal toggleModal={mockToggleModal} />);
        
        expect(screen.getByText('Settings')).toBeInTheDocument();
        expect(screen.getByText('Show Hidden Tags')).toBeInTheDocument();
        expect(screen.getByText('Download Option')).toBeInTheDocument();
        expect(screen.getByText('Editing Locked Tags')).toBeInTheDocument();
        expect(screen.getByText('Close')).toBeInTheDocument();
    });

    it('calls toggleModal when close button is clicked', () => {
        render(<SettingsModal toggleModal={mockToggleModal} />);
        
        const closeButton = screen.getByText('Close');
        fireEvent.click(closeButton);
        
        expect(mockToggleModal).toHaveBeenCalled();
    });
});