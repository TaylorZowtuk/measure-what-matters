// MIT License

// Copyright (c) 2020 Jeff Zhang

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

/**
 * Function signature for checking equality
 */
export interface EqualsFunction<T> {
  (a: T, b: T): boolean
}

/**
 * Function signature for comparing
 * > 0 => a is larger than b
 * = 0 => a equals b
 * < 0 => a is smaller than b
 */
export interface CompareFunction<T> {
  (a: T, b: T): number
}

/**
 * Default function to test equality.
 * @function
 */
export const defaultEquals = <T>(a: T, b: T): boolean => {
  return a === b
}

export const VALUE_DOES_NOT_EXIST_ERROR = 'Value does not exist.'

/**
 * Default function to compare element order.
 * @function
 */
export function defaultCompare<T>(a: T, b: T): number {
  if (a < b) {
    return -1
  } else if (a === b) {
    return 0
  } else {
    return 1
  }
}


export class CircularBuffer<T> {
  private list: T[]
  private sz: number
  private capacity: number

  private readIndex: number
  private writeIndex: number

  private equalsF: EqualsFunction<T>

  constructor(capacity: number, equalsFunction?: EqualsFunction<T>) {
    this.list = new Array(capacity)
    this.sz = 0
    this.capacity = capacity

    this.readIndex = 0
    this.writeIndex = 0

    this.equalsF = equalsFunction || defaultEquals
  }

  /*****************************************************************************
                                  INSPECTION
  *****************************************************************************/
  /**
   * Returns size of circular buffer - O(1)
   */
  size(): number {
    return this.sz
  }

  /**
   * Returns true if buffer is empty, false otherwise - O(1)
   */
  isEmpty(): boolean {
    return this.size() === 0
  }

  /**
   * Deletes all elements in buffer - O(capacity)
   */
  clear(): void {
    this.list = new Array(this.capacity)
    this.sz = 0
  }

  /*****************************************************************************
                                  INSERTION/DELETION
  *****************************************************************************/
  /**
   * Enqueues element into queue - O(1)
   * @param {T} element - element to be enqueued
   */
  enqueue(element: T): void {
    this.list[this.writeIndex] = element

    const elementIsOverWritten = this.sz !== 0 && this.writeIndex === this.readIndex
    if (elementIsOverWritten) {
      this.readIndex = (this.readIndex + 1) % this.capacity
    }

    this.writeIndex = (this.writeIndex + 1) % this.capacity

    this.sz += 1
  }

  /**
   * Dequeues element from queue - O(1)
   * @returns {T}
   */
  dequeue(): T | null {
    if (this.isEmpty()) return null

    const removedVal = this.list[this.readIndex]
    this.readIndex = (this.readIndex + 1) % this.capacity

    this.sz -= 1

    return removedVal
  }

  /*****************************************************************************
                                  ACCESSING
  *****************************************************************************/
  /**
   * Peeks the element at the front of the buffer - O(1)
   * @returns {T} - Frontmost element
   */
  peekFront(): T | null {
    if (this.isEmpty()) return null

    return this.list[this.readIndex]
  }

  /**
   * Peeks the element at the back of the buffer - O(1)
   * @returns {T} - Backmost element
   */
  peekBack(): T | null {
    if (this.isEmpty()) return null

    let i = this.writeIndex - 1
    if (i < 0) i = this.capacity - 1

    return this.list[i]
  }

  /*****************************************************************************
                                  SEARCHING
  *****************************************************************************/
  /**
   * Checks if element is in buffer - O(n)
   * @param {T} element  - element to search for
   * @returns {boolean}
   */
  contains(element: T): boolean {
    return this.list.some((val: T) => {
      return this.equalsF(val, element)
    })
  }
}

export default CircularBuffer
