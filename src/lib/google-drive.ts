import { google, drive_v3 } from "googleapis";

type DriveFile = drive_v3.Schema$File;

const SCOPES = ["https://www.googleapis.com/auth/drive.readonly"];

const GOOGLE_DOC_MIME_TYPES: Record<string, string> = {
  "application/vnd.google-apps.document": "application/pdf",
  "application/vnd.google-apps.spreadsheet":
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.google-apps.presentation": "application/pdf",
  "application/vnd.google-apps.drawing": "application/pdf",
};

function getAuth() {
  // Method 1: Service Account (preferred)
  if (
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  ) {
    const key = Buffer.from(
      process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
      "base64"
    ).toString("utf-8");
    return new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: key,
      },
      scopes: SCOPES,
    });
  }

  // Method 2: API Key
  if (process.env.GOOGLE_API_KEY) {
    return process.env.GOOGLE_API_KEY;
  }

  // Method 3: OAuth2
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    return oauth2Client;
  }

  throw new Error(
    "No Google authentication method configured. Set GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_SERVICE_ACCOUNT_KEY, or GOOGLE_API_KEY, or GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET."
  );
}

function getDrive() {
  const auth = getAuth();
  if (typeof auth === "string") {
    // API Key: set it globally so all requests include it
    google.options({ auth: auth });
    return google.drive({ version: "v3" });
  }
  return google.drive({ version: "v3", auth });
}

const FILE_FIELDS =
  "id, name, mimeType, size, createdTime, modifiedTime, thumbnailLink, webViewLink, webContentLink, iconLink, parents, description";

export interface DriveFileInfo {
  id: string;
  name: string;
  mimeType: string;
  size: string;
  createdTime: string;
  modifiedTime: string;
  thumbnailLink: string | null;
  webViewLink: string | null;
  webContentLink: string | null;
  iconLink: string | null;
  description: string | null;
}

export interface FolderNode {
  id: string;
  name: string;
  files: DriveFileInfo[];
  subfolders: FolderNode[];
  fileCount: number;
}

function mapFile(file: DriveFile): DriveFileInfo {
  return {
    id: file.id || "",
    name: file.name || "Untitled",
    mimeType: file.mimeType || "",
    size: file.size || "0",
    createdTime: file.createdTime || "",
    modifiedTime: file.modifiedTime || "",
    thumbnailLink: file.thumbnailLink || null,
    webViewLink: file.webViewLink || null,
    webContentLink: file.webContentLink || null,
    iconLink: file.iconLink || null,
    description: file.description || null,
  };
}

export async function listFilesInFolder(
  folderId?: string,
  pageToken?: string
): Promise<{ files: DriveFileInfo[]; nextPageToken?: string }> {
  const drive = getDrive();
  const id = folderId || process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (!id) {
    throw new Error("No folder ID provided and GOOGLE_DRIVE_FOLDER_ID not set");
  }

  const res = await drive.files.list({
    q: `'${id}' in parents and trashed = false`,
    fields: `nextPageToken, files(${FILE_FIELDS})`,
    pageSize: 100,
    pageToken: pageToken || undefined,
    orderBy: "folder,name",
  });

  const files = (res.data.files || []).map(mapFile);
  return {
    files,
    nextPageToken: res.data.nextPageToken || undefined,
  };
}

export async function getFolderStructure(
  folderId?: string
): Promise<FolderNode> {
  const drive = getDrive();
  const id = folderId || process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (!id) {
    throw new Error("No folder ID provided and GOOGLE_DRIVE_FOLDER_ID not set");
  }

  // Get folder metadata
  const folderMeta = await drive.files.get({
    fileId: id,
    fields: "id, name",
  });

  // Get all items in folder
  const res = await drive.files.list({
    q: `'${id}' in parents and trashed = false`,
    fields: `files(${FILE_FIELDS})`,
    pageSize: 1000,
    orderBy: "folder,name",
  });

  const allItems = res.data.files || [];
  const folders = allItems.filter(
    (f) => f.mimeType === "application/vnd.google-apps.folder"
  );
  const files = allItems
    .filter((f) => f.mimeType !== "application/vnd.google-apps.folder")
    .map(mapFile);

  // Recursively get subfolders
  const subfolders = await Promise.all(
    folders.map((folder) => getFolderStructure(folder.id!))
  );

  const totalFiles =
    files.length +
    subfolders.reduce((sum, sf) => sum + sf.fileCount, 0);

  return {
    id,
    name: folderMeta.data.name || "Root",
    files,
    subfolders,
    fileCount: totalFiles,
  };
}

export async function getFileStream(
  fileId: string
): Promise<{ stream: NodeJS.ReadableStream; mimeType: string; fileName: string }> {
  const drive = getDrive();

  // Get file metadata first
  const meta = await drive.files.get({
    fileId,
    fields: "id, name, mimeType",
  });

  const mimeType = meta.data.mimeType || "application/octet-stream";
  const fileName = meta.data.name || "download";

  // If it's a Google Docs type, export as PDF/xlsx
  if (GOOGLE_DOC_MIME_TYPES[mimeType]) {
    const exportMime = GOOGLE_DOC_MIME_TYPES[mimeType];
    const res = await drive.files.export(
      { fileId, mimeType: exportMime },
      { responseType: "stream" }
    );
    return {
      stream: res.data as unknown as NodeJS.ReadableStream,
      mimeType: exportMime,
      fileName: `${fileName}.pdf`,
    };
  }

  // Regular file — download
  const res = await drive.files.get(
    { fileId, alt: "media" },
    { responseType: "stream" }
  );

  return {
    stream: res.data as unknown as NodeJS.ReadableStream,
    mimeType,
    fileName,
  };
}
