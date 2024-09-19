import { useEffect, useMemo } from 'react';
import { usePaneFolder, usePaneInput, useTweakpane } from '../../pane'
import { All_vars } from '../utils/variables.json'
import { createTexture2 } from '../utils/colormap'

const analysisMethods = [
  {
    text:"Pearsons R",
    value: "r"
  },
  {
    text: "Average",
    value:"mean"
  }
]

export function useControlPane(containerID: string) {
    const container = document.getElementById(containerID);

    const optionsVars = useMemo(() => All_vars.map((element) => ({
    text: element,
    value: element
  })), []);
  // TODO: append 'default' variable name, read variables directrly from zarr store

  const colormaps = useMemo(() => ['viridis', 'plasma', 'inferno', 'Accent', 'Blues',
    'CMRmap', 'twilight', 'tab10', 'gist_earth', 'cividis',
    'Spectral', 'gist_stern', 'gnuplot', 'gnuplot2', 'ocean', 'turbo'],
    []);
  const colormaps_array = useMemo(() => colormaps.map(colormap => ({
    text: colormap,
    value: colormap
  })), [colormaps]);

  const pane = useTweakpane(
    {
      backgroundcolor: "#2d4967",
      threshold: 0.0,
      cmap: 'Spectral',
      vName: 'default',
      description: 'hello world',
      timeSlice: {min: 0, max: 24},
      lonmax: 1.0,
      lonmin: -1,
      latmax: 1.0,
      latmin: -1,
      tmin: -1.0,
      tmax: 1.0,
      analysis:'Pearsons R',
      var1: 'default',
      var2: 'default'
    },
    {
      title: 'Controls',
      container: container,
    }
  )

  const [bgcolor] = usePaneInput(pane, 'backgroundcolor', {
    label: 'Background Color',
    view: 'color',
    value: "#2d4967",
  })

  const folderGeo = usePaneFolder(pane, {
    title: 'Geometry Settings',
  })

  const [threshold] = usePaneInput(folderGeo, 'threshold', {
    label: 'Threshold',
    value: 0.0,
    min: 0,
    max: 1,
    step: 0.01,
    format: (value) => value.toFixed(2),
  })

  const [cmap_texture_name] = usePaneInput(folderGeo, 'cmap', {
    label: 'Colormap',
    options: colormaps_array,
    value: 'Spectral'
  })

  const folderVars = usePaneFolder(pane, {
    title: 'Variables',
  })

  const [drei_var] = usePaneInput(folderVars, 'vName', {
    label: 'Name',
    options: optionsVars,
    value: 'default'
  })

  const folderSlices = usePaneFolder(pane, {
    title: 'Slice Dimensions',
  })

  const [tInterval] = usePaneInput(folderSlices, 'timeSlice', {
    label: 'Time window',
    min: 0,
    max: 966,
    step: 1,
  })

  const [lonmax] = usePaneInput(folderSlices, 'lonmax', {
    label: 'Lon max',
    value: 0.0,
    min: -1,
    max: 1,
    step: 0.01,
    format: (value) => `${(value * 180).toFixed(0)}°`,
  })

  const [lonmin] = usePaneInput(folderSlices, 'lonmin', {
    label: 'Lon min',
    value: 0.0,
    min: -1,
    max: 1,
    step: 0.01,
    format: (value) => `${(value * 180).toFixed(0)}°`,
  })

  const [latmax] = usePaneInput(folderSlices, 'latmax', {
    label: 'Lat max',
    value: 0.0,
    min: -1,
    max: 1,
    step: 0.01,
    format: (value) => `${(value * 90).toFixed(0)}°`,
  })

  const [latmin] = usePaneInput(folderSlices, 'latmin', {
    label: 'Lat min',
    value: 0.0,
    min: -1,
    max: 1,
    step: 0.01,
    format: (value) => `${(value * 90).toFixed(0)}°`,
  })

  const [tmax] = usePaneInput(folderSlices, 'tmax', {
    label: 'Time max',
    value: 0.0,
    min: -1,
    max: 1,
    step: 0.01,
    format: (value) => `${((value + 1)* 12/2).toFixed(0)} day`,
  })

  const [tmin] = usePaneInput(folderSlices, 'tmin', {
    label: 'Time min',
    value: 0.0,
    min: -1,
    max: 1,
    step: 0.01,
    format: (value) => `${((value + 1) * 12/2).toFixed(0)} day`,
  })

  const analysisFolder = usePaneFolder(pane,{
    title:"Quick Analysis"
  })

  const [analysisMethod] = usePaneInput(analysisFolder, 'analysis', {
    label: 'Method',
    options: analysisMethods,
    value: 'default'
  })

  const [analysis1] = usePaneInput(analysisFolder, 'var1', {
    label: 'Variable 1',
    options: optionsVars,
    value: 'default'
  })

  const [analysis2] = usePaneInput(analysisFolder, 'var2', {
    label: 'Variable 2',
    options: optionsVars,
    value: 'default'
  })

  useEffect(() => {
    const pane_button = pane.current.instance!
    const btn = pane_button.addButton({
      title: 'Compute!',
      label: 'Apply function'
    });
    let count = 0;
    btn.on('click', () => {
      count += 1;
      console.log(count);
    });
  }, [pane])

  useEffect(() => {
    // Update background color
    document.body.style.backgroundColor = bgcolor;
  }, [bgcolor]);

  const cmap_texture = useMemo(() => createTexture2(cmap_texture_name), [cmap_texture_name]);

  return {
    threshold,
    cmap_texture_name,
    cmap_texture,
    drei_var,
    tInterval,
    lonmax,
    lonmin,
    latmax,
    latmin,
    tmax,
    tmin
  }
}