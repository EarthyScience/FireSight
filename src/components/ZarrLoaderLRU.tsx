import { useEffect, useRef, useCallback, Dispatch, SetStateAction } from 'react';
import { HTTPStore, openArray } from "zarr";
import { slice as zarrSlice } from "zarr";
import {LRUCache} from 'lru-cache';
import { NestedArray, TypedArray } from 'zarr';
import * as THREE from 'three'

// const baseURL = 'http://localhost:5173/SeasFireTimeChunks.zarr';
const baseURL = 'http://localhost:5173/GlobalForcing.zarr';
// const baseURL = 'http://localhost:5173/Televit_pred.zarr';

// const baseURL = 'http://localhost:5173/SeasFire_subset.zarr';

type MetaData = Record<string, unknown>;
interface ZarrLoaderProps {
  variable: string | null;
  setData: Dispatch<SetStateAction<NestedArray<TypedArray>>>;
  setMeta: (meta: MetaData) => void;
  slice: {
    min: number;
    max: number;
  };
  selection?:{
    uv: THREE.Vector2;
    normal: THREE.Vector3;
  }
}

const CACHE_LIMIT = 10; // Set your desired cache limit

const ZarrLoaderLRU = ({ variable, setData, setMeta, slice }: ZarrLoaderProps) => {
  const timeStart = slice.min;
  const timeEnd = slice.max;
  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize the LRU cache
  const cacheRef = useRef(
    new LRUCache<string, NestedArray<TypedArray>>({
      max: CACHE_LIMIT, // Maximum number of items in the cache
      ttl: 1000 * 60 * 60, // Cache entry maximum age in milliseconds (optional)
    })
  );

  const fetchData = useCallback(async (signal: AbortSignal) => {
    if (!variable || variable.trim() === 'default') return;

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

      const zarrArray = await openArray({ store, path: variable, dtype: '<f4' });

    let data;
    if (zarrArray.shape.length === 3) {
      data = await zarrArray.get([zarrSlice(timeStart, timeEnd), null, null]) as NestedArray<TypedArray>;
    } else if (zarrArray.shape.length === 2) {
      data = await zarrArray.get([null, null]) as NestedArray<TypedArray>;
    } else if (zarrArray.shape.length === 1) {
      data = await zarrArray.get([null]) as NestedArray<TypedArray>;
    } else {
      console.error('Unsupported shape length:', zarrArray.shape.length);
    }
      cacheRef.current.set(cacheKey, data);
      if (data) {
        console.log(data)
        setData(data);
        // what to do where there is not data?
      }

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

const ZarrLoaderAnalysis = ({ variable, setData, slice }: ZarrLoaderProps) => {
  const timeStart = slice.min;
  const timeEnd = slice.max;
  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize the LRU cache
  const cacheRef = useRef(
    new LRUCache<string, NestedArray<TypedArray>>({
      max: CACHE_LIMIT, // Maximum number of items in the cache
      ttl: 1000 * 60 * 60, // Cache entry maximum age in milliseconds (optional)
    })
  );

  const fetchData = useCallback(async (signal: AbortSignal) => {
    if (!variable || variable.trim() === 'default') return;

    const cacheKey = `${variable}_${timeStart}_${timeEnd}`;
    if (cacheRef.current.has(cacheKey)) {
      setData(cacheRef.current.get(cacheKey)!);
      return;
    }

    const store = new HTTPStore(baseURL);

    try {

      const zarrArray = await openArray({ store, path: variable, dtype: '<f4' });

    let data;
    if (zarrArray.shape.length === 3) {
      data = await zarrArray.get([zarrSlice(timeStart, timeEnd), null, null]) as NestedArray<TypedArray>;
    } else if (zarrArray.shape.length === 2) {
      data = await zarrArray.get([null, null]) as NestedArray<TypedArray>;
    } else if (zarrArray.shape.length === 1) {
      data = await zarrArray.get([null]) as NestedArray<TypedArray>;
    } else {
      console.error('Unsupported shape length:', zarrArray.shape.length);
    }
      cacheRef.current.set(cacheKey, data);
      if (data) {
        setData(data);
        // what to do where there is not data?
      }

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      console.error(error);
    }
  }, [variable, timeStart, timeEnd, setData]);

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

const Zarr1D = ({ variable, setData, selection }: ZarrLoaderProps) => {
  const uv = selection.uv;
  const normal = selection.normal;

  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize the LRU cache
  const cacheRef = useRef(
    new LRUCache<string, NestedArray<TypedArray>>({
      max: CACHE_LIMIT, // Maximum number of items in the cache
      ttl: 1000 * 60 * 60, // Cache entry maximum age in milliseconds (optional)
    })
  );

  const fetchData = useCallback(async (signal: AbortSignal) => {
    if (!variable || variable.trim() === 'default') return;

    const cacheKey = `${variable}_${timeStart}_${timeEnd}`;
    if (cacheRef.current.has(cacheKey)) {
      setData(cacheRef.current.get(cacheKey)!);
      return;
    }

    const store = new HTTPStore(baseURL);

    try {

      const zarrArray = await openArray({ store, path: variable, dtype: '<f4' });

      let data;
      const dataShape = zarrArray.shape;
      
      if (Math.abs(normal.z) > 0.5){
        const xInd = parseInt(uv.x * parseInt(dataShape[2]));
        const yInd = parseInt(uv.x * parseInt(dataShape[2]));
      }

      if (zarrArray.shape.length === 3) {
        data = await zarrArray.get([zarrSlice(timeStart, timeEnd), null, null]) as NestedArray<TypedArray>;
      } else if (zarrArray.shape.length === 2) {
        data = await zarrArray.get([null, null]) as NestedArray<TypedArray>;
      } else if (zarrArray.shape.length === 1) {
        data = await zarrArray.get([null]) as NestedArray<TypedArray>;
      } else {
        console.error('Unsupported shape length:', zarrArray.shape.length);
      }
        cacheRef.current.set(cacheKey, data);
        if (data) {
          setData(data);
          // what to do where there is not data?
        }

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      console.error(error);
    }
  }, [variable, timeStart, timeEnd, setData]);

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

export {ZarrLoaderAnalysis,Zarr1D}

