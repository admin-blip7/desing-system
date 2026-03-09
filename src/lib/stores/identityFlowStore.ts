/**
 * Identity Flow Store
 * Manages state for the design identity generation flow
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
    IdentityFlowState,
    IdentityFlowActions,
    SelectedIdentity,
    QuestionnaireData,
    PreIdentityGeneration,
    WorkspaceFlowState,
    IntegrationSelection,
    WorkspaceType,
} from "@/types/identity";
import { IDENTITY_DRAFT_KEY } from "@/types/identity";

// Initial state
const initialState: Omit<IdentityFlowState, "actions"> = {
    current_stage: 1,
    completed_stages: [],
    selected_identity: null,
    questionnaire_data: {},
    questionnaire_step: 0,
    generation_status: "idle",
    generated_identity: null,
    workspace_flow: {
        current_workspace: null,
        completed_workspaces: [],
        available_workspaces: [],
        workspace_data: {},
        can_proceed_to_integrations: false,
        progress_percentage: 0,
    },
    integration_selection: null,
    brand_id: null,
    last_updated: null,
};

type IdentityFlowStore = IdentityFlowState & IdentityFlowActions;

export const useIdentityFlowStore = create<IdentityFlowStore>()(
    persist(
        (set, get) => ({
            ...initialState,

            // Stage navigation
            goToStage: (stage: number) => {
                set({ current_stage: stage });
            },

            completeStage: (stage: number) => {
                const { completed_stages } = get();
                if (!completed_stages.includes(stage)) {
                    set({ completed_stages: [...completed_stages, stage] });
                }
            },

            // Stage 1 actions
            setSelectedIdentity: (identity: SelectedIdentity | null) => {
                set({ selected_identity: identity });
            },

            // Stage 2 actions
            setQuestionnaireData: (data: Partial<QuestionnaireData>) => {
                const { questionnaire_data } = get();
                set({
                    questionnaire_data: { ...questionnaire_data, ...data },
                    last_updated: new Date().toISOString(),
                });
            },

            setQuestionnaireStep: (step: number) => {
                set({ questionnaire_step: step });
            },

            // Stage 3 actions
            setGenerationStatus: (status) => {
                set({ generation_status: status });
            },

            setGeneratedIdentity: (identity: PreIdentityGeneration | null) => {
                set({ generated_identity: identity });
            },

            // Stage 4 actions
            setWorkspaceFlow: (flow: WorkspaceFlowState) => {
                set({ workspace_flow: flow });
            },

            updateWorkspaceData: <T extends WorkspaceType>(
                workspace: T,
                data: any
            ) => {
                const { workspace_flow } = get();
                set({
                    workspace_flow: {
                        ...workspace_flow,
                        workspace_data: {
                            ...workspace_flow.workspace_data,
                            [workspace]: data,
                        },
                    },
                    last_updated: new Date().toISOString(),
                });
            },

            completeWorkspace: (workspace: WorkspaceType) => {
                const { workspace_flow } = get();
                const completed = workspace_flow.completed_workspaces.includes(workspace)
                    ? workspace_flow.completed_workspaces
                    : [...workspace_flow.completed_workspaces, workspace];

                // Calculate progress percentage
                const requiredWorkspaces: WorkspaceType[] = ["visual-identity", "brand-voice"];
                const requiredCompleted = requiredWorkspaces.filter((w) =>
                    completed.includes(w)
                ).length;
                const progressPercentage = Math.round(
                    (requiredCompleted / requiredWorkspaces.length) * 100
                );

                set({
                    workspace_flow: {
                        ...workspace_flow,
                        completed_workspaces: completed,
                        progress_percentage: progressPercentage,
                        can_proceed_to_integrations: requiredCompleted === requiredWorkspaces.length,
                    },
                });
            },

            // Stage 5 actions
            setIntegrationSelection: (selection: IntegrationSelection | null) => {
                set({ integration_selection: selection });
            },

            // Brand
            setBrandId: (id: string | null) => {
                set({ brand_id: id });
            },

            // Draft management
            saveDraft: () => {
                const state = get();
                set({ last_updated: new Date().toISOString() });
                // Data is automatically persisted by zustand persist middleware
            },

            loadDraft: (): boolean => {
                // Data is automatically hydrated by zustand persist middleware
                const state = get();
                return state.last_updated !== null;
            },

            clearDraft: () => {
                set({
                    ...initialState,
                    last_updated: null,
                });
            },

            reset: () => {
                set({
                    ...initialState,
                    last_updated: null,
                });
            },
        }),
        {
            name: IDENTITY_DRAFT_KEY,
            partialize: (state) => ({
                selected_identity: state.selected_identity,
                questionnaire_data: state.questionnaire_data,
                questionnaire_step: state.questionnaire_step,
                workspace_flow: state.workspace_flow,
                last_updated: state.last_updated,
                // Don't persist generation status, brand_id, or integration selection
            }),
        }
    )
);

// Selector hooks for common use cases
export const useCurrentStage = () => useIdentityFlowStore((state) => state.current_stage);
export const useSelectedIdentity = () => useIdentityFlowStore((state) => state.selected_identity);
export const useQuestionnaireData = () => useIdentityFlowStore((state) => state.questionnaire_data);
export const useGeneratedIdentity = () => useIdentityFlowStore((state) => state.generated_identity);
export const useGenerationStatus = () => useIdentityFlowStore((state) => state.generation_status);
export const useWorkspaceFlow = () => useIdentityFlowStore((state) => state.workspace_flow);
export const useCanProceedToIntegrations = () =>
    useIdentityFlowStore((state) => state.workspace_flow.can_proceed_to_integrations);

// Helper function to check if stage can be accessed
export const canAccessStage = (targetStage: number, currentStage: number): boolean => {
    // Can only go to stages that are already completed or the next one
    return targetStage <= currentStage + 1;
};

// Helper function to get stage progress
export const getStageProgress = (completedStages: number[], totalStages: number): number => {
    return Math.round((completedStages.length / totalStages) * 100);
};
