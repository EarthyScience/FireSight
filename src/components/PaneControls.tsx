import { useEffect, useMemo, useState, useLayoutEffect } from 'react';
import { usePaneFolder, usePaneInput, useTweakpane } from '../../pane'
// import { ButtonApi } from 'tweakpane';
import { All_vars } from '../utils/variables_forcing.json'
// import { All_vars } from '../utils/variables_televit.json'
// import { All_vars } from '../utils/variables.json'
// import { createTexture } from '../utils/colormap'

function normalizeInterval(value: number, a: number, b: number) {
  return (2 * (value - a)) / (b - a) - 1;
}

export function useControlPane(containerID: string) {
    const container = document.getElementById(containerID) ?? undefined;
    const optionsVars = useMemo(() => All_vars.map((element) => ({
    text: element,
    value: element
  })), []);
  // TODO: append 'default' variable name, read variables directly from zarr store

  const colormaps = useMemo(() => ['viridis', 'plasma', 'inferno', 'magma', 'Accent', 'Blues',
    'CMRmap', 'twilight', 'tab10', 'gist_earth', 'cividis',
    'Spectral', 'gist_stern', 'gnuplot', 'gnuplot2', 'ocean', 'turbo',
    'GnBu', 'afmhot', 'cubehelix', 'hot', 'spring','terrain', 'winter', 'Wistia',
  ],
    []);
  const colormaps_array = useMemo(() => colormaps.map(colormap => ({
    text: colormap,
    value: colormap
  })), [colormaps]);
  

  const pane = useTweakpane(
    {
      backgroundcolor: "#2d4967",
      axes: "#c8cdd2",
      nan_color: "#000000",
      alpha: 255,
      nan_alpha: 255,
      alpha_intensity: 1.0,
      thresholdMode: true,
      threshold: 1.0,
      cmap: 'Spectral',
      vName: 'default',
      description: 'hello world',
      timeSlice: {min: 1, max: 24},
      lonmax: 180.0,
      lonmin: -180.0,
      latmax: 90.0,
      latmin: -90.0,
      tmin: -1,
      tmax: 1,
      analysis:'Pearsons R',
      var1: 'default',
      var2: 'default',
      compute: false
    },
    {
      title: 'Controls / Settings',
      container: container,
      expanded: false,
    }
  )
  const [lonmax, setLonmax] = useState(pane.current.params.lonmax);
  const [lonmin, setLonmin] = useState(pane.current.params.lonmin);
  const [latmax, setLatmax] = useState(pane.current.params.latmax);
  const [latmin, setLatmin] = useState(pane.current.params.latmin);
  const [tmax, settmax] = useState(pane.current.params.tmax);
  const [tmin, settmin] = useState(pane.current.params.tmin);
  const [thresholdMode, setthresholdMode] = useState(pane.current.params.thresholdMode);
  const [threshold, setthreshold] = useState(pane.current.params.threshold);
  const [timeSlice, settimeSlice] = useState(pane.current.params.timeSlice);
  const [compute, setCompute] = useState(pane.current.params.compute);
  const [var1, setVar1] = useState(pane.current.params.var1);
  const [var2, setVar2] = useState(pane.current.params.var2);


  const folderVars = usePaneFolder(pane, {
    title: 'Variables',
    expanded: false,
  })

  const [drei_var] = usePaneInput(folderVars, 'vName', {
    label: 'Name',
    options: optionsVars,
    value: 'default'
  })
  
  const folderColors = usePaneFolder(pane, {
    title: 'Colors',
    expanded: false,
  })
  const [cmap_texture_name] = usePaneInput(folderColors, 'cmap', {
    label: 'Colormap',
    options: colormaps_array,
    value: 'Spectral'
  })

  const [alpha] = usePaneInput(folderColors, 'alpha', {
    label: 'transparency',
    min: 0,
    max: 255,
    step: 1,
  })
  const [bgcolor] = usePaneInput(folderColors, 'backgroundcolor', {
    label: 'Background Color',
    view: 'color',
    value: "#2d4967",
  })

  const [color_axes] = usePaneInput(folderColors, 'axes', {
    label: 'Axes',
    view: 'color',
    value: "#c8cdd2",
  })

  const [nan_color] = usePaneInput(folderColors, 'nan_color', {
    label: 'nan color',
    view: 'color',
    value: "#000000",
  })

  const [nan_alpha] = usePaneInput(folderColors, 'nan_alpha', {
    label: 'nan transparency',
    min: 0,
    max: 255,
    step: 1,
  })

  const [alpha_intensity] = usePaneInput(folderColors, 'alpha_intensity', {
    label: 'intensity',
    min: 1.0,
    max: 15.0,
    step: 0.1,
  })

  useLayoutEffect(() => {
    if (!pane.current?.instance) return;
    const pane_tab = pane.current.instance;    
    const folderDims = pane_tab.addFolder({
      title: 'Explore Dimensions',
      expanded: false,
    });

    const tabs = folderDims.addTab({
      pages: [
        {title: 'x / lon'},
        {title: 'y / lat'},
        {title: 'time'},
      ],
    });
    
    const binding_lomn = tabs.pages[0].addBinding(pane.current.params, 'lonmin', {
      label: 'min',
      min: -180.0,
      max: 180.0,
      step: 0.05,
      format: (value) => `${(value).toFixed(1)}°`,
    });

    const binding_lomx = tabs.pages[0].addBinding(pane.current.params, 'lonmax', {
      label: 'max',
      min: -180,
      max: 180,
      step: 0.05,
      format: (value) => `${(value).toFixed(1)}°`,
    });

    const binding_lamn = tabs.pages[1].addBinding(pane.current.params, 'latmin', {
      label: 'min',
      min: -90.0,
      max: 90.0,
      step: 0.05,
      format: (value) => `${(value).toFixed(1)}°`,
    });

    const binding_lamx = tabs.pages[1].addBinding(pane.current.params, 'latmax', {
      label: 'max',
      min: -90.0,
      max: 90.0,
      step: 0.05,
      format: (value) => `${(value).toFixed(1)}°`,
    });

    const binding_tmn = tabs.pages[2].addBinding(pane.current.params, 'tmin', {
      label: 'min',
      min: timeSlice.min,
      max: timeSlice.max,
      step: 1,
      format: (value) => `${(value).toFixed(0)}steps`,
    });

    const binding_tmx = tabs.pages[2].addBinding(pane.current.params, 'tmax', {
      label: 'max',
      min: timeSlice.min,
      max: timeSlice.max,
      step: 1,
      format: (value) => `${(value).toFixed(0)}steps`,
    });

    const binding_thr_mode = folderDims.addBinding(pane.current.params, 'thresholdMode',
      {
        label: 'Threshold Mode',
        value: false,
      }
    )
    
    binding_thr_mode.on('change', (event) => {
      setthresholdMode(event.value);
      const newLabel = event.value ? 'Max Threshold' : 'Min Threshold';
      binding_thr.label = newLabel;
    });

    const binding_thr = folderDims.addBinding(pane.current.params, 'threshold',
      {
        label: thresholdMode ? 'Max Threshold' : 'Min Threshold',
        value: 0.0,
        min: 0.0,
        max: 1.0,
        step: 0.001,
      }
    )

    binding_thr.on('change', (event) => {
      setthreshold(event.value);
    });

    const binding_interval = folderDims.addBinding(pane.current.params, 'timeSlice',
      {
        label: 'time range',
        min: 1,
        max: 100,
        step: 1,
      }
    )

    binding_interval.on('change', (event) => {
      settimeSlice(event.value);
    });
    // Update the local state whenever lonmax changes
    binding_lomn.on('change', (event) => {
      const normalizedValue = normalizeInterval(event.value, -180, 180);
      setLonmin(normalizedValue);
    });

    binding_lomx.on('change', (event) => {
      const normalizedValue = normalizeInterval(event.value, -180, 180);
      setLonmax(normalizedValue);
    });

    binding_lamn.on('change', (event) => {
      const normalizedValue = normalizeInterval(event.value, -90, 90);
      setLatmin(normalizedValue);
    });
    binding_lamx.on('change', (event) => {
      const normalizedValue = normalizeInterval(event.value, -90, 90);
      setLatmax(normalizedValue);
    });

    binding_tmn.on('change', (event) => {
      const normalizedValue = normalizeInterval(event.value, timeSlice.min, timeSlice.max);
      settmin(normalizedValue);
    });
    binding_tmx.on('change', (event) => {
      const normalizedValue = normalizeInterval(event.value, timeSlice.max, timeSlice.min);
      settmax(normalizedValue);
    });

    const folderAnalytics = pane_tab.addFolder({
      title: 'Analytics',
      expanded: false,
    });

    const stats = folderAnalytics.addTab({
      pages: [
        {title: 'r'},
        {title: 'mask'},
      ],
    });

    const PARAMS = {
      message: '',
    };
    const paramDesc = stats.pages[0].addBinding(PARAMS, 'message',
        {
        label: 'Pearson correlation',
        }
        );
    paramDesc.disabled = true;

    const binding_rv1 = stats.pages[0].addBinding(pane.current.params, 'var1', {
        label: 'Variable 1',
        options: optionsVars,
        value: 'default'
    })

    binding_rv1.on('change', (event) => {
      setVar1(event.value);
    });

    const binding_rv2 = stats.pages[0].addBinding(pane.current.params, 'var2', {
        label: 'Variable 2',
        options: optionsVars,
        value: 'default'
    })

    binding_rv2.on('change', (event) => {
      setVar2(event.value);
    });

    const binding_rcompute = stats.pages[0].addBinding(pane.current.params, 'compute', {
      label: 'Apply function',
      value: false
    });

    binding_rcompute.on('change', (event) => {
      setCompute(event.value);
    });

    const binding_mask_compute = stats.pages[1].addBinding(pane.current.params, 'compute', {
      label: 'Apply function',
      value: false
    });

    binding_mask_compute.on('change', (event) => {
      setCompute(event.value);
    });

    const tabs_mnmx = folderAnalytics.addTab({
      pages: [
        {title: 'min'},
        {title: 'max'},
        {title: 'mean'},
      ],
    });
    console.log(tabs_mnmx)

    return () => {
      if (binding_lomn) {
      binding_lomn.dispose(); // Dispose of the binding on cleanup
      }
      if (binding_lomx) {
      binding_lomx.dispose();
      }
      if (binding_lamn) {
        binding_lamn.dispose(); // Dispose of the binding on cleanup
        }
      if (binding_lamx) {
      binding_lamx.dispose();
      }
      if (binding_tmn) {
        binding_tmn.dispose(); // Dispose of the binding on cleanup
        }
      if (binding_tmx) {
      binding_tmx.dispose();
      }
      if (binding_thr_mode) {
        binding_thr_mode.dispose();
        }
      if (binding_thr) {
      binding_thr.dispose();
      }
      if (binding_interval) {
        binding_interval.dispose();
        }
      if (binding_mask_compute) {
        binding_mask_compute.dispose();
        }
      if (binding_rcompute) {
        binding_rcompute.dispose();
        }
      if (binding_rv1) {
        binding_rv1.dispose();
        }
      if (binding_rv2) {
        binding_rv2.dispose();
        }
      if (pane_tab) {
      pane_tab.dispose();
      }
      
    };
  }, [pane]);

  useEffect(() => {
    // Update background color
    document.body.style.backgroundColor = bgcolor;
  }, [bgcolor]);

  return {
    thresholdMode,
    threshold,
    cmap_texture_name,
    drei_var,
    timeSlice,
    lonmax,
    lonmin,
    latmax,
    latmin,
    tmax,
    tmin,
    var1,
    var2,
    compute,
    color_axes,
    alpha_intensity,
    alpha, 
    nan_color, 
    nan_alpha
  }
}