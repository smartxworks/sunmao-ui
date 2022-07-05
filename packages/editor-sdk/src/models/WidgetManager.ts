import { ImplementedWidget, WidgetOptionsMap } from '../types/widget';

class WidgetManger {
  private widgets: Record<string, ImplementedWidget<keyof WidgetOptionsMap>> = {};

  constructor() {
    this.widgets = {};
  }

  registerWidget(widget: ImplementedWidget<keyof WidgetOptionsMap>): void {
    this.widgets[`${widget.version}/${widget.metadata.name}`] = widget;
  }

  getWidget(type: string): ImplementedWidget<keyof WidgetOptionsMap> | null {
    return this.widgets[type] || null;
  }
}

export default WidgetManger;
