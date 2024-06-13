import React, { useEffect, useState } from 'react'

import { HTTPStore, openArray } from "zarr";

import {slice as zarrSlice}  from "zarr";
const url = 'http://localhost:5173/SeasFireTimeChunks.zarr/tp'
// console.log(store)
const meta = await fetch(url + '/.zattrs').then(res => res.json());
console.log(meta)


const ZarrLoader = ({variable,setData,slice}) => {
  useEffect(()=>{
    if (!variable){return}
    const store = new HTTPStore('http://localhost:5173/SeasFireTimeChunks.zarr')
    openArray({ store: store, path: variable })
      .then((zarrArray) => {
        return zarrArray.get([zarrSlice(0,46), null, null]); //Dims are Z,Y,X
      })
      .then((data) => {
        // You can assign the data to a variable here
        setData(data)
      })
      .catch((error) => {
        console.error(error);
      });

  },[variable])

  return (
    <></>
  )
}

export default ZarrLoader
