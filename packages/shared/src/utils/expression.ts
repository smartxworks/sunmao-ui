import { EXPRESSION } from '../constants/expression';

export type ExpChunk = string | ExpChunk[];

// copy and modify from
// https://stackoverflow.com/questions/68161410/javascript-parse-multiple-brackets-recursively-from-a-string
export const parseExpression = (rawExp: string): ExpChunk[] => {
  const exp = rawExp.trim();

  function lexer(str: string): string[] {
    let token = '';
    let chars = '';
    let charsNext = '';
    let i = 0;
    const res = [];
    const collectToken = () => {
      if (token) {
        res.push(token);
        token = '';
      }
    };
    while ((chars = str.slice(i, i + EXPRESSION.START.length))) {
      switch (chars) {
        case EXPRESSION.START:
          // move cursor
          i += EXPRESSION.START.length;
          collectToken();
          res.push(chars);
          break;
        case EXPRESSION.END: {
          let j = i + 1;
          // looking ahead
          while ((charsNext = str.slice(j, j + EXPRESSION.END.length))) {
            if (charsNext === EXPRESSION.END) {
              token += str[i];
              // move two cursors
              j++;
              i++;
            } else {
              // move cursor
              i += EXPRESSION.END.length;
              collectToken();
              res.push(chars);
              break;
            }
          }
          break;
        }
        default:
          token += str[i];
          // move cursor
          i++;
      }
    }
    if (token) {
      res.push(token);
    }
    return res;
  }

  function build(tokens: string[]): ExpChunk[] {
    const result: ExpChunk[] = [];
    let item;

    while ((item = tokens.shift())) {
      if (item === EXPRESSION.END) return result;
      result.push(item === EXPRESSION.START ? build(tokens) : item);
    }
    return result;
  }

  const tokens = lexer(exp);
  const result = build(tokens);

  return result;
};

export const expChunkToString = (exps: ExpChunk[]): string => {
  return exps
    .map(expOrExpChunk => {
      if (expOrExpChunk instanceof Array) {
        return `{{${expChunkToString(expOrExpChunk)}}}`;
      }

      return expOrExpChunk;
    })
    .join('');
};
