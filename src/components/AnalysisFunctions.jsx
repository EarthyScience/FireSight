import React from 'react'
import { useState, useEffect } from 'react';
import {ZarrLoaderAnalysis} from './ZarrLoaderLRU';

const PearsonsR = (array1, array2)=>{
    if (array1.shape != array2.shape){
        console.log("Incompatible Shapes")
        return;
    }
}

const Analyzer = ({variable1, variable2, slice}) =>{

    const [data1, setData1] = useState()
    const [data2, setData2] = useState()
    const array1 = ZarrLoaderAnalysis({variable:'vpd',setData:setData1,slice:{min:0,max:24}})
    const array2 = ZarrLoaderAnalysis({variable:'tp',setData:setData2,slice:{min:0,max:24}})

    useEffect(()=>{
        if (!data1 || !data2){
            return
        }

        

    },[data1,data2])
   
}

export default Analyzer
