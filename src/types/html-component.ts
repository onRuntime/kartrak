// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HTMLComponent<P, N = React.HTMLAttributes<any>> = {
  /**
   * The root element.
   */
  as?: React.ElementType;
  /**
   * The content, duh.
   */
  children?: React.ReactNode;
} & P &
  Partial<Omit<N, keyof P>>;
