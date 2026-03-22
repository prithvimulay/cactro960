"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { 
  GET_RELEASES, 
  CREATE_RELEASE, 
  DELETE_RELEASE,
  GetReleasesData, 
  Release 
} from "@/src/graphql/operations";
import Link from "next/link";

export default function Home() {
  const [versionName, setVersionName] = useState("");
  const [remarks, setRemarks] = useState("");

  // Fetch data
  const { data, loading, error } = useQuery<GetReleasesData>(GET_RELEASES);
  
  // Create mutation
  const [createRelease, { loading: creating }] = useMutation(CREATE_RELEASE, {
    refetchQueries: [{ query: GET_RELEASES }],
    onCompleted: () => {
      setVersionName("");
      setRemarks("");
    }
  });

  // Delete mutation
  const [deleteRelease] = useMutation(DELETE_RELEASE, {
    refetchQueries: [{ query: GET_RELEASES }],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!versionName) return;
    createRelease({ variables: { versionName, additionalRemarks: remarks } });
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault(); // Prevents the Link from triggering navigation
    if (confirm("Are you sure you want to delete this release?")) {
      deleteRelease({ variables: { id } });
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading releases...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error loading data.</div>;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Create Form */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-gray-800">New Release</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Version Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Version 1.1.0"
                  value={versionName}
                  onChange={(e) => setVersionName(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 text-sm text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <textarea
                  placeholder="Important notes..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 text-sm text-black h-24"
                />
              </div>
              <button
                type="submit"
                disabled={creating}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create Release"}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Release List */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">All Releases</h2>
            </div>
            <ul className="divide-y divide-gray-200">
              {data?.releases.length === 0 && (
                <li className="p-6 text-center text-gray-500">No releases found. Create one to get started!</li>
              )}
              {data?.releases.map((release: Release) => (
                <li key={release.id} className="relative hover:bg-blue-50 transition-colors group">
                  <Link 
                    href={`/release/${release.id}`}
                    className="flex items-center justify-between p-4 w-full"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{release.versionName}</p>
                      <p className="text-xs text-gray-500">Created: {release.createdAt}</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium 
                        ${release.status === 'Done' ? 'bg-green-100 text-green-800' : 
                          release.status === 'Ongoing' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'}`}
                      >
                        {release.status}
                      </span>
                      
                      {/* Delete Button */}
                      <button
                        onClick={(e) => handleDelete(e, release.id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                        title="Delete Release"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </main>
  );
}