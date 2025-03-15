declare module 'class-variance-authority' {
  export function cva(base: string, config?: any): any;
  export type VariantProps<T> = T extends ((...args: any) => infer U) ? U : never;
} 