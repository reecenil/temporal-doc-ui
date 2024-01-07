import { NodeDataPayload } from '@/processor/types';
import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

function CustomNode({ id, data }:{id: string, data: NodeDataPayload}) {
  return (
    <>
      <div className="custom-node__header">
        <strong>{data.prefix.toUpperCase()}</strong>
      </div>
      <div className="custom-node__body">
        {id}
      </div>
      <Handle type="source" position={Position.Right} id={id} />
      <Handle type="target" position={Position.Left} id={id} />
    </>
  );
}

export default memo(CustomNode);
