import { generateNodeAndEdgesData } from "@/processor/nodeProcessor";
import { processInput } from "@/processor/processorInput";
import { TemporalData, TemporalDiagramData } from "@/processor/types";
import { useEffect } from "react";

export default function TemporalFlowDisplay() {
    useEffect(() => {
        // Fetching the data
        const temporalData: TemporalData = processInput() 
  
        // Generating Node and Edges data for diagram rendering  
        const temporalDiagramData: TemporalDiagramData = generateNodeAndEdgesData(temporalData)
        console.log(temporalDiagramData)
    }, []);

    return (
        <div>

        </div>
    )
}