/**
 * MODULE 4 (PART 3): CHRONOLOGICAL SORTING ALGORITHMS
 * Manual Implementations of Merge Sort, Quick Sort, and Radix Sort
 * 
 * Purpose in Digital Forensics:
 * 1. Sorting investigation timelines chronologically by precise epoch milliseconds.
 * 2. Stable sorting of evidence items by forensic priority score, case ID, or date.
 * 3. Academic performance comparison between divide-and-conquer (Merge Sort),
 *    in-place partitioning (Quick Sort), and non-comparative sorting (Radix Sort).
 * 
 * Time Complexities:
 * - Merge Sort: Best O(n log n), Avg O(n log n), Worst O(n log n) [Stable]
 * - Quick Sort: Best O(n log n), Avg O(n log n), Worst O(n^2) [In-place]
 * - Radix Sort: O(d * (n + k)) where d is digits, k is radix (10) [Non-comparative]
 */

class ForensicsSorter {
    /**
     * Merge Sort
     * Stable, divide-and-conquer sorting algorithm.
     */
    static mergeSort(array, compareFn = (a, b) => a - b) {
        const stats = { comparisons: 0, swaps: 0, startTime: process.hrtime ? process.hrtime.bigint() : Date.now() };

        function merge(left, right) {
            const result = [];
            let i = 0, j = 0;

            while (i < left.length && j < right.length) {
                stats.comparisons++;
                if (compareFn(left[i], right[j]) <= 0) {
                    result.push(left[i++]);
                } else {
                    result.push(right[j++]);
                }
            }

            while (i < left.length) result.push(left[i++]);
            while (j < right.length) result.push(right[j++]);
            return result;
        }

        function sort(arr) {
            if (arr.length <= 1) return arr;
            const mid = Math.floor(arr.length / 2);
            const left = sort(arr.slice(0, mid));
            const right = sort(arr.slice(mid));
            return merge(left, right);
        }

        const sorted = sort([...array]);
        const endTime = process.hrtime ? process.hrtime.bigint() : Date.now();
        const durationMicros = process.hrtime ? Number(endTime - stats.startTime) / 1000 : 0;

        return {
            sorted,
            algorithm: 'Merge Sort',
            comparisons: stats.comparisons,
            durationMicros: durationMicros.toFixed(2),
            timeComplexity: 'O(n log n)'
        };
    }

    /**
     * Quick Sort
     * In-place partitioning sorting algorithm using Lomuto partition scheme.
     */
    static quickSort(array, compareFn = (a, b) => a - b) {
        const arr = [...array];
        const stats = { comparisons: 0, swaps: 0, startTime: process.hrtime ? process.hrtime.bigint() : Date.now() };

        function swap(i, j) {
            stats.swaps++;
            const temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }

        function partition(low, high) {
            const pivot = arr[high];
            let i = low - 1;

            for (let j = low; j < high; j++) {
                stats.comparisons++;
                if (compareFn(arr[j], pivot) <= 0) {
                    i++;
                    swap(i, j);
                }
            }
            swap(i + 1, high);
            return i + 1;
        }

        function sort(low, high) {
            if (low < high) {
                const pi = partition(low, high);
                sort(low, pi - 1);
                sort(pi + 1, high);
            }
        }

        sort(0, arr.length - 1);
        const endTime = process.hrtime ? process.hrtime.bigint() : Date.now();
        const durationMicros = process.hrtime ? Number(endTime - stats.startTime) / 1000 : 0;

        return {
            sorted: arr,
            algorithm: 'Quick Sort',
            comparisons: stats.comparisons,
            swaps: stats.swaps,
            durationMicros: durationMicros.toFixed(2),
            timeComplexity: 'Avg O(n log n), Worst O(n^2)'
        };
    }

    /**
     * Radix Sort
     * Non-comparative integer sorting algorithm.
     * Ideal for sorting raw timestamp epoch milliseconds or numeric event IDs.
     */
    static radixSort(array, keyExtractor = item => item) {
        const arr = [...array];
        const stats = { passes: 0, startTime: process.hrtime ? process.hrtime.bigint() : Date.now() };

        if (arr.length === 0) {
            return { sorted: [], algorithm: 'Radix Sort', passes: 0, durationMicros: '0.00' };
        }

        // Find maximum number to determine number of digits
        let maxVal = keyExtractor(arr[0]);
        for (let i = 1; i < arr.length; i++) {
            const val = keyExtractor(arr[i]);
            if (val > maxVal) maxVal = val;
        }

        function countingSortByDigit(exp) {
            stats.passes++;
            const output = new Array(arr.length);
            const count = new Array(10).fill(0);

            for (let i = 0; i < arr.length; i++) {
                const digit = Math.floor(keyExtractor(arr[i]) / exp) % 10;
                count[digit]++;
            }

            for (let i = 1; i < 10; i++) {
                count[i] += count[i - 1];
            }

            for (let i = arr.length - 1; i >= 0; i--) {
                const digit = Math.floor(keyExtractor(arr[i]) / exp) % 10;
                output[count[digit] - 1] = arr[i];
                count[digit]--;
            }

            for (let i = 0; i < arr.length; i++) {
                arr[i] = output[i];
            }
        }

        // Process each digit position (1, 10, 100, etc.)
        for (let exp = 1; Math.floor(maxVal / exp) > 0; exp *= 10) {
            countingSortByDigit(exp);
        }

        const endTime = process.hrtime ? process.hrtime.bigint() : Date.now();
        const durationMicros = process.hrtime ? Number(endTime - stats.startTime) / 1000 : 0;

        return {
            sorted: arr,
            algorithm: 'Radix Sort (LSD)',
            passes: stats.passes,
            durationMicros: durationMicros.toFixed(2),
            timeComplexity: 'O(d * (n + k))'
        };
    }

    /**
     * Timeline Event Chronological Sorter
     * Sorts investigation events by event_time / timestamp.
     */
    static sortTimelineEvents(events, algorithm = 'mergesort') {
        const compareTime = (a, b) => {
            const tA = new Date(a.event_time || a.timestamp).getTime();
            const tB = new Date(b.event_time || b.timestamp).getTime();
            return tA - tB;
        };

        if (algorithm === 'quicksort') {
            return this.quickSort(events, compareTime);
        } else if (algorithm === 'radixsort') {
            const minTime = Math.min(...events.map(e => new Date(e.event_time || e.timestamp).getTime()));
            return this.radixSort(events, e => new Date(e.event_time || e.timestamp).getTime() - minTime);
        } else {
            return this.mergeSort(events, compareTime);
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ForensicsSorter };
}
