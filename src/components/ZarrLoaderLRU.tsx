import { useEffect, useRef, useCallback } from 'react';
import { HTTPStore, openArray } from "zarr";
import { slice as zarrSlice } from "zarr";
import {LRUCache} from 'lru-cache';

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

const CACHE_LIMIT = 10; // Set your desired cache limit

const ZarrLoaderLRU = ({ variable, setData, setMeta, slice }: ZarrLoaderProps) => {
  const timeStart = slice.min;
  const timeEnd = slice.max;
  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize the LRU cache
  const cacheRef = useRef(
    new LRUCache<string, ZarrData>({
      max: CACHE_LIMIT, // Maximum number of items in the cache
      ttl: 1000 * 60 * 60, // Cache entry maximum age in milliseconds (optional)
    //   length: (data: ZarrData) => calculateCacheSize(data),
    })
  );

  // Function to calculate the size of cached data
//   const calculateCacheSize = (data: ZarrData): number => {
//     const bytesPerElement = data instanceof Float32Array ? 4 : (data instanceof Int32Array || data instanceof Uint32Array ? 4 : 8);
//     return data.length * bytesPerElement;
//   };

  const fetchData = useCallback(async (signal: AbortSignal) => {
    if (!variable) return;

    const cacheKey = `${variable}_${timeStart}_${timeEnd}`;
    if (cacheRef.current.has(cacheKey)) {
      setData(cacheRef.current.get(cacheKey)!);
      return;
    }

    const store = new HTTPStore(baseURL);
    const fullPath = `${baseURL}/${variable}/.zattrs`;

    try {
      const metaResponse = await fetch(fullPath, { signal });
      const metaData: MetaData = await metaResponse.json();
      setMeta(metaData);

      const zarrArray = await openArray({ store, path: variable });

    let data;
    if (zarrArray.shape.length === 3) {
      data = await zarrArray.get([zarrSlice(timeStart, timeEnd), null, null]) as ZarrData;
    } else if (zarrArray.shape.length === 2) {
      data = await zarrArray.get([null, null]) as ZarrData;
    } else if (zarrArray.shape.length === 1) {
      data = await zarrArray.get([null]) as ZarrData;
    } else {
      console.error('Unsupported shape length:', zarrArray.shape.length);
    }
    
      cacheRef.current.set(cacheKey, data);

      // Check cache size and flush if limit exceeded
    //   if (cacheRef.current.length > CACHE_LIMIT) {
    //     cacheRef.current.reset();
    //     console.log('Cache flushed due to exceeding size limit.');
    //   }
      setData(data);
      // console.log(data)

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

  useEffect(() => {
    // console.log(`Current cache size: ${cacheRef.current.length}`);
  }, [cacheRef]);

  return null;
};

export default ZarrLoaderLRU;
