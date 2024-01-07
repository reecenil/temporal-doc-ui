import { generateNodeAndEdgesData } from "@/processor/nodeProcessor";
import { processInput } from "@/processor/processorInput";
import { TemporalData, TemporalDiagramData } from "@/processor/types";
import ELK from 'elkjs/lib/elk.bundled.js';
import { useCallback, useEffect, useLayoutEffect } from "react";
import ReactFlow, { Edge, Panel, Node as ReactFlowNode, ReactFlowProvider, addEdge, useEdgesState, useNodesState, useReactFlow} from "reactflow";
import 'reactflow/dist/style.css'
import './customNode.css';
import CustomNode from "./CustomNode";

const elk = new ELK();

// Elk has a *huge* amount of options to configure. To see everything you can
// tweak check out:
//
// - https://www.eclipse.org/elk/reference/algorithms.html
// - https://www.eclipse.org/elk/reference/options.html
const elkOptions = {
  'elk.algorithm': 'layered',
  'elk.layered.spacing.nodeNodeBetweenLayers': '130',
  'elk.spacing.nodeNode': '30',
};

const nodeTypes = {
  custom: CustomNode,
};

const getLayoutedElements = (nodes: ReactFlowNode[], edges: Edge[], options: any = {}): Promise<any> => {
  const graph: any = {
    id: 'root',
    layoutOptions: options,
    children: nodes.map((node) => ({
      ...node,
      // Adjust the target and source handle positions based on the layout
      // direction.
      targetPosition: 'left',
      sourcePosition: 'right',

      // Hardcode a width and height for elk to use when layouting.
      width: 150,
      height: 50,
    })),
    edges: edges,
  };

  return elk
    .layout(graph)
    .then((layoutedGraph: any) => ({
      nodes: layoutedGraph.children.map((node: any) => ({
        ...node,
        // React Flow expects a position property on the node instead of `x`
        // and `y` fields.
        position: { x: node.x, y: node.y },
      })),

      edges: layoutedGraph.edges,
    }))
    .catch(console.error);
};

interface FilteredDisplayData {
  nodes: ReactFlowNode[];
  edges: Edge[]
}

// Filter out results that have no edge
const filterDisplayResults = (diagramData: TemporalDiagramData) : FilteredDisplayData => {
  let allNodeEdges: Set<string> = new Set()
  let nodesForDisplay: ReactFlowNode[] = []

  for(const edge of diagramData.edges){
    allNodeEdges.add(edge.source)
    allNodeEdges.add(edge.target)
  }

  for(const node of diagramData.nodes) {
    // Only display node with edges
    if(allNodeEdges.has(node.id)){
      nodesForDisplay.push(node)
    }
  }

  return {
    nodes: nodesForDisplay,
    edges: diagramData.edges
  }
}

function LayoutFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView } = useReactFlow();

  const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), []);
  const onLayout = useCallback(
    ({ direction, useInitialNodes = false }: {direction: string, useInitialNodes: boolean}) => {
      // Parse JSON file
      let temporalInputData: TemporalData = processInput()
      // Compute nodes and edges
      let temporalDiagramData: TemporalDiagramData = generateNodeAndEdgesData(temporalInputData)
      // Filter the results based on UI
      let filteredDisplayData: FilteredDisplayData = filterDisplayResults(temporalDiagramData)

      console.log(filteredDisplayData)

      const opts = { 'elk.direction': direction, ...elkOptions };
      const ns = useInitialNodes ? filteredDisplayData.nodes : nodes;
      const es = useInitialNodes ? filteredDisplayData.edges : edges;

      getLayoutedElements(ns, es, opts).then(({nodes: layoutedNodes, edges: layoutedEdges}) => {
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);

        window.requestAnimationFrame(() => fitView());
      });
    },
    [nodes, edges]
  );

  // Calculate the initial layout on mount.
  useLayoutEffect(() => {
    onLayout({ direction: 'RIGHT', useInitialNodes: true });
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onConnect={onConnect}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
      nodeTypes={nodeTypes}
    >
    </ReactFlow>
  );
}

export default function TemporalFlowDisplay() {
    return(
        <ReactFlowProvider>
            <LayoutFlow />
        </ReactFlowProvider>
    )
}