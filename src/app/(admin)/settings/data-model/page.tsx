"use client";

import { 
  Search, FolderPlus, Plus, Save, Download, ChevronRight, ChevronDown, 
  MoreVertical, Server, Folder, Link as LinkIcon, FileText, Database, 
  Code, EyeOff, Type, GripVertical, Sparkles, ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Tree, NodeModel } from "@minoru/react-dnd-treeview";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// Map string names to Lucide icons
const ICONS: Record<string, any> = {
  Folder, LinkIcon, FileText, Database, Code, EyeOff, Type
};

type CustomData = {
  iconName: string;
  iconColor: string;
  note?: string;
};

// Initial state representing the exact provided nested list
const initialData: NodeModel<CustomData>[] = [
  { id: 1, parent: 0, droppable: true, text: 'system_administration', data: { iconName: 'Folder', iconColor: 'text-purple-500' } },
  { id: 2, parent: 1, droppable: true, text: 'websites', data: { iconName: 'Folder', iconColor: 'text-purple-500' } },
  { id: 3, parent: 2, droppable: false, text: 'domains', data: { iconName: 'LinkIcon', iconColor: 'text-blue-500' } },
  { id: 4, parent: 2, droppable: true, text: 'pages', data: { iconName: 'FileText', iconColor: 'text-purple-500' } },
  { id: 5, parent: 4, droppable: true, text: 'pages_sections', data: { iconName: 'EyeOff', iconColor: 'text-gray-400' } },
  { id: 6, parent: 4, droppable: true, text: 'pages_sections_all', data: { iconName: 'EyeOff', iconColor: 'text-gray-400', note: 'Thông tin được dùng để xác định trong một page chứa những section nào' } },
  { id: 7, parent: 2, droppable: true, text: 'elements', data: { iconName: 'Database', iconColor: 'text-blue-500' } },
  { id: 8, parent: 7, droppable: true, text: 'sections', data: { iconName: 'Code', iconColor: 'text-purple-500' } },
  { id: 9, parent: 8, droppable: true, text: 'sections_detail', data: { iconName: 'EyeOff', iconColor: 'text-gray-400' } },
  { id: 10, parent: 8, droppable: true, text: 'sections_blocks', data: { iconName: 'EyeOff', iconColor: 'text-gray-400' } },
  { id: 11, parent: 10, droppable: true, text: 'sections_blocks_collection_fields', data: { iconName: 'EyeOff', iconColor: 'text-gray-400' } },
  { id: 12, parent: 10, droppable: true, text: 'sections_blocks_sitemap', data: { iconName: 'EyeOff', iconColor: 'text-gray-400' } },
  { id: 13, parent: 7, droppable: true, text: 'navigations', data: { iconName: 'LinkIcon', iconColor: 'text-blue-500' } },
  { id: 14, parent: 13, droppable: true, text: 'websites_navigations_1', data: { iconName: 'EyeOff', iconColor: 'text-gray-400' } },
  { id: 15, parent: 13, droppable: true, text: 'websites_navigations', data: { iconName: 'EyeOff', iconColor: 'text-gray-400' } },
  { id: 16, parent: 7, droppable: true, text: 'forms', data: { iconName: 'Type', iconColor: 'text-purple-500' } },
];

export default function DataModelPage() {
  const [treeData, setTreeData] = useState<NodeModel<CustomData>[]>(initialData);

  const handleDrop = (newTree: NodeModel<CustomData>[]) => {
    setTreeData(newTree);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-full bg-white relative">
        {/* Header */}
        <header className="h-[72px] border-b border-gray-200 flex items-center justify-between px-6 shrink-0 bg-white">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <Server size={20} />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Cài đặt</div>
              <h1 className="text-xl font-bold text-[#14233b]">Mô Hình Dữ Liệu</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-gray-500">
            <ActionButton icon={Search} />
            <ActionButton icon={FolderPlus} />
            <ActionButton icon={Plus} primary />
            <ActionButton icon={Save} disabled />
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Core Content */}
          <div className="flex-1 overflow-y-auto p-8 bg-[#f8fafc]">
            <div className="max-w-[1000px] mx-auto">
              <div className="flex justify-end mb-4">
                <button className="text-sm text-gray-500 hover:text-gray-700 font-medium">Mở rộng Tất cả / None</button>
              </div>

              {/* Tree Root Container */}
              <div className="text-sm">
                <Tree
                  tree={treeData}
                  rootId={0}
                  onDrop={handleDrop}
                  initialOpen={true}
                  classes={{
                    root: "treeRoot",
                    draggingSource: "opacity-50",
                    dropTarget: "bg-blue-50/50 rounded-md",
                  }}
                  render={(node, { depth, isOpen, onToggle }) => (
                    <CustomNode
                      node={node as NodeModel<CustomData>}
                      depth={depth}
                      isOpen={isOpen}
                      onToggle={onToggle}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="w-[300px] border-l border-gray-200 bg-white flex flex-col pt-6 shrink-0 relative">
            <div className="px-6 flex flex-col gap-4">
              <button className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-black transition-colors">
                <Download size={18} className="text-gray-400" />
                Export Schema
              </button>
            </div>
            
            <button className="absolute left-[-16px] top-6 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 shadow-sm z-10">
              <ChevronLeft size={16} />
            </button>

            <div className="mt-auto border-t border-gray-200 p-4">
              <button className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-black transition-colors w-full">
                <Sparkles size={18} className="text-purple-500" />
                AI Assistant
              </button>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

function CustomNode({ 
  node, 
  depth, 
  isOpen, 
  onToggle 
}: { 
  node: NodeModel<CustomData>; 
  depth: number; 
  isOpen: boolean; 
  onToggle: () => void;
}) {
  const { iconName, iconColor, note } = node.data || { iconName: "FileText", iconColor: "text-gray-400" };
  const Icon = ICONS[iconName] || FileText;
  const hasChildren = node.droppable; 

  return (
    <div 
      className="flex items-center h-[42px] group bg-white hover:bg-gray-50 transition-colors pr-2 cursor-pointer border border-[#e2e8f0] rounded-md mb-2 shadow-sm"
      style={{ marginLeft: `${depth * 32}px` }}
    >
      <div className="flex items-center gap-3 flex-1 h-full pl-2">
        {/* Drag Handle & Expand Icon */}
        <div className="flex items-center gap-1 w-10 shrink-0 text-gray-300">
          <GripVertical size={16} className="opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing hover:text-gray-500" />
          <div onClick={(e) => { e.stopPropagation(); hasChildren && onToggle(); }} className="flex items-center justify-center w-5 h-5 hover:bg-gray-200 rounded text-gray-400 transition-colors">
             {hasChildren ? (
              isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
             ) : <div className="w-4" />}
          </div>
        </div>
        
        {/* Node Icon */}
        <Icon size={16} className={iconColor} />
        
        {/* Label and Note */}
        <div className="flex items-center flex-1 min-w-0" onClick={() => hasChildren && onToggle()}>
          <span className="font-mono text-[13px] text-[#4f46e5] font-semibold tracking-tight">{node.text}</span>
          {note && (
             <span className="ml-3 text-[12.5px] font-mono text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity truncate">
               {note}
             </span>
          )}
        </div>
      </div>
      
      {/* Actions */}
      <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded hover:bg-gray-100">
        <MoreVertical size={14} />
      </button>
    </div>
  );
}

function ActionButton({ icon: Icon, primary, disabled }: { icon: any, primary?: boolean, disabled?: boolean }) {
  return (
    <button className={cn(
      "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
      primary 
        ? "bg-[#5340FF] text-white hover:bg-[#4330EF] shadow-md shadow-[#5340FF]/20" 
        : disabled
          ? "bg-gray-100 text-gray-300 cursor-not-allowed"
          : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
    )} disabled={disabled}>
      <Icon size={primary ? 20 : 18} strokeWidth={primary ? 2.5 : 2} />
    </button>
  );
}
