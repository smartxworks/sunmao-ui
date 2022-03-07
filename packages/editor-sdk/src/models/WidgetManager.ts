import { ImplementedWidget } from '../types/widget';

class WidgetManger {
  private widgets: Record<string, ImplementedWidget> = {};

  constructor() {
    this.widgets = {};
  }

  registerWidget(widget: ImplementedWidget): void {
    this.widgets[`${widget.version}/${widget.metadata.name}`] = widget;
  }
  
  getWidget (type: string): ImplementedWidget | null {
    return this.widgets[type] || null;
  }
}

export default WidgetManger;
