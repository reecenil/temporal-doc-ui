import { Edge, Node as ReactFlowNode } from "reactflow";

export interface TemporalDataContent {
    data: string[];
    docstring?: string;
    path: string;
}

export interface TemporalData {
    callers: Record<string, TemporalDataContent>;
    workflows: Record<string, TemporalDataContent>;
    activities: Record<string, TemporalDataContent>;
}

export interface NodeDataPayload {
    source_data: TemporalDataContent;
    prefix: string;
}

export interface NodeDisplayData {
    nodes: ReactFlowNode[];
    nodeIds: Set<string>;
}

export interface TemporalDiagramData {
    nodes: ReactFlowNode[];
    nodeIds: Record<string, Set<string>>;
    edges: Edge[];
}