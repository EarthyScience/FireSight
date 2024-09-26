import React from 'react'
import { useState, useEffect } from 'react';
import {ZarrLoaderAnalysis} from './ZarrLoaderLRU';
import { NestedArray } from 'zarr';

function arraysEqual(arr1, arr2) {
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

function pearsonsR(arr1, arr2) {
    const n = arr1.length;
    const mean1 = arr1.reduce((a, b) => a + b, 0) / n;
    const mean2 = arr2.reduce((a, b) => a + b, 0) / n;

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
            const R = pearsonsR(arr1.flatten(),arr2.flatten())
            output.set([y,x],R)
        }
    }
    setData(output)
}

const Analyzer = ({variable1, variable2, slice, setData}) =>{
    console.log(variable1)

    const [data1, setData1] = useState()
    const [data2, setData2] = useState()
    ZarrLoaderAnalysis({variable:'vpd_map',setData:setData1,slice:{min:0,max:24}})
    ZarrLoaderAnalysis({variable:'tp_map',setData:setData2,slice:{min:0,max:24}})

    useEffect(()=>{
        if (!data1|| !data2){
            return
        }
        console.log()
        PearsonsR(data1,data2,setData)

    },[data1,data2])
   
}

export default Analyzer
