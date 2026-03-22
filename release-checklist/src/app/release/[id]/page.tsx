"use client";

import { useQuery, QueryResult } from "@apollo/client/react";
import { useMutation } from "@apollo/client/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { GET_RELEASE, UPDATE_STEPS, GetReleaseData, UpdateStepsData, Release } from "@/src/graphql/operations"; 
// fixed list of assignment steps mapped to the database keys
const STEP_DEFINITIONS = [
  { key: "a", label: "All relevant GitHub pull requests have been merged" },
  { key: "b", label: "CHANGELOG.md files have been updated" },
  { key: "c", label: "All tests are passing" },
  { key: "d", label: "Releases in Github created" },
  { key: "e", label: "Deployed in demo" },
  { key: "f", label: "Tested thoroughly in demo" },
  { key: "g", label: "Deployed in production" },
];

export default function ReleaseDetails() {
  const params = useParams();
  const id = params.id as string;

  const { data, loading, error }: QueryResult<GetReleaseData> = useQuery(GET_RELEASE, {
    variables: { id },
  });

  const [updateSteps] = useMutation(UPDATE_STEPS);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading release details...</div>;
  if (error || !data?.release) return <div className="p-8 text-center text-red-500">Release not found.</div>;

  const release = data.release;

  // Handle checking/unchecking a box
  const handleToggleStep = (stepKey: string, currentValue: boolean) => {
    updateSteps({
      variables: {
        id: release.id,
        // We send just the one step we want to update. 
        // Our backend resolver merges this safely!
        steps: { [stepKey]: !currentValue },
      },
      // Optimistic response makes the UI feel instantly fast before the server replies
      optimisticResponse: {
        updateSteps: {
          ...release,
          stepsState: release.stepsState ? { ...release.stepsState, [stepKey]: !currentValue } : { [stepKey]: !currentValue },
        },
      },
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        
        <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
          &larr; Back to all releases
        </Link>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          
          {/* Header Section */}
          <div className="flex justify-between items-start border-b border-gray-100 pb-6 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{release.versionName}</h1>
              <p className="text-sm text-gray-500">Date: {release.createdAt}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm
              ${release.status === 'Done' ? 'bg-green-100 text-green-800 border border-green-200' : 
                release.status === 'Ongoing' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 
                'bg-gray-100 text-gray-800 border border-gray-200'}`}
            >
              {release.status}
            </span>
          </div>

          {/* Additional Remarks */}
          {release.additionalRemarks && (
            <div className="mb-8 p-4 bg-gray-50 rounded border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Additional Remarks</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{release.additionalRemarks}</p>
            </div>
          )}

          {/* Interactive Checklist */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Release Checklist</h2>
            <div className="space-y-3">
              {STEP_DEFINITIONS.map(({ key, label }) => {
                const isChecked = release.stepsState?.[key as keyof typeof release.stepsState] || false;
                return (
                  <label 
                    key={key} 
                    className={`flex items-start p-3 rounded-lg border cursor-pointer transition-colors
                      ${isChecked ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                  >
                    <input
                      type="checkbox"
                      className="mt-1 w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                      checked={isChecked}
                      onChange={() => handleToggleStep(key, isChecked)}
                    />
                    <span className={`ml-3 ${isChecked ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                      {label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}