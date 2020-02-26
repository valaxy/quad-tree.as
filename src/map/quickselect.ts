import { mInt32 } from "../Raw"

type T = mInt32
type CompareFunc = (a: T, b: T) => mInt32

export function quickselect(arr: T[], compare: CompareFunc, k: mInt32, left: mInt32 = 0, right: mInt32 = arr.length - 1): void {
    quickselectStep(arr, k, left, right, compare)
}

function quickselectStep(arr: T[], k: mInt32, left: mInt32, right: mInt32, compare: CompareFunc): void {
    while (right > left) {
        if (right - left > 600) {
            var n = right - left + 1
            var m = k - left + 1
            var z = Math.log(n)
            var s = 0.5 * Math.exp(2 * z / 3)
            var sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1)
            var newLeft = Math.max(left, Math.floor(k - m * s / n + sd)) as mInt32
            var newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd)) as mInt32
            quickselectStep(arr, k, newLeft, newRight, compare)
        }

        var t = arr[k]
        var i = left
        var j = right

        swap(arr, left, k)
        if (compare(arr[right], t) > 0) swap(arr, left, right);

        while (i < j) {
            swap(arr, i, j)
            i++;
            j--;
            while (compare(arr[i], t) < 0) i++;
            while (compare(arr[j], t) > 0) j--;
        }

        if (compare(arr[left], t) === 0) swap(arr, left, j);
        else {
            j++;
            swap(arr, j, right);
        }

        if (j <= k) left = j + 1;
        if (k <= j) right = j - 1;
    }
}

function swap(arr: T[], i: mInt32, j: mInt32): void {
    let tmp = arr[i]
    arr[i] = arr[j]
    arr[j] = tmp
}

// function defaultCompare(a, b) {
//     return a < b ? -1 : a > b ? 1 : 0;
// }