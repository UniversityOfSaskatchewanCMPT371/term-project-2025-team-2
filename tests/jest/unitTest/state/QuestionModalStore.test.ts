import { useQuestionModalStore } from "@state/QuestionModalStore";
import { renderHook, act } from "@testing-library/react";

describe("QuestionModalStore", () => {
    // Reset the store before each test to ensure tests don't affect each other
    beforeEach(() => {
        const { result } = renderHook(() => useQuestionModalStore());
        act(() => {
            result.current.closeModal();
        });
    });

    test("initial state should be closed with empty values", () => {
        const { result } = renderHook(() => useQuestionModalStore());

        expect(result.current.isOpen).toBe(false);
        expect(result.current.title).toBe("");
        expect(result.current.text).toBe("");
        expect(typeof result.current.onConfirm).toBe("function");
        expect(typeof result.current.onCancel).toBe("function");
        expect(typeof result.current.openModal).toBe("function");
        expect(typeof result.current.closeModal).toBe("function");
    });

    test("openModal should set the modal state correctly", () => {
        const { result } = renderHook(() => useQuestionModalStore());
        const mockOnConfirm = jest.fn();
        const mockOnCancel = jest.fn();

        act(() => {
            result.current.openModal({
                title: "Test Title",
                text: "Test Text",
                onConfirm: mockOnConfirm,
                onCancel: mockOnCancel,
            });
        });

        expect(result.current.isOpen).toBe(true);
        expect(result.current.title).toBe("Test Title");
        expect(result.current.text).toBe("Test Text");
        expect(result.current.onConfirm).toBe(mockOnConfirm);
        expect(result.current.onCancel).toBe(mockOnCancel);
    });

    test("openModal should set default onCancel if not provided", () => {
        const { result } = renderHook(() => useQuestionModalStore());
        const mockOnConfirm = jest.fn();

        act(() => {
            result.current.openModal({
                title: "Test Title",
                text: "Test Text",
                onConfirm: mockOnConfirm,
            });
        });

        expect(result.current.isOpen).toBe(true);
        expect(result.current.title).toBe("Test Title");
        expect(result.current.text).toBe("Test Text");
        expect(result.current.onConfirm).toBe(mockOnConfirm);
        expect(typeof result.current.onCancel).toBe("function");

        // Verify the default onCancel function doesn't throw errors
        expect(() => result.current.onCancel()).not.toThrow();
    });

    test("closeModal should close the modal but preserve other state", () => {
        const { result } = renderHook(() => useQuestionModalStore());
        const mockOnConfirm = jest.fn();
        const mockOnCancel = jest.fn();

        // First open the modal
        act(() => {
            result.current.openModal({
                title: "Test Title",
                text: "Test Text",
                onConfirm: mockOnConfirm,
                onCancel: mockOnCancel,
            });
        });

        // Then close it
        act(() => {
            result.current.closeModal();
        });

        // Modal should be closed
        expect(result.current.isOpen).toBe(false);

        // Other properties should remain unchanged
        expect(result.current.title).toBe("Test Title");
        expect(result.current.text).toBe("Test Text");
        expect(result.current.onConfirm).toBe(mockOnConfirm);
        expect(result.current.onCancel).toBe(mockOnCancel);
    });

    test("onConfirm callback can be executed", () => {
        const { result } = renderHook(() => useQuestionModalStore());
        const mockOnConfirm = jest.fn();

        act(() => {
            result.current.openModal({
                title: "Test Title",
                text: "Test Text",
                onConfirm: mockOnConfirm,
            });
        });

        // Execute the stored callback
        act(() => {
            result.current.onConfirm();
        });

        expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });

    test("onCancel callback can be executed", () => {
        const { result } = renderHook(() => useQuestionModalStore());
        const mockOnCancel = jest.fn();

        act(() => {
            result.current.openModal({
                title: "Test Title",
                text: "Test Text",
                onConfirm: () => {},
                onCancel: mockOnCancel,
            });
        });

        // Execute the stored callback
        act(() => {
            result.current.onCancel();
        });

        expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    test("multiple modal opens should replace previous state", () => {
        const { result } = renderHook(() => useQuestionModalStore());
        const mockOnConfirm1 = jest.fn();
        const mockOnCancel1 = jest.fn();
        const mockOnConfirm2 = jest.fn();
        const mockOnCancel2 = jest.fn();

        // Open the modal with first set of params
        act(() => {
            result.current.openModal({
                title: "First Title",
                text: "First Text",
                onConfirm: mockOnConfirm1,
                onCancel: mockOnCancel1,
            });
        });

        // Open the modal with second set of params
        act(() => {
            result.current.openModal({
                title: "Second Title",
                text: "Second Text",
                onConfirm: mockOnConfirm2,
                onCancel: mockOnCancel2,
            });
        });

        // Should have the second set of values
        expect(result.current.isOpen).toBe(true);
        expect(result.current.title).toBe("Second Title");
        expect(result.current.text).toBe("Second Text");
        expect(result.current.onConfirm).toBe(mockOnConfirm2);
        expect(result.current.onCancel).toBe(mockOnCancel2);

        // Execute callbacks to verify they're from the second set
        act(() => {
            result.current.onConfirm();
            result.current.onCancel();
        });

        expect(mockOnConfirm1).not.toHaveBeenCalled();
        expect(mockOnCancel1).not.toHaveBeenCalled();
        expect(mockOnConfirm2).toHaveBeenCalledTimes(1);
        expect(mockOnCancel2).toHaveBeenCalledTimes(1);
    });
});
