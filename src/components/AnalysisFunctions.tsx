// import React from 'react'
import { useState, useEffect } from 'react';
import {ZarrLoaderAnalysis} from './ZarrLoaderLRU';
import { NestedArray, TypedArray } from 'zarr';
import { Dispatch, SetStateAction } from 'react';

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

const PearsonsR = (array1, array2, setData)=>{
    if (!arraysEqual(array1.shape,array2.shape)){
        console.log("Incompatible Shapes")
        return;
    }
    const empty = new Float32Array(array1.shape[1]*array1.shape[2])
    const output = new NestedArray(empty, [array1.shape[1],array1.shape[2]])
    for (let y = 0; y < array1.shape[1]; y++){
        for (let x = 0; x < array1.shape[2]; x++){
            const arr1 = array1.get([null,y,x])
            const arr2 = array2.get([null,y,x])
            const R = pearsonsR(arr1.flatten(), arr2.flatten())
            output.set([y,x],R)
        }
    }
    setData(output)
}

interface AnalyzerProps {
    variable1: string | null;
    variable2: string | null;
    slice: {
      min: number;
      max: number;
    };
    setData: Dispatch<SetStateAction<NestedArray<TypedArray>>>;
  }

export const Analyzer = ({variable1, variable2, slice, setData}: AnalyzerProps) =>{
    // console.log(variable1)
    // console.log(variable2)
    const [data1, setData1] = useState()
    const [data2, setData2] = useState()
    ZarrLoaderAnalysis({variable:variable1, setDataA:setData1, slice:{min:0, max:24}})
    ZarrLoaderAnalysis({variable:variable2, setDataA:setData2, slice:{min:0, max:24}})

    useEffect(()=>{
        if (!data1|| !data2){
            return
        }
        console.log()
        PearsonsR(data1,data2,setData)

    },[data1,data2]);
    return null;
}
