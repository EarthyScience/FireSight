import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { ZarrLoaderAnalysis } from './ZarrLoaderLRU';
import { NestedArray, TypedArray } from 'zarr';
import { genRand } from '../utils/colormap';

// Check if two arrays are equal
function arraysEqual<T>(arr1: T[], arr2: T[]): boolean {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}

// Calculate Pearson's R
function pearsonsR<T extends number>(arr1: T[], arr2: T[]): number {
    const n = arr1.length;

    // Calculate means
    const mean1 = arr1.reduce((a: number, b: T) => a + b as number, 0) / n;
    const mean2 = arr2.reduce((a: number, b: T) => a + b as number, 0) / n;

    let numerator = 0;
    let denominator1 = 0;
    let denominator2 = 0;

    for (let i = 0; i < n; i++) {
        const diff1 = arr1[i] - mean1;
        const diff2 = arr2[i] - mean2;
        numerator += diff1 * diff2;
        denominator1 += diff1 * diff1;
        denominator2 += diff2 * diff2;
    }
    const denominator = Math.sqrt(denominator1) * Math.sqrt(denominator2);
    if (denominator === 0) {
        return 0; // Avoid division by zero
    }
    return numerator / denominator;
}

// Update the PearsonsR function to accept proper types
const PearsonsR = (
    array1: NestedArray<TypedArray>,
    array2: NestedArray<TypedArray>,
    setData: Dispatch<SetStateAction<NestedArray<TypedArray>>>
) => {
    if (!arraysEqual(array1.shape, array2.shape)) {
        console.log("Incompatible Shapes");
        return;
    }

    // Prepare output array
    const empty = new Float32Array(array1.shape[1] * array1.shape[2]);
    const output = new NestedArray(empty, [array1.shape[1], array1.shape[2]]);

    for (let y = 0; y < array1.shape[1]; y++) {
        for (let x = 0; x < array1.shape[2]; x++) {
            const arr1 = array1.get([null, y, x]);
            const arr2 = array2.get([null, y, x]);

            // Convert TypedArray to number[]
            const flatArr1 = Array.from((arr1 as NestedArray<TypedArray>).flatten());
            const flatArr2 = Array.from((arr2 as NestedArray<TypedArray>).flatten());

            const R = pearsonsR(flatArr1, flatArr2);
            output.set([y, x], R);
        }
    }
    setData(output);
};

// Define the props for the Analyzer component
interface AnalyzerProps {
    variable1: string | null;
    variable2: string | null;
    slice: {
        min: number;
        max: number;
    };
    setData: Dispatch<SetStateAction<NestedArray<TypedArray>>>;
}

// Main Analyzer component
export const Analyzer = ({
    variable1,
    variable2,
    slice,
    setData,
}: AnalyzerProps) => {
    console.log(variable1);
    console.log(variable2);
    
    // Initialize with an empty NestedArray to avoid undefined
    const [data1, setData1] = useState(() => genRand(50));
    const [data2, setData2] =  useState(() => genRand(50));
    
    ZarrLoaderAnalysis({ variable: variable1, setData: setData1, slice });
    ZarrLoaderAnalysis({ variable: variable2, setData: setData2, slice });

    useEffect(() => {
        if (!data1 || !data2) {
            return;
        }
        PearsonsR(data1, data2, setData);
    }, [data1, data2]);

    return null;
};
