export class ValidateResult {
  position = {
    componentId: '',
    traitIndex: -1,
  };
  isValid = false
  constructor(
    public message: string,
    componentId = '',
    traitIndex = -1,
    public fix: () => void = () => undefined
  ) {
    this.position.componentId = componentId;
    this.position.traitIndex = traitIndex;
  }
}
