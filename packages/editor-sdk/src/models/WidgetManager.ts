import { Widget } from '../types/widget';

class WidgetManger {
  private widgets: Record<string, Widget> = {};

  constructor() {
    this.widgets = {};
  }

  registerWidget(widget: Widget): void {
    this.widgets[`${widget.version}/${widget.metadata.name}`] = widget;
  }
  
  getWidget (type: string): Widget | null {
    return this.widgets[type] || null;
  }
}

export default WidgetManger;
