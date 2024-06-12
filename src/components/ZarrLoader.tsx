import React, { useEffect, useState } from 'react'

import { HTTPStore, openArray } from "zarr";

import {slice as zarrSlice}  from "zarr";

const ZarrLoader = ({variable,setData,slice}) => {
  useEffect(()=>{
    if (!variable){return}
    const store = new HTTPStore('http://localhost:5173/SeasFireCube_v3.zarr')
    openArray({ store: store, path: variable })
      .then((zarrArray) => {
        return zarrArray.get([zarrSlice(0,100), zarrSlice(500,600),zarrSlice(500,600)]);
      })
      .then((data) => {
        // You can assign the data to a variable here
        setData(data.flatten())
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
