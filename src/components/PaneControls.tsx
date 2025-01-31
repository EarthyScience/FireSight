import { useEffect, useMemo, useState, useLayoutEffect } from 'react';
import { usePaneFolder, usePaneInput, useTweakpane } from '../../pane'
import { All_vars } from '../utils/variables_forcing.json'
import { createBinding, normalizeInterval } from './binding_utils';
import { BladeApi } from 'tweakpane';

type PaneParams = {
    backgroundcolor: string;
    axes: string;
    nan_color: string;
    alpha: number;
    nan_alpha: number;
    alpha_intensity: number;
    thresholdMode: boolean;
    threshold: number;
    cmap: string;
    vName: string;
    description: string;
    timeSlice: { min: number; max: number };
    lonmax: number;
    lonmin: number;
    latmax: number;
    latmin: number;
    tmin: number;
    tmax: number;
    analysis: string;
    var1: string;
    var2: string;
    compute: boolean;
};

type BindingConfig = {
    container: any;
    paramKey: keyof PaneParams;
    options: {
        label?: string;
        min?: number;
        max?: number;
        step?: number;
        format?: (value: number) => string;
        options?: Array<{text: string, value: string}>;
    };
    handler: (value: any) => void;
};

export function useControlPane(containerID: string) {
    const container = document.getElementById(containerID) ?? undefined;
    
    const optionsVars = useMemo(() => All_vars.map((element) => ({
        text: element,
        value: element
    })), []);

    const colormaps = useMemo(() => ['viridis', 'plasma', 'inferno', 'magma', 'Accent', 'Blues',
        'CMRmap', 'twilight', 'tab10', 'gist_earth', 'cividis',
        'Spectral', 'gist_stern', 'gnuplot', 'gnuplot2', 'ocean', 'turbo',
        'GnBu', 'afmhot', 'cubehelix', 'hot', 'spring','terrain', 'winter', 'Wistia',
    ], []);

    const colormaps_array = useMemo(() => colormaps.map(colormap => ({
        text: colormap,
        value: colormap
    })), [colormaps]);

    const pane = useTweakpane<PaneParams>(
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
            title: 'Axes',
            expanded: false,
        });

        const tabs = folderDims.addTab({
            pages: [
                {title: 'x / lon'},
                {title: 'y / lat'},
                {title: 'time'},
            ],
        });
        
        const bindingConfigs: BindingConfig[] = [
            {
                container: tabs.pages[0],
                paramKey: 'lonmin',
                options: {
                    label: 'min',
                    min: -180.0,
                    max: 180.0,
                    step: 0.05,
                    format: (value) => `${(value).toFixed(1)}°`
                },
                handler: (value) => {
                    const normalizedValue = normalizeInterval(value, -180, 180);
                    setLonmin(normalizedValue);
                }
            },
            {
                container: tabs.pages[0],
                paramKey: 'lonmax',
                options: {
                    label: 'max',
                    min: -180,
                    max: 180,
                    step: 0.05,
                    format: (value) => `${(value).toFixed(1)}°`
                },
                handler: (value) => {
                    const normalizedValue = normalizeInterval(value, -180, 180);
                    setLonmax(normalizedValue);
                }
            },
            {
                container: tabs.pages[1],
                paramKey: 'latmin',
                options: {
                    label: 'min',
                    min: -90.0,
                    max: 90.0,
                    step: 0.05,
                    format: (value) => `${(value).toFixed(1)}°`
                },
                handler: (value) => {
                    const normalizedValue = normalizeInterval(value, -90, 90);
                    setLatmin(normalizedValue);
                }
            },
            {
                container: tabs.pages[1],
                paramKey: 'latmax',
                options: {
                    label: 'max',
                    min: -90.0,
                    max: 90.0,
                    step: 0.05,
                    format: (value) => `${(value).toFixed(1)}°`
                },
                handler: (value) => {
                    const normalizedValue = normalizeInterval(value, -90, 90);
                    setLatmax(normalizedValue);
                }
            },
            {
                container: tabs.pages[2],
                paramKey: 'tmin',
                options: {
                    label: 'min',
                    min: timeSlice.min,
                    max: timeSlice.max,
                    step: 1,
                    format: (value) => `${(value).toFixed(0)}steps`
                },
                handler: (value) => {
                    const normalizedValue = normalizeInterval(value, timeSlice.min, timeSlice.max);
                    settmin(normalizedValue);
                }
            },
            {
                container: tabs.pages[2],
                paramKey: 'tmax',
                options: {
                    label: 'max',
                    min: timeSlice.min,
                    max: timeSlice.max,
                    step: 1,
                    format: (value) => `${(value).toFixed(0)}steps`
                },
                handler: (value) => {
                    const normalizedValue = normalizeInterval(value, timeSlice.max, timeSlice.min);
                    settmax(normalizedValue);
                }
            }
        ];

        const bindings: {binding: BladeApi, dispose: () => void}[] = bindingConfigs.map(config => 
            createBinding(
                config.container, 
                pane.current.params, 
                config.paramKey, 
                config.options, 
                config.handler
            )
        );

        const { binding: bindingThrMode, dispose: disposeThrMode } = createBinding(
            folderDims, 
            pane.current.params, 
            'thresholdMode',
            { label: 'Threshold Mode' },
            (value) => {
                setthresholdMode(value as boolean);
            }
        );
        console.log(bindingThrMode)
        const { binding: bindingThr, dispose: disposeThr } = createBinding(
            folderDims, 
            pane.current.params, 
            'threshold',
            { 
                label: thresholdMode ? 'Max Threshold' : 'Min Threshold',
                min: 0.0,
                max: 1.0,
                step: 0.001
            },
            (value) => {
                setthreshold(value as number);
            }
        );
        console.log(bindingThr)

        const { binding: bindingInterval, dispose: disposeInterval } = createBinding(
            folderDims, 
            pane.current.params, 
            'timeSlice',
            { 
                label: 'time range',
                min: 1,
                max: 100,
                step: 1
            },
            (value) => {
                settimeSlice(value as { min: number; max: number });
            }
        );
        console.log(bindingInterval)

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

        const PARAMS = { message: '' };
        const paramDesc = stats.pages[0].addBinding(PARAMS, 'message', {
            label: 'Pearson correlation',
        });
        paramDesc.disabled = true;

        const { binding: bindingRv1, dispose: disposeRv1 } = createBinding(
            stats.pages[0], 
            pane.current.params, 
            'var1',
            { 
                label: 'Variable 1',
                options: optionsVars,
                value: 'default'
            },
            (value) => {
                setVar1(value as string);
            }
        );
        console.log(bindingRv1)

        const { binding: bindingRv2, dispose: disposeRv2 } = createBinding(
            stats.pages[0], 
            pane.current.params, 
            'var2',
            { 
                label: 'Variable 2',
                options: optionsVars,
                value: 'default'
            },
            (value) => {
                setVar2(value as string);
            }
        );
        console.log(bindingRv2)

        const { binding: bindingRcompute, dispose: disposeRcompute } = createBinding(
            stats.pages[0], 
            pane.current.params, 
            'compute',
            { 
                label: 'Apply function',
                value: false
            },
            (value) => {
                setCompute(value as boolean);
            }
        );
        console.log(bindingRcompute)

        const { binding: bindingMaskCompute, dispose: disposeMaskCompute } = createBinding(
            stats.pages[1], 
            pane.current.params, 
            'compute',
            { 
                label: 'Apply function',
                value: false
            },
            (value) => {
                setCompute(value as boolean);
            }
        );
        console.log(bindingMaskCompute)

        const tabs_mnmx = folderAnalytics.addTab({
            pages: [
                {title: 'min'},
                {title: 'max'},
                {title: 'mean'},
            ],
        });
        console.log(tabs_mnmx)

        return () => {
            bindings.forEach(b => b.dispose());
            [
                disposeThrMode, 
                disposeThr, 
                disposeInterval, 
                disposeRv1, 
                disposeRv2, 
                disposeRcompute, 
                disposeMaskCompute
            ].forEach(dispose => dispose());

            if (pane_tab) {
                pane_tab.dispose();
            }
        };
    }, [pane]);

    useEffect(() => {
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