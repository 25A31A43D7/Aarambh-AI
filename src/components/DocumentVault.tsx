import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  Upload,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Eye,
  Download,
  AlertCircle,
  FileText,
  RefreshCw,
  X,
  HardDrive,
  Lock,
  Sparkles,
  Maximize2,
  SwitchCamera,
  Check,
} from 'lucide-react';
import { StoredDocument, DocumentType } from '../types';
import {
  getAllVaultDocuments,
  saveVaultDocument,
  deleteVaultDocument,
} from '../utils/documentVaultDB';

const DOC_TYPES: { type: DocumentType; label: string; icon: string; description: string; requiredForBank: boolean }[] = [
  {
    type: 'aadhaar',
    label: 'Aadhaar Card',
    icon: '🪪',
    description: 'Mandatory KYC identity & address verification for PMEGP DBT transfer.',
    requiredForBank: true,
  },
  {
    type: 'pan',
    label: 'PAN Card',
    icon: '💳',
    description: 'Mandatory for bank loan underwriting & business current accounts.',
    requiredForBank: true,
  },
  {
    type: 'land',
    label: 'Land Deed / Registered Lease Deed',
    icon: '📜',
    description: 'Patta, 7/12 extract, or 5-year commercial registered lease agreement.',
    requiredForBank: true,
  },
  {
    type: 'trade',
    label: 'Trade License / Gram Panchayat NOC',
    icon: '🏛️',
    description: 'Local authority clearance or Udhyam MSME registration certificate.',
    requiredForBank: true,
  },
  {
    type: 'caste',
    label: 'Caste / Special Category Certificate',
    icon: '🎖️',
    description: 'Essential for SC/ST/OBC/Women to unlock the 35% PMEGP rural subsidy.',
    requiredForBank: false,
  },
  {
    type: 'bank_statement',
    label: 'Bank Passbook / 6-Mo Statement',
    icon: '🏦',
    description: 'Last 6 months savings bank transactions showing cash flow discipline.',
    requiredForBank: true,
  },
  {
    type: 'other',
    label: 'Machinery Quotation / Other Document',
    icon: '📁',
    description: 'GST invoice quotations from certified machinery suppliers.',
    requiredForBank: false,
  },
];

interface DocumentVaultProps {
  onDocumentChange?: (count: number) => void;
}

export const DocumentVault: React.FC<DocumentVaultProps> = ({ onDocumentChange }) => {
  const [documents, setDocuments] = useState<StoredDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDocType, setSelectedDocType] = useState<DocumentType>('aadhaar');
  const [docTitle, setDocTitle] = useState<string>('Aadhaar Card (Front)');
  const [docNotes, setDocNotes] = useState<string>('');

  // Camera State
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedDataUrl, setCapturedDataUrl] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Lightbox View State
  const [previewDoc, setPreviewDoc] = useState<StoredDocument | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load documents on mount
  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const docs = await getAllVaultDocuments();
      setDocuments(docs);
      if (onDocumentChange) {
        onDocumentChange(docs.length);
      }
    } catch (err) {
      console.error('Failed to load vault documents:', err);
    } finally {
      setLoading(false);
    }
  };

  // Start live camera stream
  const startCamera = async (mode: 'environment' | 'user' = facingMode) => {
    setCameraError(null);
    setCapturedDataUrl(null);
    try {
      // Stop existing stream if running
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser. Please use the file upload option.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      setCameraStream(stream);
      setIsCameraActive(true);

      // Connect stream to video element
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch((e) => console.warn('Video play error:', e));
        }
      }, 100);
    } catch (err: any) {
      console.error('Camera access error:', err);
      let msg = 'Could not access the camera.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = 'Camera permission was denied. Please allow camera permissions in your browser or use the file upload option below.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        msg = 'No camera found on this device. Please upload a photo from your file system.';
      } else if (err.message) {
        msg = err.message;
      }
      setCameraError(msg);
      setIsCameraActive(true); // show modal with error and fallback upload
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
    setCapturedDataUrl(null);
    setCameraError(null);
  };

  // Switch between front & rear camera
  const toggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Capture snapshot from video stream
  const captureSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw the current video frame onto canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    setCapturedDataUrl(dataUrl);

    // Pause stream while previewing snapshot
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  // Save the captured image into IndexedDB
  const handleSaveCaptured = async () => {
    if (!capturedDataUrl) return;

    const newDoc: StoredDocument = {
      id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      docType: selectedDocType,
      title: docTitle.trim() || 'Document Photo',
      fileName: `${selectedDocType}_${Date.now()}.jpg`,
      mimeType: 'image/jpeg',
      dataUrl: capturedDataUrl,
      fileSize: Math.round((capturedDataUrl.length * 3) / 4),
      capturedAt: new Date().toISOString(),
      source: 'camera',
      notes: docNotes.trim() || undefined,
      verified: true,
    };

    try {
      await saveVaultDocument(newDoc);
      stopCamera();
      await loadDocuments();
      setStatusMessage({
        text: `✓ Successfully saved "${newDoc.title}" to secure offline IndexedDB vault!`,
        type: 'success',
      });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err) {
      console.error('Failed to save document:', err);
      setStatusMessage({ text: 'Error saving document to IndexedDB storage.', type: 'error' });
    }
  };

  // Handle manual file upload fallback
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const newDoc: StoredDocument = {
        id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        docType: selectedDocType,
        title: docTitle.trim() || file.name,
        fileName: file.name,
        mimeType: file.type || 'image/jpeg',
        dataUrl,
        fileSize: file.size,
        capturedAt: new Date().toISOString(),
        source: 'upload',
        notes: docNotes.trim() || undefined,
        verified: true,
      };

      try {
        await saveVaultDocument(newDoc);
        if (fileInputRef.current) fileInputRef.current.value = '';
        await loadDocuments();
        setStatusMessage({
          text: `✓ Uploaded and secured "${newDoc.title}" in IndexedDB vault!`,
          type: 'success',
        });
        setTimeout(() => setStatusMessage(null), 4000);
      } catch (err) {
        console.error('Error saving uploaded document:', err);
        setStatusMessage({ text: 'Failed to store document in IndexedDB.', type: 'error' });
      }
    };
    reader.readAsDataURL(file);
  };

  // Delete a document from IndexedDB
  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to remove "${title}" from your offline vault?`)) {
      try {
        await deleteVaultDocument(id);
        await loadDocuments();
        setStatusMessage({ text: `Removed "${title}" from vault.`, type: 'info' });
        setTimeout(() => setStatusMessage(null), 3000);
      } catch (err) {
        console.error('Failed to delete document:', err);
      }
    }
  };

  // Format file size
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Total vault size in KB
  const totalBytes = documents.reduce((acc, d) => acc + d.fileSize, 0);

  // Bank mandatory documents coverage
  const uploadedTypes = new Set(documents.map((d) => d.docType));
  const bankRequired = DOC_TYPES.filter((t) => t.requiredForBank);
  const coveredCount = bankRequired.filter((t) => uploadedTypes.has(t.type)).length;

  return (
    <div className="bg-[#FFFDF8] border-2 border-[#DDD1B8] rounded-2xl p-5 md:p-6 shadow-md space-y-6">
      {/* Vault Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#DDD1B8] gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1E5C4A]/10 text-[#1E5C4A] flex items-center justify-center shrink-0 mt-0.5">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E5F0EB] text-[#1E5C4A] uppercase tracking-wider mb-1">
              <HardDrive className="w-3 h-3 text-[#1E5C4A]" />
              IndexedDB Offline-First Encryption
            </div>
            <h3 className="font-display text-lg md:text-xl font-bold text-[#231F18] m-0">
              Document Vault (Secure Offline Storage)
            </h3>
            <p className="text-xs text-[#5E5648] m-0 mt-0.5">
              Capture or upload original Aadhaar, land deeds, and trade certificates using your device camera. Encrypted and stored locally inside your browser's IndexedDB.
            </p>
          </div>
        </div>

        {/* Storage Metric Pill */}
        <div className="p-2.5 bg-[#FAF7F0] rounded-xl border border-[#DDD1B8] flex items-center gap-3 self-start sm:self-center shrink-0">
          <div>
            <span className="text-[10px] text-[#8C8373] uppercase block font-semibold">Local Vault Storage</span>
            <strong className="text-xs text-[#231F18] block">
              {documents.length} Files ({formatSize(totalBytes)})
            </strong>
          </div>
          <div className="w-8 h-8 rounded-lg bg-[#E5F0EB] text-[#1E5C4A] flex items-center justify-center font-bold text-xs">
            {Math.round((coveredCount / bankRequired.length) * 100)}%
          </div>
        </div>
      </div>

      {/* Status banner */}
      {statusMessage && (
        <div
          className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-[#E5F0EB] text-[#144134] border-[#1E5C4A]/40'
              : statusMessage.type === 'error'
              ? 'bg-[#FBEBEB] text-[#9A2121] border-[#E8A5A5]'
              : 'bg-[#FAF2DC] text-[#785310] border-[#B88628]'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Bank Mandate Clearance Bar */}
      <div className="p-3.5 bg-[#FAF7F0] rounded-xl border border-[#DDD1B8] space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#231F18] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#1E5C4A]" />
            <span>Bank DPR Mandatory Document Readiness</span>
          </span>
          <span className="text-[11px] font-semibold text-[#1E5C4A]">
            {coveredCount} of {bankRequired.length} essential documents secured
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          {bankRequired.map((item) => {
            const hasDoc = uploadedTypes.has(item.type);
            return (
              <div
                key={item.type}
                className={`p-2 rounded-lg border text-center transition-all ${
                  hasDoc
                    ? 'bg-[#E5F0EB] border-[#1E5C4A]/40 text-[#144134]'
                    : 'bg-white border-[#DDD1B8] text-[#8C8373]'
                }`}
              >
                <div className="text-base mb-0.5">{item.icon}</div>
                <span className="text-[10px] font-bold block truncate">{item.label}</span>
                <span className="text-[9px] block mt-0.5">
                  {hasDoc ? '✓ In Vault' : 'Pending'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Capture / Upload Control Panel */}
      <div className="p-4 rounded-xl bg-white border border-[#DDD1B8] space-y-4">
        <h4 className="font-display text-sm font-bold text-[#231F18] m-0 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#B5551E]" />
          <span>Capture New Document to Vault</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Document Type Selector */}
          <div className="sm:col-span-5 space-y-1">
            <label className="block text-[11px] font-bold uppercase text-[#5E5648]">
              Document Category
            </label>
            <select
              value={selectedDocType}
              onChange={(e) => {
                const val = e.target.value as DocumentType;
                setSelectedDocType(val);
                const found = DOC_TYPES.find((d) => d.type === val);
                if (found) setDocTitle(`${found.label}`);
              }}
              className="w-full px-3 py-2 text-xs bg-[#FAF7F0] border border-[#DDD1B8] rounded-xl text-[#231F18] font-medium focus:ring-2 focus:ring-[#1E5C4A] focus:outline-none"
            >
              {DOC_TYPES.map((dt) => (
                <option key={dt.type} value={dt.type}>
                  {dt.icon} {dt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Title input */}
          <div className="sm:col-span-4 space-y-1">
            <label className="block text-[11px] font-bold uppercase text-[#5E5648]">
              Document Name / Sub-label
            </label>
            <input
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              placeholder="e.g. Aadhaar Front / Patta Deed 2026"
              className="w-full px-3 py-2 text-xs bg-[#FAF7F0] border border-[#DDD1B8] rounded-xl text-[#231F18] font-medium focus:ring-2 focus:ring-[#1E5C4A] focus:outline-none"
            />
          </div>

          {/* Action Trigger Buttons */}
          <div className="sm:col-span-3 flex items-end gap-2">
            <button
              type="button"
              id="vault_camera_btn"
              onClick={() => startCamera('environment')}
              className="flex-1 py-2 px-3 rounded-xl bg-[#1E5C4A] hover:bg-[#144134] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Use Camera</span>
            </button>

            <button
              type="button"
              id="vault_upload_trigger_btn"
              onClick={() => fileInputRef.current?.click()}
              className="py-2 px-3 rounded-xl border border-[#DDD1B8] bg-[#FAF7F0] hover:bg-[#F3ECE0] text-[#231F18] text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
              title="Upload existing file"
            >
              <Upload className="w-4 h-4 text-[#8C3E14]" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Live Camera Viewfinder Modal */}
      {isCameraActive && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#231F18] border border-[#5E5648] rounded-2xl overflow-hidden shadow-2xl flex flex-col text-white">
            {/* Camera Header */}
            <div className="p-4 bg-[#1A1713] flex items-center justify-between border-b border-[#3D372E]">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#E5F0EB]" />
                <span className="text-xs font-bold text-white">
                  Document Scanner Camera — {docTitle}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleFacingMode}
                  className="p-1.5 rounded-lg bg-[#2E2820] hover:bg-[#3E372E] text-white text-xs flex items-center gap-1 cursor-pointer"
                  title="Switch Front/Rear Camera"
                >
                  <SwitchCamera className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="p-1.5 rounded-lg bg-[#2E2820] hover:bg-[#3E372E] text-white text-xs cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Viewfinder Window */}
            <div className="relative aspect-4/3 bg-black flex items-center justify-center overflow-hidden">
              {cameraError ? (
                <div className="p-6 text-center space-y-3 max-w-sm">
                  <AlertCircle className="w-8 h-8 text-[#E8A5A5] mx-auto" />
                  <p className="text-xs text-[#FAF7F0]">{cameraError}</p>
                  <button
                    type="button"
                    onClick={() => {
                      stopCamera();
                      fileInputRef.current?.click();
                    }}
                    className="px-4 py-2 bg-[#B5551E] hover:bg-[#8C3E14] text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Upload Document Image Instead
                  </button>
                </div>
              ) : capturedDataUrl ? (
                <div className="w-full h-full relative flex items-center justify-center bg-black">
                  <img
                    src={capturedDataUrl}
                    alt="Captured preview"
                    className="max-h-full max-w-full object-contain"
                  />
                  <div className="absolute top-3 left-3 bg-black/70 px-2.5 py-1 rounded-md text-[10px] font-bold text-[#FAF7F0] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1E5C4A]" /> Snapshot Captured
                  </div>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />

                  {/* Optical Document Framing Guide overlay */}
                  <div className="absolute inset-8 border-2 border-dashed border-[#FAF7F0]/80 rounded-xl pointer-events-none flex flex-col justify-between p-3">
                    <span className="text-[10px] text-white bg-black/60 px-2 py-0.5 rounded self-start font-medium">
                      Align document inside border
                    </span>
                    <span className="text-[9px] text-white/80 bg-black/60 px-2 py-0.5 rounded self-end font-mono">
                      High-Contrast Rural Scanner
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Camera Actions Footer */}
            <div className="p-4 bg-[#1A1713] border-t border-[#3D372E] flex items-center justify-between gap-3">
              {capturedDataUrl ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setCapturedDataUrl(null);
                      startCamera();
                    }}
                    className="px-4 py-2 rounded-xl bg-[#2E2820] hover:bg-[#3E372E] text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retake Photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveCaptured}
                    className="px-5 py-2 rounded-xl bg-[#1E5C4A] hover:bg-[#144134] text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save to IndexedDB Vault</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-4 py-2 rounded-xl bg-[#2E2820] hover:bg-[#3E372E] text-xs font-semibold text-white cursor-pointer"
                  >
                    Cancel
                  </button>

                  {!cameraError && (
                    <button
                      type="button"
                      id="vault_shutter_btn"
                      onClick={captureSnapshot}
                      className="w-14 h-14 rounded-full bg-white hover:bg-[#FAF7F0] border-4 border-[#1E5C4A] flex items-center justify-center text-[#231F18] shadow-lg cursor-pointer transition-transform active:scale-90"
                      title="Take Photo"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#1E5C4A]" />
                    </button>
                  )}

                  <div className="w-16" />
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stored Documents Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#5E5648]">
            Encrypted Documents in Vault ({documents.length})
          </span>
          <span className="text-[11px] text-[#8C8373]">
            IndexedDB Store: <strong className="text-[#1E5C4A]">AarambhDocumentVault_DB</strong>
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center bg-[#FAF7F0] rounded-xl border border-[#DDD1B8] text-xs text-[#5E5648] flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-[#1E5C4A]" />
            <span>Loading offline document vault...</span>
          </div>
        ) : documents.length === 0 ? (
          <div className="p-8 text-center bg-[#FAF7F0] rounded-xl border border-dashed border-[#DDD1B8] space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#F3ECE0] text-2xl mx-auto flex items-center justify-center">
              📇
            </div>
            <strong className="text-xs text-[#231F18] block">Your Document Vault is currently empty</strong>
            <p className="text-[11px] text-[#5E5648] max-w-sm mx-auto m-0">
              Use your phone or laptop camera above to take photos of your Aadhaar card and land records. They will be stored securely on your device for bank submission.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {documents.map((doc) => {
              const matchedType = DOC_TYPES.find((d) => d.type === doc.docType);
              const formattedDate = new Date(doc.capturedAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });

              return (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-xl bg-white border border-[#DDD1B8] hover:border-[#1E5C4A] shadow-xs space-y-3 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg p-1 rounded-lg bg-[#FAF7F0] border border-[#DDD1B8]">
                          {matchedType?.icon || '📄'}
                        </span>
                        <div>
                          <h5 className="text-xs font-bold text-[#231F18] m-0 line-clamp-1">
                            {doc.title}
                          </h5>
                          <span className="text-[10px] text-[#8C8373] block">
                            {matchedType?.label}
                          </span>
                        </div>
                      </div>

                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#E5F0EB] text-[#1E5C4A]">
                        {doc.source === 'camera' ? '📷 Camera' : '📤 Upload'}
                      </span>
                    </div>

                    {/* Thumbnail preview */}
                    <div
                      onClick={() => setPreviewDoc(doc)}
                      className="relative aspect-16/9 bg-[#FAF7F0] rounded-lg overflow-hidden border border-[#DDD1B8] cursor-pointer group flex items-center justify-center"
                    >
                      <img
                        src={doc.dataUrl}
                        alt={doc.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <Eye className="w-5 h-5 drop-shadow" />
                      </div>
                    </div>
                  </div>

                  {/* Metadata and Controls */}
                  <div className="pt-2 border-t border-[#DDD1B8]/60 flex items-center justify-between text-[10px] text-[#5E5648]">
                    <span>
                      {formattedDate} • {formatSize(doc.fileSize)}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(doc)}
                        className="p-1 text-[#1E5C4A] hover:bg-[#E5F0EB] rounded cursor-pointer"
                        title="View Full Resolution"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                      <a
                        href={doc.dataUrl}
                        download={doc.fileName}
                        className="p-1 text-[#5E5648] hover:bg-[#F3ECE0] rounded cursor-pointer"
                        title="Download Document"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDelete(doc.id, doc.title)}
                        className="p-1 text-[#B5551E] hover:bg-[#FFF2EB] rounded cursor-pointer"
                        title="Delete Document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Full-Screen Lightbox Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#FFFDF8] border border-[#DDD1B8] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-4 bg-[#FAF7F0] border-b border-[#DDD1B8] flex items-center justify-between">
              <div>
                <h4 className="font-display text-sm font-bold text-[#231F18] m-0">
                  {previewDoc.title}
                </h4>
                <span className="text-[10px] text-[#5E5648]">
                  Stored in IndexedDB • Captured {new Date(previewDoc.capturedAt).toLocaleString()}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="p-1.5 rounded-lg text-[#5E5648] hover:bg-[#EAE0CE] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 max-h-[70vh] overflow-auto flex items-center justify-center bg-[#231F18]">
              <img
                src={previewDoc.dataUrl}
                alt={previewDoc.title}
                className="max-h-[60vh] max-w-full object-contain rounded shadow"
              />
            </div>

            <div className="p-3 bg-[#FAF7F0] border-t border-[#DDD1B8] flex items-center justify-between text-xs">
              <span className="text-[#5E5648] text-[11px]">
                Ready for physical printout or JanSamarth portal attachment
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={previewDoc.dataUrl}
                  download={previewDoc.fileName}
                  className="px-3 py-1.5 rounded-lg bg-[#1E5C4A] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Image</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
