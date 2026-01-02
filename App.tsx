import React, { useState, useEffect } from 'react';
import { processChatLog } from './utils/cleaner';
import { ChatExport, CleanOptions } from './types';
import { Switch } from './components/Switch';

const App: React.FC = () => {
  const [rawFile, setRawFile] = useState<ChatExport | null>(null);
  const [cleanedContent, setCleanedContent] = useState<string>("");
  const [options, setOptions] = useState<CleanOptions>({
    anonymizeUsers: false,
    removeTime: false,
    removeSystemMessages: true,
    simplifyMedia: true,
    mergeConsecutive: true, 
    maskSensitive: true,
    useShortAliases: true,
    customKeywords: "", // Default empty
  });
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!json.messages || !Array.isArray(json.messages)) {
          throw new Error("Invalid format: JSON does not contain a 'messages' array.");
        }
        setRawFile(json);
        setError(null);
      } catch (err) {
        setError("Failed to parse JSON. Please make sure it is a valid chat export file.");
        setRawFile(null);
      }
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    if (rawFile) {
      try {
        const result = processChatLog(rawFile, options);
        setCleanedContent(result);
      } catch (err) {
        console.error(err);
        setError("Error processing chat log.");
      }
    }
  }, [rawFile, options]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cleanedContent);
    alert("Copied to clipboard!");
  };

  const downloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([cleanedContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "cleaned_chat_log.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const estimateTokens = (text: string) => {
    return Math.ceil(text.length * 0.7);
  };

  return (
    <div className="min-h-screen p-6 md:p-12 flex flex-col gap-6 max-w-6xl mx-auto">
      <header className="mb-4">
        <h1 className="text-3xl font-bold text-indigo-700">Chat Log Cleaner (LLM Ready)</h1>
        <p className="text-gray-600 mt-2">
          Upload your WeChat/Social JSON export to strip noise (XML, IDs, Metadata) and format it for AI processing.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Sidebar: Controls */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">1. Import Data</h2>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100
              "
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            {rawFile && (
              <p className="text-green-600 text-sm mt-2 font-medium">
                Loaded: {rawFile.messages.length} messages
              </p>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-3">2. Cleaning Options</h2>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Token Efficiency</p>
                <Switch
                  label="Short Aliases (A, B)"
                  checked={options.useShortAliases}
                  onChange={(v) => setOptions(prev => ({ ...prev, useShortAliases: v }))}
                />
                <Switch
                  label="Merge Consecutive"
                  checked={options.mergeConsecutive}
                  onChange={(v) => setOptions(prev => ({ ...prev, mergeConsecutive: v }))}
                />
                <Switch
                  label="Simplify Media"
                  checked={options.simplifyMedia}
                  onChange={(v) => setOptions(prev => ({ ...prev, simplifyMedia: v }))}
                />
                 <Switch
                  label="Remove Time"
                  checked={options.removeTime}
                  onChange={(v) => setOptions(prev => ({ ...prev, removeTime: v }))}
                />
                <Switch
                  label="Remove System"
                  checked={options.removeSystemMessages}
                  onChange={(v) => setOptions(prev => ({ ...prev, removeSystemMessages: v }))}
                />
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Privacy & Identity</p>
                <Switch
                  label="Mask Sensitive (Phone/URL)"
                  checked={options.maskSensitive}
                  onChange={(v) => setOptions(prev => ({ ...prev, maskSensitive: v }))}
                />
                <Switch
                  label="Anonymize Users"
                  checked={options.anonymizeUsers}
                  onChange={(v) => setOptions(prev => ({ ...prev, anonymizeUsers: v }))}
                />
                
                <div className="mt-3">
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    Custom Redaction List
                  </label>
                  <textarea 
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm h-24 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter names, places, or words to redact (separated by comma or newline). E.g. 梅子洋, Beijing"
                    value={options.customKeywords}
                    onChange={(e) => setOptions(prev => ({ ...prev, customKeywords: e.target.value }))}
                  />
                  <p className="text-xs text-gray-400 mt-1">Specific names are hard to detect automatically. Paste them here to remove them safely.</p>
                </div>
              </div>
            </div>
          </div>

          {cleanedContent && (
            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
              <h2 className="text-lg font-semibold text-indigo-900 mb-2">Stats</h2>
              <div className="flex justify-between text-sm text-indigo-800 mb-1">
                <span>Original (JSON)</span>
                <span className="font-mono">{rawFile ? (JSON.stringify(rawFile).length / 1024).toFixed(2) : 0} KB</span>
              </div>
              <div className="flex justify-between text-sm text-indigo-800 mb-1">
                <span>Cleaned (Text)</span>
                <span className="font-mono">{(cleanedContent.length / 1024).toFixed(2)} KB</span>
              </div>
              <div className="flex justify-between text-sm text-indigo-800 border-t border-indigo-200 pt-2 mt-2">
                <span>Est. Tokens</span>
                <span className="font-mono font-bold">~{estimateTokens(cleanedContent).toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Area: Preview & Actions */}
        <div className="md:col-span-2 flex flex-col h-[600px]">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Preview</h2>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                disabled={!cleanedContent}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
              >
                Copy
              </button>
              <button
                onClick={downloadTxt}
                disabled={!cleanedContent}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors shadow-sm"
              >
                Download .txt
              </button>
            </div>
          </div>
          
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
            {cleanedContent ? (
              <textarea
                readOnly
                className="w-full h-full p-4 font-mono text-sm resize-none focus:outline-none text-gray-700 leading-relaxed"
                value={cleanedContent}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Upload a JSON file to see the cleaned result</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;