import { Edge, Node as ReactFlowNode} from "reactflow";
import { NodeDataPayload, NodeDisplayData, TemporalData } from "./types";
import { ACTIVITY_NODE_PREFIX, CALLER_NODE_PREFIX, EDGE_TYPE_BEZIER, WORKFLOW_NODE_PREFIX } from "./consts";

const FIXED_POSITION = {x: 0, y:0}

export abstract class TemporalNodeBuilder {
    public temporalData: TemporalData = {callers:{}, workflows:{}, activities: {}}
    public abstract idPrefix: string

    public constructor(public data: TemporalData) {}

    public abstract processNodes(): NodeDisplayData
    public abstract processEdges(): Record<string, Edge>
}

export class CallerNodeBuilder extends TemporalNodeBuilder {
    idPrefix: string = CALLER_NODE_PREFIX

    public constructor(data: TemporalData) {
        super(data)
        this.temporalData = data
    }

    public processNodes(): NodeDisplayData {
        let nodes: ReactFlowNode[] = []
        let nodeIds: Set<string> = new Set()

        for (const key in this.temporalData.callers) {
            let nodeId: string = key

            // Add main caller node
            let data_payload: NodeDataPayload = {
                source_data: this.temporalData.callers[key],
                prefix: this.idPrefix
            }
            let callerNode: ReactFlowNode = {
                id: nodeId,
                type: "custom",
                data: data_payload,
                position: FIXED_POSITION
            }
            nodes.push(callerNode)
            nodeIds.add(nodeId)
        }
    
        return {nodes: nodes, nodeIds: nodeIds}
    }

    public processEdges(): Record<string, Edge> {
        let edges: Record<string, Edge> = {}

        for (const key in this.temporalData.callers) {
            // Add edge from root node
            let sourceNode: string = key
            
            // Visit all nodes in data
            this.temporalData.callers[key].data.forEach(targetNode => {
                let edgeId: string = sourceNode + "-" + targetNode

                edges[edgeId] = {
                    id: edgeId,
                    source: sourceNode,
                    target: targetNode,
                    type: EDGE_TYPE_BEZIER,
                }

                // Update source node to target node
                sourceNode = targetNode
            })

        }

        return edges
    }
}

export class WorkflowNodeBuilder extends TemporalNodeBuilder {
    idPrefix: string = WORKFLOW_NODE_PREFIX

    public constructor(data: TemporalData) {
        super(data)
        this.temporalData = data
    }

    public processNodes(): NodeDisplayData {
        let nodes: ReactFlowNode[] = []
        let nodeIds: Set<string> = new Set()

        for (const key in this.temporalData.workflows) {
            let nodeId: string = key

            // Add workflow node
            let data_payload: NodeDataPayload = {
                source_data: this.temporalData.workflows[key],
                prefix: this.idPrefix
            }
            let node: ReactFlowNode = {
                id: nodeId,
                type: "custom",
                data: data_payload,
                position: FIXED_POSITION
            }
            nodes.push(node)
            nodeIds.add(nodeId)
        }
        return {nodes: nodes, nodeIds: nodeIds}
    }

    public processEdges(): Record<string, Edge> {
        let edges: Record<string, Edge> = {}

        for (const key in this.temporalData.workflows) {
            // Add edge from root node
            let sourceNode: string = key
            
            // Visit all nodes in data
            this.temporalData.workflows[key].data.forEach(targetNode => {
                let edgeId: string = sourceNode + "-" + targetNode

                edges[edgeId] = {
                    id: edgeId,
                    source: sourceNode,
                    target: targetNode,
                    type: EDGE_TYPE_BEZIER,
                }

                // Update source node to target node
                sourceNode = targetNode
            })

        }

        return edges
    }
}

export class ActivityNodeBuilder extends TemporalNodeBuilder {
    idPrefix: string = ACTIVITY_NODE_PREFIX

    public constructor(data: TemporalData) {
        super(data)
        this.temporalData = data
    }

    public processNodes(): NodeDisplayData {
        let nodes: ReactFlowNode[] = []
        let nodeIds: Set<string> = new Set()

        for (const key in this.temporalData.activities) {
            let nodeId: string = key

            // Add activity node
            let data_payload: NodeDataPayload = {
                source_data: this.temporalData.activities[key],
                prefix: this.idPrefix
            }
            let node: ReactFlowNode = {
                id: nodeId,
                type: "custom",
                data: data_payload,
                position: FIXED_POSITION
            }
            nodes.push(node)
            nodeIds.add(nodeId)
        }
    
        return {nodes: nodes, nodeIds: nodeIds}
    }

    public processEdges(): Record<string, Edge> {
        let edges: Record<string, Edge> = {}

        // Do nothing.. There are no edges in activities

        return edges
    }
}