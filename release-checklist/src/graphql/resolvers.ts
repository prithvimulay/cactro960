import { prisma } from '../lib/prisma';

// Default state for a brand new release
const DEFAULT_STEPS = {
  a: false, b: false, c: false, d: false, e: false, f: false, g: false
};

export const resolvers = {
  Query: {
    // Fetch all releases, ordered by newest first
    releases: async () => {
      return await prisma.release.findMany({
        orderBy: { createdAt: 'desc' }
      });
    },
    // Fetch a single release by ID
    release: async (_: any, { id }: { id: string }) => {
      return await prisma.release.findUnique({ where: { id } });
    }
  },

  Mutation: {
    // Create a new release
    createRelease: async (_: any, { versionName, additionalRemarks }: { versionName: string, additionalRemarks?: string }) => {
      return await prisma.release.create({
        data: {
          versionName,
          additionalRemarks,
          stepsState: DEFAULT_STEPS, // Start with all steps unchecked
        }
      });
    },

    // Update specific steps
    updateSteps: async (_: any, { id, steps }: { id: string, steps: any }) => {
      // First, get the current release to merge the existing steps with the new updates
      const currentRelease = await prisma.release.findUnique({ where: { id } });
      if (!currentRelease) throw new Error("Release not found");

      const updatedSteps = {
        ...(currentRelease.stepsState as object),
        ...steps
      };

      return await prisma.release.update({
        where: { id },
        data: { stepsState: updatedSteps }
      });
    },

    // Update the additional remarks
    updateRemarks: async (_: any, { id, additionalRemarks }: { id: string, additionalRemarks: string }) => {
      return await prisma.release.update({
        where: { id },
        data: { additionalRemarks }
      });
    }
  },

  // Field-level resolver for the computed "status"
  Release: {
    status: (parent: any) => {
      // parent is the Release object returned from the database
      const steps = parent.stepsState;
      const values = Object.values(steps);
      
      const completedCount = values.filter((v) => v === true).length;

      if (completedCount === 0) return 'Planned';
      if (completedCount === values.length) return 'Done';
      return 'Ongoing';
    },
    // Convert the Prisma DateTime to a readable string format
    createdAt: (parent: any) => {
      return new Date(parent.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }
};