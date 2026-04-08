"use client";

import {
  Eye,
  Download,
  FileText,
  Image as ImageIcon,
  File,
  LayoutGrid,
  List,
  Filter,
  ArrowUpDown,
  RefreshCw,
} from "lucide-react";
import { DriveFileInfo } from "@/lib/google-drive";

interface DocumentGridProps {
  files: DriveFileInfo[];
  folderName: string;
  loading: boolean;
  searchQuery: string;
  filter: string;
  onFilterChange: (filter: string) => void;
  sort: string;
  onSortChange: (sort: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onViewFile: (file: DriveFileInfo) => void;
  onRetry: () => void;
}

function getFileTypeBadge(mimeType: string) {
  if (mimeType.includes("pdf")) return { label: "PDF", color: "bg-red-500" };
  if (mimeType.startsWith("image/"))
    return { label: "IMG", color: "bg-blue-500" };
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel"))
    return { label: "XLS", color: "bg-green-600" };
  if (mimeType.includes("document") || mimeType.includes("word"))
    return { label: "DOC", color: "bg-blue-700" };
  if (mimeType.includes("presentation") || mimeType.includes("powerpoint"))
    return { label: "PPT", color: "bg-orange-500" };
  return { label: "FILE", color: "bg-gray-500" };
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/"))
    return <ImageIcon size={48} className="text-gray-300" />;
  if (mimeType.includes("pdf"))
    return <FileText size={48} className="text-red-300" />;
  return <File size={48} className="text-gray-300" />;
}

function formatSize(bytes: string) {
  const b = parseInt(bytes, 10);
  if (!b || isNaN(b)) return "--";
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr: string) {
  if (!dateStr) return "--";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function DocumentGrid({
  files,
  folderName,
  loading,
  searchQuery,
  filter,
  onFilterChange,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
  onViewFile,
  onRetry,
}: DocumentGridProps) {
  // Filter files
  let filtered = files;
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter((f) => f.name.toLowerCase().includes(q));
  }
  if (filter === "pdf") {
    filtered = filtered.filter((f) => f.mimeType.includes("pdf"));
  } else if (filter === "images") {
    filtered = filtered.filter((f) => f.mimeType.startsWith("image/"));
  }

  // Sort files
  filtered = [...filtered].sort((a, b) => {
    switch (sort) {
      case "name":
        return a.name.localeCompare(b.name);
      case "date":
        return (
          new Date(b.modifiedTime).getTime() -
          new Date(a.modifiedTime).getTime()
        );
      case "size":
        return parseInt(b.size) - parseInt(a.size);
      case "type":
        return a.mimeType.localeCompare(b.mimeType);
      default:
        return 0;
    }
  });

  return (
    <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-packers-green">{folderName}</h2>
          <p className="text-sm text-gray-500">
            {filtered.length} document{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Filter */}
          <div className="relative">
            <Filter size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => onFilterChange(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-packers-gold focus:border-packers-gold appearance-none cursor-pointer"
            >
              <option value="all">All Files</option>
              <option value="pdf">PDFs</option>
              <option value="images">Images</option>
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <ArrowUpDown size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-packers-gold focus:border-packers-gold appearance-none cursor-pointer"
            >
              <option value="name">Name</option>
              <option value="date">Date</option>
              <option value="size">Size</option>
              <option value="type">Type</option>
            </select>
          </div>

          {/* View toggle */}
          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            <button
              onClick={() => onViewModeChange("grid")}
              className={`p-1.5 ${
                viewMode === "grid"
                  ? "bg-packers-green text-white"
                  : "bg-white text-gray-500 hover:bg-gray-100"
              }`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={`p-1.5 ${
                viewMode === "list"
                  ? "bg-packers-green text-white"
                  : "bg-white text-gray-500 hover:bg-gray-100"
              }`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              : "space-y-2"
          }
        >
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`skeleton rounded-lg ${
                viewMode === "grid" ? "h-56" : "h-12"
              }`}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <FileText size={64} className="mb-4" />
          <p className="text-lg font-medium mb-2">No documents found</p>
          <p className="text-sm mb-4">
            {searchQuery
              ? "Try a different search term"
              : "Connect your Google Drive folder to get started"}
          </p>
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 bg-packers-green text-white rounded-lg hover:bg-packers-green-light transition-colors"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      )}

      {/* Grid view */}
      {!loading && filtered.length > 0 && viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((file, index) => {
            const badge = getFileTypeBadge(file.mimeType);
            return (
              <div
                key={file.id}
                className="doc-card bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 cursor-pointer group relative"
                style={{
                  animation: `fadeIn 0.3s ease-out ${index * 50}ms forwards`,
                  opacity: 0,
                }}
                onClick={() => onViewFile(file)}
              >
                {/* Thumbnail */}
                <div className="h-40 bg-gray-50 flex items-center justify-center relative overflow-hidden">
                  {file.thumbnailLink ? (
                    <img
                      src={`/api/drive/file/${file.id}`}
                      alt={file.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        target.parentElement!.classList.add(
                          "flex",
                          "items-center",
                          "justify-center"
                        );
                      }}
                    />
                  ) : (
                    getFileIcon(file.mimeType)
                  )}

                  {/* Type badge */}
                  <span
                    className={`absolute top-2 right-2 ${badge.color} text-white text-xs px-2 py-0.5 rounded font-medium`}
                  >
                    {badge.label}
                  </span>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-packers-green/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewFile(file);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-packers-gold text-packers-green-dark text-sm font-medium rounded-md hover:bg-packers-gold-light transition-colors"
                    >
                      <Eye size={14} />
                      View
                    </button>
                    <a
                      href={`/api/drive/file/${file.id}`}
                      download={file.name}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-packers-green text-sm font-medium rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <Download size={14} />
                      Download
                    </a>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {file.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                    <span>{formatSize(file.size)}</span>
                    <span>-</span>
                    <span>{formatDate(file.modifiedTime)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List view */}
      {!loading && filtered.length > 0 && viewMode === "list" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-packers-green text-white text-sm">
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">
                  Type
                </th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">
                  Size
                </th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">
                  Modified
                </th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((file, index) => {
                const badge = getFileTypeBadge(file.mimeType);
                return (
                  <tr
                    key={file.id}
                    className="border-t border-gray-100 hover:bg-packers-gold/10 cursor-pointer transition-colors"
                    style={{
                      animation: `fadeIn 0.3s ease-out ${index * 30}ms forwards`,
                      opacity: 0,
                    }}
                    onClick={() => onViewFile(file)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getFileIcon(file.mimeType)}
                        <span className="text-sm text-gray-800 truncate max-w-xs">
                          {file.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span
                        className={`${badge.color} text-white text-xs px-2 py-0.5 rounded font-medium`}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
                      {formatSize(file.size)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 hidden lg:table-cell">
                      {formatDate(file.modifiedTime)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewFile(file);
                          }}
                          className="p-1.5 text-packers-green hover:text-packers-gold transition-colors"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <a
                          href={`/api/drive/file/${file.id}`}
                          download={file.name}
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 text-packers-green hover:text-packers-gold transition-colors"
                          title="Download"
                        >
                          <Download size={16} />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
