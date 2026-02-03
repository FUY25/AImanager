import { Sliders, SquaresFour, Table } from '@phosphor-icons/react';

export default function CustomizeView() {
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="bg-bg-elevated border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sliders size={16} className="text-text-tertiary" />
          <h3 className="text-sm font-semibold text-text-primary">Customize Agent Views</h3>
        </div>
        <p className="text-sm text-text-secondary mb-6">
          Create tailored views for each team. Choose the fields and filters that matter most.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-border rounded-md p-4 bg-bg-tertiary">
            <div className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
              <SquaresFour size={16} />
              Kanban configuration
            </div>
            <p className="text-xs text-text-tertiary">
              Set default columns, WIP limits, and card density.
            </p>
          </div>
          <div className="border border-border rounded-md p-4 bg-bg-tertiary">
            <div className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
              <Table size={16} />
              Table configuration
            </div>
            <p className="text-xs text-text-tertiary">
              Choose visible columns and default sorting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
