type CallbackFunction = () => void;

export default class VisibilityIntervalManager {
  private intervalInSeconds: number;
  private callback: CallbackFunction;
  private intervalId: number | null;

  constructor(intervalInSeconds: number, callback: CallbackFunction) {
    this.intervalInSeconds = intervalInSeconds;
    this.callback = callback;
    this.intervalId = null;

    // Bind methods to ensure correct 'this' context
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  /**
   * Starts the interval if it's not already running.
   */
  public startInterval(): void {
    if (!this.intervalId) {
      this.callback(); // Initial call
      this.intervalId = window.setInterval(this.callback, this.intervalInSeconds * 1000);
      console.log('Interval started');
    }
  }

  /**
   * Stops the interval if it's running.
   */
  public stopInterval(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('Interval stopped');
    }
  }

  /**
   * Handles visibility change events.
   */
  private handleVisibilityChange(): void {
    if (document.visibilityState === 'visible') {
      console.log('Page is now visible');
      this.startInterval();
    } else {
      console.log('Page is now hidden');
      this.stopInterval();
    }
  }

  /**
   * Handles window focus events.
   */
  private handleFocus(): void {
    console.log('Window gained focus');
    // this.startInterval();
  }

  /**
   * Handles window blur events.
   */
  private handleBlur(): void {
    console.log('Window lost focus');
    // this.stopInterval();
  }

  /**
   * Initializes event listeners and starts the interval if appropriate.
   */
  public initialize(): void {
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('focus', this.handleFocus);
    window.addEventListener('blur', this.handleBlur);

    // Start the interval if the page is initially visible and focused
    if (document.visibilityState === 'visible' && document.hasFocus()) {
      this.startInterval();
    }
  }

  /**
   * Cleans up event listeners and stops the interval.
   */
  public destroy(): void {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('focus', this.handleFocus);
    window.removeEventListener('blur', this.handleBlur);
    this.stopInterval();
  }

  /**
   * Updates the interval duration and restarts the interval if it's running.
   * @param newIntervalInSeconds - The new interval duration in seconds.
   */
  public updateInterval(newIntervalInSeconds: number): void {
    this.intervalInSeconds = newIntervalInSeconds;
    if (this.intervalId !== null) {
      this.stopInterval();
      this.startInterval();
    }
  }
}
