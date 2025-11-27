import { Droppable } from "@hello-pangea/dnd";
import type { Column as ColumnType, Task } from "../types";
import TaskCard from "./TaskCard";

interface Props {
  column: ColumnType;
  tasks: Task[];
}

const Column = ({ column, tasks }: Props) => {
  // Column color accent
  const getColumnAccent = () => {
    switch (column.id) {
      case 'col-1': return 'border-zinc-700';
      case 'col-2': return 'border-brand';
      case 'col-3': return 'border-accent';
      default: return 'border-dark-border';
    }
  };

  const getColumnGlow = () => {
    switch (column.id) {
      case 'col-2': return 'shadow-[0_0_15px_rgba(139,92,246,0.15)]';
      case 'col-3': return 'shadow-[0_0_15px_rgba(217,70,239,0.15)]';
      default: return '';
    }
  };

  return (
    <div className={`
      bg-dark-card rounded-2xl border border-dark-border 
      min-w-[340px] flex-1 flex flex-col 
      shadow-card transition-all duration-300
      ${getColumnGlow()}
    `}>
      
      {/* Header with accent border */}
      <div className={`border-b-2 ${getColumnAccent()} px-6 py-5 rounded-t-2xl bg-dark-surface/50`}>
        <div className="flex justify-between items-center gap-3">
          <h2 className="text-lg font-bold text-white tracking-wide">
            {column.title}
          </h2>
          <span className="text-sm font-bold text-text-secondary bg-dark-bg px-3 py-1 rounded-full border border-dark-border">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Droppable Area - Clean Layout */}
      <Droppable droppableId={column.id.toString()}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`
              flex-1 p-4 space-y-4
              min-h-[400px]
              transition-colors rounded-b-2xl
              ${snapshot.isDraggingOver ? "bg-brand/5" : ""}
            `}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;