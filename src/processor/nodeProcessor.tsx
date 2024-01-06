import { Edge, Node as ReactFlowNode } from "reactflow";
import { NodeDisplayData, TemporalData, TemporalDiagramData } from "./types";
import { ActivityNodeBuilder, CallerNodeBuilder, TemporalNodeBuilder, WorkflowNodeBuilder } from "./nodeBuilder";
import { ACTIVITY_NODE_PREFIX, CALLER_NODE_PREFIX, WORKFLOW_NODE_PREFIX } from "./consts";
 
const getDiagramNodes = (builders: TemporalNodeBuilder[]): Record<string, NodeDisplayData> => {
    let returnData: Record<string, NodeDisplayData> = {}

    // Get all nodes of all builders
    builders.forEach(obj => {
        let nodeDisplayData: NodeDisplayData = obj.processNodes()
        returnData[obj.idPrefix]=nodeDisplayData
    })

    return returnData
}

const getDiagramEdges = (builders: TemporalNodeBuilder[]): Edge[] => {
    // Set of node ids (source+destination) so we won't duplicate edges
    let registeredEdgeSingleLink: Set<string> = new Set()
    let dataEdges: Edge[] = []

    // Get all nodes of all builders
    builders.forEach(obj => {
        let nodeEdgeData: Record<string, Edge> = obj.processEdges()
        for(const key in nodeEdgeData) {
            // If we already registered the edge, and we see it again,
            // Do nothing
            if(key in registeredEdgeSingleLink) {
                // Ignore edges that are already registered
                continue
            }else {
                registeredEdgeSingleLink.add(key)
                dataEdges.push(nodeEdgeData[key])
            }
        }
    })

    return dataEdges
}

export const generateNodeAndEdgesData = (data: TemporalData): TemporalDiagramData => {
    const callerNodeBuilder = new CallerNodeBuilder(data)
    const workflowNodeBuilder = new WorkflowNodeBuilder(data)
    const activityNodeBuilder = new ActivityNodeBuilder(data)

    const builderList: TemporalNodeBuilder[] = [callerNodeBuilder, workflowNodeBuilder, activityNodeBuilder]

    let nodeData: Record<string, NodeDisplayData> = getDiagramNodes(builderList)
    let nodeEdges: Edge[] = getDiagramEdges(builderList)

    return {
        nodes: [...nodeData[callerNodeBuilder.idPrefix].nodes, ...nodeData[workflowNodeBuilder.idPrefix].nodes, ...nodeData[activityNodeBuilder.idPrefix].nodes],
        nodeIds: {
            CALLER_NODE_PREFIX: nodeData[CALLER_NODE_PREFIX].nodeIds,
            WORKFLOW_NODE_PREFIX: nodeData[WORKFLOW_NODE_PREFIX].nodeIds,
            ACTIVITY_NODE_PREFIX: nodeData[ACTIVITY_NODE_PREFIX].nodeIds,
        },
        edges: nodeEdges,
    }
}