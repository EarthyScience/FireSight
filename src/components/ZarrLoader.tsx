import React, { useEffect, useRef, useCallback } from 'react';
import { HTTPStore, openArray } from "zarr";
import { slice as zarrSlice } from "zarr";
// import LRU from 'lru-cache';
const baseURL = 'http://localhost:5173/SeasFireCube_v3.zarr';

// Define more specific types for your data and metadata
type ZarrData = Float32Array | Int32Array | Uint32Array; // Adjust based on your actual data type
type MetaData = Record<string, unknown>; // Adjust if you know the structure of your metadata

interface ZarrLoaderProps {
  variable: string | null;
  setData: (data: ZarrData) => void;
  setMeta: (meta: MetaData) => void;
  slice: {
    min: number;
    max: number;
  };
}

const ZarrLoader = ({ variable, setData, setMeta, slice }: ZarrLoaderProps) => {
  const timeStart = slice.min;
  const timeEnd = slice.max;
  const abortControllerRef = useRef<AbortController | null>(null);
  const cacheRef = useRef<Record<string, ZarrData>>({});

  const fetchData = useCallback(async (signal: AbortSignal) => {
    if (!variable) return;

    const cacheKey = `${variable}_${timeStart}_${timeEnd}`;
    if (cacheRef.current[cacheKey]) {
      setData(cacheRef.current[cacheKey]);
      return;
    }

    const store = new HTTPStore(baseURL);
    const fullPath = `${baseURL}/${variable}/.zattrs`;

    try {
      const metaResponse = await fetch(fullPath, { signal });
      const metaData: MetaData = await metaResponse.json();
      setMeta(metaData);

      const zarrArray = await openArray({ store: store, path: variable });
      const data = await zarrArray.get([zarrSlice(timeStart, timeEnd), null, null]);
      
      cacheRef.current[cacheKey] = data;
      setData(data);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      console.error(error);
    }
  }, [variable, timeStart, timeEnd, setData, setMeta]);

  useEffect(() => {
    if (!variable) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    fetchData(abortControllerRef.current.signal);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [variable, timeStart, timeEnd, fetchData]);

  return null;
};

export default ZarrLoader;