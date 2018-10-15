/**
 * Four main parts:
 * - Manager class for keeping track of loading
 * - Provider component - provides loader manager context
 * - Consumer component - makes the loader manager context available
 * - default loading bar
 */
import * as React from 'react';

export class Manager {
  /// Promises or manual loadings that are currently being waited on
  protected loadings = [];
  /** If loading, a Promise that will resolve to an array of any errors once
   *  all of the loadings have loaded */
  public loading: Promise<Array<any>> = null;
  /// resolve function for current loading Promise
  protected loadingResolve = null;
  /// ID for next loading added
  protected nextId = 1;

  /**
   * Find the index of the loading with the given id in the loadings array
   *
   * @param id ID to find the corresponding loading for
   *
   * @returns loadings index of loading
   */
  protected findIndex (id: number): number {
    return this.loadings.findIndex((load) => load.id === id);
  }

  /**
   * Get the percentage complete of the loaders
   *
   * @returns Percentage complete (1-100)
   */
  get percentage () {
    return 0;
  }

  /**
   * Add a new loading to the loading manager.
   *
   * @param promise Promise to wait for
   *
   * @returns ID for loading that can be used to update the progress and remove
   *   the loading
   */
  add (promise?: Promise<any>): number {
    const id = this.nextId++;

    if (!this.loadings.length) {
      this.loading = new Promise((resolve) => {
        this.loadingResolve = resolve;
      });
    }

    if (promise) {
      this.loadings.push({
        promise,
        id
      });

      promise.then(() => {
        this.remove(id);
      }, (error) => {
        this.error(id, error);
      });
    } else {
      this.loadings.push({
        id
      });
    }

    return id;
  }

  /**
   * Mark a loading as having errored
   *
   * @param id ID of loading
   * @param error Error to store with loading
   */
  error (id: number, error: any): void {
    const index = this.findIndex(id);

    if (index !== -1) {
      this.loadings[index].error = error;

      this.remove(id);
    }
  }

  /**
   * Remove a loading from the waitlist
   *
   * @param ID of loading
   * @param force If true, loading will be removed, even if the loading has
   *   errored
   *
   * @returns Whether or not the loading was removed. If null, a loading with
   *   the given ID was not on the waitlist
   */
  remove (id: number, force?: boolean): boolean {
    let removed = false;
    const index = this.findIndex(id);

    if (index !== -1) {
      if (!this.loadings[index].error || force) {
        removed = true;
        this.loadings.splice(index, 1);
      }

      const errored = this.loadings.filter((load) => load.error);

      if (this.loadings.length === 0 || errored.length === this.loadings.length) {
        setTimeout(this.loadingResolve.bind(this, errored.length ? errored : null), 0);
        this.loadings = [];
        this.loading = null;
        this.loadingResolve = null;
      }
    } else {
      return null;
    }

    return removed;
  }

  /**
   * Update/get the progress of a loading to the given percentage
   *
   * @param id ID of loading
   * @param percentage Percentage to update the loading progress to
   *
   * @returns The progess of the loading
   */
  progress (id: number, percentage?: number): number {
    const index = this.findIndex(id);

    if (index !== -1) {
      if (typeof percentage === 'number') {
        this.loadings[index].progress = percentage;
        return percentage;
      } else {
        percentage = this.loadings[index].progess;

        if (typeof percentage === 'number') {
          return percentage;
        } else {
          return null;
        }
      }
    }
  }
}

/**
 * Default loading manager class instance
 */
export const loader = new Manager();

const context = React.createContext(loader);

/**
 * Loader context consumer Component. Use this to give components access to
 * the loading manager for the given app. By default will give the default
 * loading manager class instance, but can be overriden by using the Provider
 */
export const Consumer = context.Consumer;

/**
 * Loading context provider Component. Use this to change the provided
 * loading manager class to any child Components that use the loader Comsumer
 * component
 */
export const Provider = context.Provider;

export const connectLoader = (element) => (props) => (
  <Consumer>
    { (loader) => {
      return React.createElement(element, {
        ...props,
        loader
      });
    } }
  </Consumer>
);
