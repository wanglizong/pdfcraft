'use client';

import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import ReactFlow, {
    Node,
    Edge,
    Controls,
    Background,
    MiniMap,
    ReactFlowProvider,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    ReactFlowInstance,
    ConnectionMode,
    Panel,
    BackgroundVariant,
    NodeMouseHandler,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useTranslations } from 'next-intl';
import { WorkflowNode, WorkflowEdge, ToolNodeData, WorkflowExecutionState, SavedWorkflow, WorkflowTemplate, WorkflowOutputFile } from '@/types/workflow';
import { validateWorkflow, validateConnection, topologicalSort, findInputNodes } from '@/lib/workflow/engine';
import { executeNode, collectInputFiles } from '@/lib/workflow/executor';
import { saveWorkflow, getSavedWorkflows, deleteWorkflow, duplicateWorkflow, exportWorkflow, importWorkflow } from '@/lib/workflow/storage';
import { createExecutionRecord, addExecutionRecord, completeExecutionRecord } from '@/lib/workflow/history';
import type { WorkflowExecutionRecord } from '@/types/workflow-history';
import { useUndoRedo } from '@/hooks/useUndoRedo';

import ToolNode from './ToolNode';
import CustomEdge from './CustomEdge';
import { ToolSidebar } from './ToolSidebar';
import { WorkflowLibrary } from './WorkflowLibrary';
import { WorkflowControls } from './WorkflowControls';
import { NodeSettingsPanel } from './NodeSettingsPanel';
import { WorkflowPreview } from './WorkflowPreview';
import { Undo2, Redo2, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from 'lucide-react';

// Node types for ReactFlow
const nodeTypes = {
    toolNode: ToolNode,
};

// Edge types for ReactFlow
const edgeTypes = {
    custom: CustomEdge,
};

// Edge styles
const defaultEdgeOptions = {
    type: 'custom',
    animated: false,
    selectable: true,
    focusable: true,
    style: { strokeWidth: 2, stroke: '#6366f1' },
};

/**
 * Generate a unique node ID using timestamp and random string
 * Format: node_<timestamp>_<random>
 * This ensures uniqueness across page refreshes and multiple instances
 */
const getNodeId = (): string => {
    const timestamp = Date.now().toString(36); // Base36 encoding for shorter string
    const random = Math.random().toString(36).substring(2, 9); // 7 random chars
    return `node_${timestamp}_${random}`;
};

/**
 * Main Workflow Editor Component
 */
function WorkflowEditorContent() {
    const tWorkflow = useTranslations('workflow');

    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

    // Nodes and edges state
    const [nodes, setNodes, onNodesChange] = useNodesState<ToolNodeData>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    // Saved workflows
    const [savedWorkflows, setSavedWorkflows] = useState<SavedWorkflow[]>([]);

    // Selected node for settings panel
    const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
    const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);

    // Preview state
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);

    // Sidebar collapse state
    const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
    const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    // Track created Blob URLs for cleanup
    const createdBlobUrls = useRef<Set<string>>(new Set());

    /**
     * Register a Blob URL for cleanup
     */
    const registerBlobUrl = useCallback((url: string) => {
        createdBlobUrls.current.add(url);
    }, []);

    /**
     * Cleanup all registered Blob URLs
     */
    const cleanupBlobUrls = useCallback(() => {
        createdBlobUrls.current.forEach(url => {
            try {
                URL.revokeObjectURL(url);
            } catch (error) {
                console.warn('[Workflow] Failed to revoke Blob URL:', error);
            }
        });
        createdBlobUrls.current.clear();
    }, []);

    // Cleanup on component unmount
    useEffect(() => {
        return () => {
            console.log('[Workflow] Component unmounting, cleaning up resources');
            cleanupBlobUrls();
        };
    }, [cleanupBlobUrls]);

    // Undo/Redo
    const { canUndo, canRedo, pushHistory, undo, redo, clearHistory } = useUndoRedo();

    // Execution state
    const [executionState, setExecutionState] = useState<WorkflowExecutionState>({
        status: 'idle',
        currentNodeId: null,
        executedNodes: [],
        pendingNodes: [],
        progress: 0,
    });

    // Load saved workflows on mount
    useEffect(() => {
        setSavedWorkflows(getSavedWorkflows());
    }, []);

    // Push to history when nodes or edges change
    useEffect(() => {
        if (nodes.length > 0 || edges.length > 0) {
            pushHistory(nodes as WorkflowNode[], edges as WorkflowEdge[]);
        }
    }, [nodes.length, edges.length]);

    // Keyboard shortcuts for undo/redo
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
                if (e.shiftKey) {
                    // Redo
                    e.preventDefault();
                    handleRedo();
                } else {
                    // Undo
                    e.preventDefault();
                    handleUndo();
                }
            }
            if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
                // Redo (alternative)
                e.preventDefault();
                handleRedo();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [canUndo, canRedo]);

    // Validation
    const validation = useMemo(() => {
        return validateWorkflow(nodes as WorkflowNode[], edges as WorkflowEdge[]);
    }, [nodes, edges]);

    /**
     * Handle undo
     */
    const handleUndo = useCallback(() => {
        const state = undo();
        if (state) {
            setNodes(state.nodes);
            setEdges(state.edges as Edge[]);
        }
    }, [undo, setNodes, setEdges]);

    /**
     * Handle redo
     */
    const handleRedo = useCallback(() => {
        const state = redo();
        if (state) {
            setNodes(state.nodes);
            setEdges(state.edges as Edge[]);
        }
    }, [redo, setNodes, setEdges]);

    /**
     * Handle connecting nodes
     */
    const onConnect = useCallback(
        (params: Connection) => {
            // Validate connection
            const sourceNode = nodes.find(n => n.id === params.source);
            const targetNode = nodes.find(n => n.id === params.target);

            if (sourceNode && targetNode) {
                const validationResult = validateConnection(
                    sourceNode as WorkflowNode,
                    targetNode as WorkflowNode
                );

                if (!validationResult.isValid) {
                    console.warn('Invalid connection:', validationResult.message);
                    return;
                }
            }

            setEdges((eds) => addEdge({
                ...params,
                type: 'smoothstep',
                animated: false,
                style: { strokeWidth: 2, stroke: '#6366f1' },
            }, eds));
        },
        [nodes, setEdges]
    );

    /**
     * Handle node click to open settings panel
     */
    const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
        setSelectedNode(node as WorkflowNode);
        setIsSettingsPanelOpen(true);
    }, []);

    /**
     * Update node settings
     */
    const handleUpdateNodeSettings = useCallback((nodeId: string, settings: Record<string, unknown>) => {
        setNodes((nds) => nds.map(node =>
            node.id === nodeId
                ? { ...node, data: { ...node.data, settings } }
                : node
        ));
    }, [setNodes]);

    /**
     * Handle drag over for dropping new nodes
     */
    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    /**
     * Handle dropping a tool node onto the canvas
     */
    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            if (!reactFlowWrapper.current || !reactFlowInstance) return;

            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            const nodeDataStr = event.dataTransfer.getData('application/reactflow');

            if (!nodeDataStr) return;

            const nodeData: ToolNodeData = JSON.parse(nodeDataStr);

            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNode: Node<ToolNodeData> = {
                id: getNodeId(),
                type: 'toolNode',
                position,
                data: { ...nodeData, settings: {} },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance, setNodes]
    );

    /**
     * Handle drag start from sidebar
     */
    const onDragStart = useCallback((event: React.DragEvent, nodeData: ToolNodeData) => {
        event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeData));
        event.dataTransfer.effectAllowed = 'move';
    }, []);

    /**
     * Handle file selection for execution and preview
     */
    const handleFilesSelected = useCallback((files: File[]) => {
        setSelectedFiles(files);
    }, []);

    /**
     * Execute the workflow
     */
    const executeWorkflow = useCallback(async (inputFiles: File[]) => {
        setSelectedFiles(inputFiles);

        const executionOrder = topologicalSort(nodes as WorkflowNode[], edges as WorkflowEdge[]);
        if (!executionOrder) {
            console.error('Cannot execute workflow with cycles');
            return;
        }

        // Create execution history record
        const executionRecord = createExecutionRecord(
            nodes as WorkflowNode[],
            edges as WorkflowEdge[],
            inputFiles.length
        );
        addExecutionRecord(executionRecord);

        setExecutionState({
            status: 'running',
            currentNodeId: null,
            executedNodes: [],
            pendingNodes: [...executionOrder],
            progress: 0,
            startTime: new Date(),
        });

        // Reset all node statuses
        setNodes((nds) => nds.map(node => ({
            ...node,
            data: { ...node.data, status: 'idle' as const, progress: 0, error: undefined },
        })));

        try {
            // Find input nodes and assign files to them
            const inputNodes = findInputNodes(nodes as WorkflowNode[], edges as WorkflowEdge[]);

            if (inputNodes.length === 0) {
                throw new Error('No input nodes found in workflow. Cannot execute.');
            }

            console.log(
                `[Workflow] Starting execution with ${inputFiles.length} file(s) ` +
                `for ${inputNodes.length} input node(s): ${inputNodes.map(n => n.data.label).join(', ')}`
            );

            // Assign input files to all input nodes
            // Note: All input nodes receive ALL files
            setNodes((nds) => nds.map(node => {
                if (inputNodes.some(n => n.id === node.id)) {
                    return {
                        ...node,
                        data: { ...node.data, inputFiles },
                    };
                }
                return node;
            }));

            // Store outputs for each node
            const nodeOutputs = new Map<string, (Blob | WorkflowOutputFile)[]>();

            // Execute each node in order
            for (let i = 0; i < executionOrder.length; i++) {
                const nodeId = executionOrder[i];
                const currentNode = nodes.find(n => n.id === nodeId) as WorkflowNode;

                if (!currentNode) continue;

                setExecutionState(prev => ({
                    ...prev,
                    currentNodeId: nodeId,
                    progress: Math.round((i / executionOrder.length) * 100),
                }));

                setNodes((nds) => nds.map(node =>
                    node.id === nodeId
                        ? { ...node, data: { ...node.data, status: 'processing' as const, progress: 0 } }
                        : node
                ));

                // Get input files for this node
                const nodeInputFiles = collectInputFiles(
                    nodeId,
                    nodes as WorkflowNode[],
                    edges as WorkflowEdge[],
                    nodeOutputs
                );

                // If this is an input node without parent outputs, use the selected files
                const filesToProcess = nodeInputFiles.length > 0 ? nodeInputFiles : inputFiles;

                // Execute the node
                const result = await executeNode(
                    currentNode,
                    filesToProcess,
                    (progress) => {
                        setNodes((nds) => nds.map(node =>
                            node.id === nodeId
                                ? { ...node, data: { ...node.data, progress: Math.min(progress, 100) } }
                                : node
                        ));
                    }
                );

                if (!result.success) {
                    // Node execution failed - provide detailed error information
                    const errorMessage = result.error?.message || 'Processing failed';
                    const errorDetails = result.error?.details;
                    const errorCode = result.error?.code;
                    const suggestedAction = result.error?.suggestedAction;
                    
                    // Build comprehensive error message
                    let fullErrorMessage = errorMessage;
                    if (errorCode) {
                        fullErrorMessage = `[${errorCode}] ${fullErrorMessage}`;
                    }
                    if (errorDetails) {
                        fullErrorMessage += `\n\nDetails: ${errorDetails}`;
                    }
                    if (suggestedAction) {
                        fullErrorMessage += `\n\nSuggested Action: ${suggestedAction}`;
                    }
                    
                    // Update node with detailed error information
                    setNodes((nds) => nds.map(node =>
                        node.id === nodeId
                            ? { 
                                ...node, 
                                data: { 
                                    ...node.data, 
                                    status: 'error' as const, 
                                    error: fullErrorMessage,
                                    progress: 0,
                                } 
                              }
                            : node
                    ));
                    
                    // Throw with node context for better error tracking
                    const error = new Error(`Node "${currentNode.data.label}" failed: ${errorMessage}`);
                    (error as Error & { nodeId?: string; code?: string }).nodeId = nodeId;
                    (error as Error & { nodeId?: string; code?: string }).code = errorCode;
                    throw error;
                }

                // Store output for downstream nodes with proper filename metadata
                let outputs: (Blob | WorkflowOutputFile)[] = [];

                if (result.result) {
                    if (Array.isArray(result.result)) {
                        // Handle array results - ensure each has proper metadata
                        const resultArray = result.result;
                        outputs = resultArray.map((item, index) => {
                            if (item instanceof Blob) {
                                // Plain Blob - wrap with metadata
                                const baseFilename = result.filename || `${currentNode.data.label}_output`;
                                const filename = resultArray.length > 1 
                                    ? `${baseFilename}_${index + 1}.pdf`
                                    : `${baseFilename}.pdf`;
                                return {
                                    blob: item,
                                    filename: filename
                                };
                            }
                            // Already a WorkflowOutputFile
                            return item as WorkflowOutputFile;
                        });
                    } else {
                        // Single result
                        if (result.filename) {
                            outputs = [{
                                blob: result.result,
                                filename: result.filename
                            }];
                        } else {
                            // Generate default filename from node label
                            const filename = `${currentNode.data.label.replace(/\s+/g, '_')}_output.pdf`;
                            outputs = [{
                                blob: result.result,
                                filename: filename
                            }];
                        }
                    }
                }

                nodeOutputs.set(nodeId, outputs);

                setNodes((nds) => nds.map(node =>
                    node.id === nodeId
                        ? { ...node, data: { ...node.data, status: 'complete' as const, progress: 100, outputFiles: outputs } }
                        : node
                ));

                setExecutionState(prev => ({
                    ...prev,
                    executedNodes: [...prev.executedNodes, nodeId],
                    pendingNodes: prev.pendingNodes.filter(id => id !== nodeId),
                }));
            }

            // Get final output from the last executed node
            const lastNodeId = executionOrder[executionOrder.length - 1];
            const finalOutputs = nodeOutputs.get(lastNodeId) || [];

            setExecutionState(prev => ({
                ...prev,
                status: 'complete',
                currentNodeId: null,
                progress: 100,
                endTime: new Date(),
                outputFiles: finalOutputs,
            }));

            // Update execution history record as completed
            completeExecutionRecord(
                executionRecord.id,
                'completed',
                executionOrder.length
            );

        } catch (error) {
            console.error('[Workflow Execution] Workflow execution failed:', error);
            
            // Extract detailed error information
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            const failedNodeId = (error as Error & { nodeId?: string })?.nodeId || executionState.currentNodeId || '';
            const errorCode = (error as Error & { code?: string })?.code;
            
            // Find the failed node name for better error reporting
            const failedNode = nodes.find(n => n.id === failedNodeId);
            const failedNodeName = failedNode?.data.label || 'Unknown node';
            
            // Build user-friendly error message
            let userMessage = `Workflow failed at "${failedNodeName}": ${errorMessage}`;
            
            // Update execution state with detailed error
            setExecutionState(prev => ({
                ...prev,
                status: 'error',
                currentNodeId: null,
                endTime: new Date(),
                error: {
                    nodeId: failedNodeId,
                    message: userMessage,
                },
            }));
            
            // Update execution history record as failed
            const successfulCount = executionState.executedNodes.length;
            completeExecutionRecord(
                executionRecord.id,
                'failed',
                successfulCount,
                userMessage,
                failedNodeId
            );
            
            // Ensure the failed node shows error status
            if (failedNodeId) {
                setNodes((nds) => nds.map(node =>
                    node.id === failedNodeId && node.data.status !== 'error'
                        ? { 
                            ...node, 
                            data: { 
                                ...node.data, 
                                status: 'error' as const,
                                error: node.data.error || errorMessage,
                            } 
                          }
                        : node
                ));
            }
        }
    }, [nodes, edges, setNodes, executionState]);

    /**
     * Stop workflow execution
     */
    const stopExecution = useCallback(() => {
        setExecutionState(prev => ({
            ...prev,
            status: 'idle',
            currentNodeId: null,
            endTime: new Date(),
        }));

        // Reset processing and pending nodes, but keep completed and error states
        setNodes((nds) => nds.map(node => ({
            ...node,
            data: { 
                ...node.data, 
                status: node.data.status === 'processing' ? 'idle' as const : node.data.status,
                progress: node.data.status === 'processing' ? 0 : node.data.progress,
            },
        })));
    }, [setNodes]);

    /**
     * Retry workflow from failed node
     */
    const retryFromFailedNode = useCallback(async () => {
        if (executionState.status !== 'error' || !executionState.error?.nodeId) {
            console.warn('[Workflow] No failed node to retry from');
            return;
        }

        const failedNodeId = executionState.error.nodeId;
        
        // Clear error state on the failed node and subsequent nodes
        setNodes((nds) => nds.map(node => ({
            ...node,
            data: {
                ...node.data,
                status: node.id === failedNodeId ? 'idle' as const : node.data.status,
                error: node.id === failedNodeId ? undefined : node.data.error,
                progress: node.id === failedNodeId ? 0 : node.data.progress,
            },
        })));

        // Restart execution with the original input files
        if (selectedFiles.length > 0) {
            await executeWorkflow(selectedFiles);
        }
    }, [executionState, selectedFiles, executeWorkflow, setNodes]);

    /**
     * Clear all workflow state (reset all nodes)
     */
    const clearWorkflowState = useCallback(() => {
        console.log('[Workflow] Clearing workflow state and cleaning up resources');
        
        // Cleanup Blob URLs
        cleanupBlobUrls();
        
        // Reset execution state
        setExecutionState({
            status: 'idle',
            currentNodeId: null,
            executedNodes: [],
            pendingNodes: [],
            progress: 0,
        });

        // Reset all node states and clear outputs
        setNodes((nds) => nds.map(node => ({
            ...node,
            data: { 
                ...node.data, 
                status: 'idle' as const, 
                progress: 0,
                error: undefined,
                outputFiles: undefined,
                inputFiles: undefined,
            },
        })));
    }, [setNodes, cleanupBlobUrls]);

    /**
     * Save current workflow
     */
    const handleSaveWorkflow = useCallback((name: string, description?: string) => {
        saveWorkflow(name, nodes as WorkflowNode[], edges as WorkflowEdge[], description);
        setSavedWorkflows(getSavedWorkflows());
    }, [nodes, edges]);

    /**
     * Load a saved workflow
     */
    const loadWorkflow = useCallback((workflow: SavedWorkflow) => {
        setNodes(workflow.nodes);
        setEdges(workflow.edges as Edge[]);
        clearHistory();
    }, [setNodes, setEdges, clearHistory]);

    /**
     * Load workflow from execution history
     */
    const loadFromHistory = useCallback((record: WorkflowExecutionRecord) => {
        // Restore nodes and edges from history snapshot
        setNodes(record.nodes as Node[]);
        setEdges(record.edges as Edge[]);
        
        // Clear execution state
        clearWorkflowState();
        
        // Clear undo/redo history
        clearHistory();
        
        console.log('[Workflow] Loaded from history:', record.workflowName || 'Unnamed');
    }, [clearHistory, clearWorkflowState, setNodes, setEdges]);

    /**
     * Load a template
     */
    const loadTemplate = useCallback((template: WorkflowTemplate) => {
        setNodes(template.nodes);
        setEdges(template.edges as Edge[]);
        clearHistory();
    }, [setNodes, setEdges, clearHistory]);

    /**
     * Clear workflow
     */
    const clearWorkflow = useCallback(() => {
        setNodes([]);
        setEdges([]);
        setSelectedNode(null);
        setIsSettingsPanelOpen(false);
        clearHistory();
        setExecutionState({
            status: 'idle',
            currentNodeId: null,
            executedNodes: [],
            pendingNodes: [],
            progress: 0,
        });
    }, [setNodes, setEdges, clearHistory]);

    /**
     * Delete a saved workflow
     */
    const handleDeleteWorkflow = useCallback((id: string) => {
        deleteWorkflow(id);
        setSavedWorkflows(getSavedWorkflows());
    }, []);

    /**
     * Duplicate a workflow
     */
    const handleDuplicateWorkflow = useCallback((id: string) => {
        duplicateWorkflow(id);
        setSavedWorkflows(getSavedWorkflows());
    }, []);

    /**
     * Export a workflow
     */
    const handleExportWorkflow = useCallback((workflow: SavedWorkflow) => {
        exportWorkflow(workflow);
    }, []);

    /**
     * Import a workflow
     */
    const handleImportWorkflow = useCallback(async (file: File) => {
        const imported = await importWorkflow(file);
        if (imported) {
            setSavedWorkflows(getSavedWorkflows());
            loadWorkflow(imported);
        }
    }, [loadWorkflow]);

    return (
        <div className="flex h-full relative">
            {/* Left Sidebar - Tool Library */}
            <ToolSidebar
                onDragStart={onDragStart}
                isCollapsed={isLeftSidebarCollapsed}
                onToggleCollapse={() => setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)}
            />

            {/* Main Canvas Area */}
            <div className="flex-1 flex flex-col">
                {/* Controls with Undo/Redo */}
                <div className="flex items-center">
                    <div className="flex-1">
                        <WorkflowControls
                            nodes={nodes as WorkflowNode[]}
                            edges={edges as WorkflowEdge[]}
                            executionState={executionState}
                            validation={validation}
                            onExecute={executeWorkflow}
                            onStop={stopExecution}
                            onSave={handleSaveWorkflow}
                            onClear={clearWorkflow}
                            onClearState={clearWorkflowState}
                            onRetry={retryFromFailedNode}
                            onImport={handleImportWorkflow}
                            onFilesChange={setSelectedFiles}
                        />
                    </div>
                </div>

                {/* Canvas */}
                <div className="flex-1 relative" ref={reactFlowWrapper}>
                    {/* Undo/Redo buttons */}
                    <div className="absolute top-2 left-2 z-10 flex gap-1">
                        <button
                            onClick={handleUndo}
                            disabled={!canUndo}
                            className={`
                                p-2 rounded-lg bg-[hsl(var(--color-background))] border border-[hsl(var(--color-border))] shadow-sm
                                ${canUndo
                                    ? 'hover:bg-[hsl(var(--color-muted))] cursor-pointer'
                                    : 'opacity-50 cursor-not-allowed'
                                }
                            `}
                            title={`${tWorkflow('undo') || 'Undo'} (Ctrl+Z)`}
                        >
                            <Undo2 className="w-4 h-4 text-[hsl(var(--color-foreground))]" />
                        </button>
                        <button
                            onClick={handleRedo}
                            disabled={!canRedo}
                            className={`
                                p-2 rounded-lg bg-[hsl(var(--color-background))] border border-[hsl(var(--color-border))] shadow-sm
                                ${canRedo
                                    ? 'hover:bg-[hsl(var(--color-muted))] cursor-pointer'
                                    : 'opacity-50 cursor-not-allowed'
                                }
                            `}
                            title={`${tWorkflow('redo') || 'Redo'} (Ctrl+Shift+Z)`}
                        >
                            <Redo2 className="w-4 h-4 text-[hsl(var(--color-foreground))]" />
                        </button>
                    </div>

                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onInit={setReactFlowInstance}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onNodeClick={onNodeClick}
                        nodeTypes={nodeTypes}
                        edgeTypes={edgeTypes}
                        defaultEdgeOptions={defaultEdgeOptions}
                        connectionMode={ConnectionMode.Loose}
                        deleteKeyCode={['Backspace', 'Delete']}
                        fitView
                        snapToGrid
                        snapGrid={[15, 15]}
                    >
                        <Controls />
                        <MiniMap
                            nodeStrokeWidth={3}
                            zoomable
                            pannable
                        />
                        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />

                        {/* Empty state */}
                        {nodes.length === 0 && (
                            <Panel position="top-center" className="mt-20">
                                <div className="text-center p-8 bg-[hsl(var(--color-background))] rounded-lg border border-dashed border-[hsl(var(--color-border))] shadow-sm">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[hsl(var(--color-muted))] flex items-center justify-center">
                                        <svg className="w-8 h-8 text-[hsl(var(--color-muted-foreground))]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M4 14h6v6H4zM14 4h6v6h-6z" />
                                            <path d="M7 4v10M17 14v6M4 17h6M14 7h6" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-[hsl(var(--color-foreground))]">
                                        {tWorkflow('emptyTitle') || 'Create Your Workflow'}
                                    </h3>
                                    <p className="text-sm text-[hsl(var(--color-muted-foreground))] mt-2 max-w-sm">
                                        {tWorkflow('emptyDescription') || 'Drag tools from the sidebar to build your PDF processing pipeline. Connect nodes to define the processing order.'}
                                    </p>
                                    <p className="text-xs text-[hsl(var(--color-muted-foreground))] mt-4">
                                        {tWorkflow('clickHint') || 'Click a node to configure its settings'}
                                    </p>
                                </div>
                            </Panel>
                        )}
                    </ReactFlow>
                </div>
            </div>

            {/* Right Sidebar - Templates & Saved Workflows */}
            <WorkflowLibrary
                savedWorkflows={savedWorkflows}
                onLoadTemplate={loadTemplate}
                onLoadWorkflow={loadWorkflow}
                onDeleteWorkflow={handleDeleteWorkflow}
                onDuplicateWorkflow={handleDuplicateWorkflow}
                onExportWorkflow={handleExportWorkflow}
                onLoadFromHistory={loadFromHistory}
                isCollapsed={isRightSidebarCollapsed}
                onToggleCollapse={() => setIsRightSidebarCollapsed(!isRightSidebarCollapsed)}
            />

            {/* Node Settings Panel */}
            {isSettingsPanelOpen && (
                <NodeSettingsPanel
                    node={selectedNode}
                    onClose={() => setIsSettingsPanelOpen(false)}
                    onUpdateSettings={handleUpdateNodeSettings}
                />
            )}

            {/* Preview */}
            <WorkflowPreview
                nodes={nodes as WorkflowNode[]}
                edges={edges as WorkflowEdge[]}
                inputFiles={selectedFiles}
                isVisible={isPreviewVisible}
                onToggle={() => setIsPreviewVisible(!isPreviewVisible)}
            />
        </div>
    );
}

/**
 * Workflow Editor with ReactFlow Provider
 */
export function WorkflowEditor() {
    return (
        <ReactFlowProvider>
            <WorkflowEditorContent />
        </ReactFlowProvider>
    );
}

export default WorkflowEditor;
