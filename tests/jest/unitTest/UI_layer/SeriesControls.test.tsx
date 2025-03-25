import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SeriesControls } from '../../../../src/Components/Navigation/SeriesControls';
import { useStore } from '../../../../src/State/Store';
import { createElement } from 'react';

// mock store type
type MockStore = {
    getState: () => {
        setLoading: jest.Mock;
        setLoadingMsg: jest.Mock;
    };
} & jest.Mock;

// Mock the store
jest.mock('../../../../src/State/Store', () => ({
    useStore: jest.fn((selector) => {
        const mockState = {
            files: [{ name: 'file1' }, { name: 'file2' }],
            dicomData: {},
            currentFileIndex: 0,
            newTagValues: {},
            downloadOption: 'option1',
            series: false,
            toggleSeries: jest.fn(),
            clearData: jest.fn(),
            fileStructure: {},
            setLoading: jest.fn(),
            setLoadingMsg: jest.fn()
        };
        return selector ? selector(mockState) : mockState;
    }) as MockStore
}));

// Add getState to the mock
(useStore as unknown as MockStore).getState = () => ({
    setLoading: jest.fn(),
    setLoadingMsg: jest.fn()
});

// Mock updateAllFiles function
jest.mock('../../../../src/DataFunctions/DicomData/UpdateAllFiles', () => ({
    updateAllFiles: jest.fn(),
}));

describe('SeriesControls', () => {
    const mockSetLoading = jest.fn();
    const mockSetLoadingMsg = jest.fn();
    const mockClearData = jest.fn();
    const mockSeriesToggle = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        
        // default store mock
        (useStore as unknown as MockStore).mockImplementation((selector) => {
            const state = {
                files: [{ name: 'file1' }, { name: 'file2' }],
                dicomData: {},
                currentFileIndex: 0,
                newTagValues: {},
                downloadOption: 'option1',
                series: false,
                toggleSeries: mockSeriesToggle,
                clearData: mockClearData,
                fileStructure: {},
                setLoading: mockSetLoading,
                setLoadingMsg: mockSetLoadingMsg
            };
            return selector ? selector(state) : state;
        });

        // update getState mock
        (useStore as unknown as MockStore).getState = () => ({
            setLoading: mockSetLoading,
            setLoadingMsg: mockSetLoadingMsg
        });
    });

    it('renders with multiple files', () => {
        render(createElement(SeriesControls));
        
        expect(screen.getByText('Save All Files')).toBeInTheDocument();
        expect(screen.getByText('Editing Individually')).toBeInTheDocument();
    });

    it('renders with series mode active', () => {
        (useStore as unknown as MockStore).mockImplementation((selector) => {
            const state = {
                series: true
            };
            return selector ? selector(state) : state;
        });

        render(createElement(SeriesControls));
        
        expect(screen.getByText('Apply Edits to All Files')).toBeInTheDocument();
        expect(screen.getByText('Editing as Series')).toBeInTheDocument();
    });

    it('calls seriesToggle when series button is clicked', () => {
        render(createElement(SeriesControls));
        
        const seriesButton = screen.getByText('Editing Individually');
        fireEvent.click(seriesButton);
        
        expect(mockSeriesToggle).toHaveBeenCalled();
    });

    it('handles save all files click, get loading feedback', async () => {
        render(createElement(SeriesControls));
        
        const saveButton = screen.getByText('Save All Files');
        fireEvent.click(saveButton);
        
        expect(mockSetLoading).toHaveBeenCalledWith(true);
    });
});