declare module 'acorn-loose' {
  function parse(
      input: string,
      options?: import('acorn').Options,
  ): import('acorn').Node;
  export { parse };
}
