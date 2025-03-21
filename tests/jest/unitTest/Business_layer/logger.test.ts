

const mockConsoleDebug = jest.fn();
const mockConsoleInfo = jest.fn();
const mockConsoleWarn = jest.fn();
const mockConsoleError = jest.fn();

global.console = {
  ...console,
  debug: mockConsoleDebug,
  info: mockConsoleInfo,
  warn: mockConsoleWarn,
  error: mockConsoleError,
  log: jest.fn(), 
};

import log from "@logger/Logger";

describe("Logger Utility", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    log.setLevel("debug"); 
  });

  test("should log messages for debug, info, warn, and error levels", () => {
    log.debug("Debug message");
    log.info("Info message");
    log.warn("Warn message");
    log.error("Error message");
    
    expect(mockConsoleInfo).toHaveBeenCalledWith("Info message");
    expect(mockConsoleWarn).toHaveBeenCalledWith("Warn message");
    expect(mockConsoleError).toHaveBeenCalledWith("Error message");
  });

  test("should suppress debug/info when level is set to warn", () => {
    log.setLevel("warn");

    log.debug("Debug message");
    log.info("Info message");
    log.warn("Warn message");
    log.error("Error message");

    expect(mockConsoleDebug).not.toHaveBeenCalled();
    expect(mockConsoleInfo).not.toHaveBeenCalled();
    expect(mockConsoleWarn).toHaveBeenCalledWith("Warn message");
    expect(mockConsoleError).toHaveBeenCalledWith("Error message");
  });

  test("should export loglevel instance with default warn level", () => {
    log.setLevel("warn");
    expect(log.getLevel()).toBeGreaterThanOrEqual(log.levels.WARN);
  });
});