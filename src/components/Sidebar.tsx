"use client";

import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  Home,
} from "lucide-react";
import { FolderNode } from "@/lib/google-drive";

interface SidebarProps {
  folderTree: FolderNode | null;
  selectedFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
}

function FolderItem({
  folder,
  selectedFolderId,
  onSelectFolder,
  depth,
}: {
  folder: FolderNode;
  selectedFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
  depth: number;
}) {
  const [expanded, setExpanded] = useState(depth === 0);
  const isSelected = selectedFolderId === folder.id;
  const hasSubfolders = folder.subfolders.length > 0;

  return (
    <div>
      <button
        onClick={() => {
          onSelectFolder(folder.id);
          if (hasSubfolders) setExpanded(!expanded);
        }}
        className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
          isSelected
            ? "bg-packers-gold text-packers-green-dark font-semibold"
            : "text-gray-300 hover:bg-packers-green-light hover:text-white"
        }`}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
      >
        {hasSubfolders ? (
          expanded ? (
            <ChevronDown size={14} className="flex-shrink-0" />
          ) : (
            <ChevronRight size={14} className="flex-shrink-0" />
          )
        ) : (
          <span className="w-3.5" />
        )}
        <Folder
          size={16}
          className={`flex-shrink-0 ${
            isSelected ? "text-packers-green-dark" : "text-packers-gold"
          }`}
        />
        <span className="truncate flex-1 text-left">{folder.name}</span>
        <span
          className={`text-xs px-1.5 py-0.5 rounded-full flex-shrink-0 ${
            isSelected
              ? "bg-packers-green-dark text-packers-gold"
              : "bg-packers-green text-gray-400"
          }`}
        >
          {folder.fileCount}
        </span>
      </button>

      {expanded && hasSubfolders && (
        <div>
          {folder.subfolders.map((sub) => (
            <FolderItem
              key={sub.id}
              folder={sub}
              selectedFolderId={selectedFolderId}
              onSelectFolder={onSelectFolder}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({
  folderTree,
  selectedFolderId,
  onSelectFolder,
  isOpen,
  onClose,
  loading,
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-packers-green-dark z-30 pt-[60px] flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:pt-0 lg:z-auto ${
          isOpen ? "translate-x-0 animate-slide-in" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="px-4 py-4 border-b border-packers-green">
          <p className="text-packers-gold text-xs uppercase tracking-wider font-semibold mb-3">
            Folders
          </p>
          <button
            onClick={() => onSelectFolder(null)}
            className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
              selectedFolderId === null
                ? "bg-packers-gold text-packers-green-dark font-semibold"
                : "text-gray-300 hover:bg-packers-green-light hover:text-white"
            }`}
          >
            <Home size={16} />
            <span>All Documents</span>
          </button>
        </div>

        {/* Folder tree */}
        <nav className="flex-1 overflow-y-auto px-2 py-2">
          {loading ? (
            <div className="space-y-2 px-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-8 skeleton rounded" />
              ))}
            </div>
          ) : folderTree ? (
            folderTree.subfolders.map((folder) => (
              <FolderItem
                key={folder.id}
                folder={folder}
                selectedFolderId={selectedFolderId}
                onSelectFolder={onSelectFolder}
                depth={0}
              />
            ))
          ) : (
            <p className="text-gray-500 text-sm px-3 py-4">
              No folders found
            </p>
          )}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-packers-green">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span>Connected to Google Drive</span>
          </div>
        </div>
      </aside>
    </>
  );
}
