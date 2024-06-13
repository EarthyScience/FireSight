import React, { useEffect, useState } from 'react'

import { HTTPStore, openArray } from "zarr";

import {slice as zarrSlice}  from "zarr";

const baseUrl = 'http://localhost:5173/SeasFireTimeChunks.zarr'

const ZarrLoader = ({variable,setData,slice, setMeta}) => {
  useEffect(()=>{
    if (!variable){return}
    const store = new HTTPStore(baseUrl)
    const fullPath = `${baseUrl}/${variable}/.zattrs`;
    const meta = fetch(fullPath)
      .then(res => res.json())
      .then(data=>{
        console.log(data)
      })
      // TODO: return also this metadata, so that is also displayed in an info box, 
      // close to the About button

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
