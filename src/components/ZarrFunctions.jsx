import { useEffect, useRef, useCallback } from 'react';
import { HTTPStore, openArray } from "zarr";
import { slice as zarrSlice } from "zarr";

const baseURL = 'http://localhost:5173/SeasFireCube_v3.zarr';

const ZarrLoaderFunction = async ({ variable, slice }) => {
  if (!variable || variable === 'default')return null ;

  const timeStart = slice.min;
  const timeEnd = slice.max;
  
  let meta = null
  let data = null

  const store = new HTTPStore(baseURL);
  const fullPath = `${baseURL}/${variable}/.zattrs`;

  try {
    const metaResponse = await fetch(fullPath);
    meta = await metaResponse.json();

    const zarrArray = await openArray({ store: store, path: variable });

    if (zarrArray.shape.length === 3) {
      data = await zarrArray.get([zarrSlice(timeStart, timeEnd), null, null]);
    } else if (zarrArray.shape.length === 2) {
      data = await zarrArray.get([null, null]) ;
    } else if (zarrArray.shape.length === 1) {
      data = await zarrArray.get([null]);
    } else {
      console.error('Unsupported shape length:', zarrArray.shape.length);
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return;
    console.error(error);
  }

  return {meta,data};
};

export {ZarrLoaderFunction}

