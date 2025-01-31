import { BladeApi } from 'tweakpane';

type ChangeEvent<T> = { value: T };
type BindingChangeHandler<T> = (value: T) => void;

export function createBinding<T>(
  container: any, 
  params: any, 
  paramKey: string, 
  options: {
    label?: string;
    min?: number;
    max?: number;
    step?: number;
    options?: Array<{text: string, value: string}>;
    view?: string;
    format?: (value: any) => string;
    value?: any;  // Add value option
  } = {},
  onChangeHandler?: BindingChangeHandler<T>
): {
  binding: BladeApi;
  dispose: () => void;
} {
  // Set initial value in params if provided
  if (options.value !== undefined) {
    params[paramKey] = options.value;
  }

  // Create the binding with provided options
  const binding = container.addBinding(params, paramKey, {
    label: options.label,
    min: options.min,
    max: options.max,
    step: options.step,
    options: options.options,
    view: options.view,
    format: options.format,
    value: options.value  // Include value in binding options
  });

  // If a change handler is provided, set up the change event
  if (onChangeHandler) {
    binding.on('change', (event: ChangeEvent<T>) => {
      onChangeHandler(event.value);
    });
  }

  return {
    binding,
    dispose: () => binding.dispose()
  };
}

export function normalizeInterval(value: number, a: number, b: number): number {
  return (2 * (value - a)) / (b - a) - 1;
}