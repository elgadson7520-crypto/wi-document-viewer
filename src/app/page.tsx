"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import DocumentGrid from "@/components/DocumentGrid";
import DocumentViewer from "@/components/DocumentViewer";
import { DriveFileInfo, FolderNode } from "@/lib/google-drive";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [folderTree, setFolderTree] = useState<FolderNode | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [files, setFiles] = useState<DriveFileInfo[]>([]);
  const [viewingFile, setViewingFile] = useState<DriveFileInfo | null>(null);

  const [loadingTree, setLoadingTree] = useState(true);
  const [loadingFiles, setLoadingFiles] = useState(true);

  // Fetch folder tree
  const fetchFolderTree = useCallback(async () => {
    setLoadingTree(true);
    try {
      const res = await fetch("/api/drive/folder");
      if (res.ok) {
        const data = await res.json();
        setFolderTree(data);
      }
    } catch (err) {
      console.error("Failed to load folder tree:", err);
    } finally {
      setLoadingTree(false);
    }
  }, []);

  // Fetch files for selected folder
  const fetchFiles = useCallback(async () => {
    setLoadingFiles(true);
    try {
      const params = selectedFolderId
        ? `?folderId=${selectedFolderId}`
        : "";
      const res = await fetch(`/api/drive/files${params}`);
      if (res.ok) {
        const data = await res.json();
        setFiles(data.files || []);
      } else {
        setFiles([]);
      }
    } catch (err) {
      console.error("Failed to load files:", err);
      setFiles([]);
    } finally {
      setLoadingFiles(false);
    }
  }, [selectedFolderId]);

  useEffect(() => {
    fetchFolderTree();
  }, [fetchFolderTree]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // Get the current folder name
  const getCurrentFolderName = (): string => {
    if (!selectedFolderId) return "All Documents";
    if (!folderTree) return "Documents";

    const findFolder = (node: FolderNode): string | null => {
      if (node.id === selectedFolderId) return node.name;
      for (const sub of node.subfolders) {
        const found = findFolder(sub);
        if (found) return found;
      }
      return null;
    };

    return findFolder(folderTree) || "Documents";
  };

  return (
    <div className="flex flex-col h-screen">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          folderTree={folderTree}
          selectedFolderId={selectedFolderId}
          onSelectFolder={(id) => {
            setSelectedFolderId(id);
            setSidebarOpen(false);
          }}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          loading={loadingTree}
        />

        <DocumentGrid
          files={files}
          folderName={getCurrentFolderName()}
          loading={loadingFiles}
          searchQuery={searchQuery}
          filter={filter}
          onFilterChange={setFilter}
          sort={sort}
          onSortChange={setSort}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onViewFile={setViewingFile}
          onRetry={fetchFiles}
        />
      </div>

      <DocumentViewer file={viewingFile} onClose={() => setViewingFile(null)} />
    </div>
  );
}
