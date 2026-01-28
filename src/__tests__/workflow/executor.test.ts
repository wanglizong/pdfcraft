/**
 * Workflow Executor Tests
 * Tests for node execution and file handling
 */

import { describe, it, expect } from 'vitest';
import { collectInputFiles } from '@/lib/workflow/executor';
import type { WorkflowNode, WorkflowEdge, WorkflowOutputFile } from '@/types/workflow';

describe('Workflow Executor', () => {
    describe('collectInputFiles', () => {
        const nodes: WorkflowNode[] = [
            {
                id: 'node1',
                type: 'toolNode',
                position: { x: 0, y: 0 },
                data: {
                    toolId: 'merge-pdf',
                    label: 'Merge PDF',
                    icon: 'file-plus',
                    category: 'organize',
                    acceptedFormats: ['.pdf'],
                    outputFormat: '.pdf',
                    status: 'idle',
                    progress: 0,
                    inputFiles: [
                        new File([new Blob(['test1'])], 'input1.pdf', { type: 'application/pdf' }),
                        new File([new Blob(['test2'])], 'input2.pdf', { type: 'application/pdf' }),
                    ],
                },
            },
            {
                id: 'node2',
                type: 'toolNode',
                position: { x: 200, y: 0 },
                data: {
                    toolId: 'compress-pdf',
                    label: 'Compress PDF',
                    icon: 'minimize',
                    category: 'optimize',
                    acceptedFormats: ['.pdf'],
                    outputFormat: '.pdf',
                    status: 'idle',
                    progress: 0,
                },
            },
        ];

        const edges: WorkflowEdge[] = [
            { id: 'e1-2', source: 'node1', target: 'node2' },
        ];

        it('should return input files for nodes without parents', () => {
            const inputs = collectInputFiles('node1', nodes, [], new Map());
            expect(inputs).toHaveLength(2);
            expect(inputs[0]).toBeInstanceOf(File);
        });

        it('should return empty array for nodes without parents or input files', () => {
            const nodesWithoutInput = nodes.map(n => ({
                ...n,
                data: { ...n.data, inputFiles: undefined },
            }));
            const inputs = collectInputFiles('node1', nodesWithoutInput, [], new Map());
            expect(inputs).toHaveLength(0);
        });

        it('should collect outputs from parent nodes', () => {
            const nodeOutputs = new Map<string, (Blob | WorkflowOutputFile)[]>();
            const output1: WorkflowOutputFile = {
                blob: new Blob(['output1'], { type: 'application/pdf' }),
                filename: 'merged.pdf',
            };
            nodeOutputs.set('node1', [output1]);

            const inputs = collectInputFiles('node2', nodes, edges, nodeOutputs);
            expect(inputs).toHaveLength(1);
            expect(inputs[0]).toEqual(output1);
        });

        it('should collect outputs from multiple parent nodes', () => {
            const multiParentEdges: WorkflowEdge[] = [
                { id: 'e1-2', source: 'node1', target: 'node2' },
                { id: 'e3-2', source: 'node3', target: 'node2' },
            ];

            const node3: WorkflowNode = {
                id: 'node3',
                type: 'toolNode',
                position: { x: 0, y: 100 },
                data: {
                    toolId: 'rotate-pdf',
                    label: 'Rotate PDF',
                    icon: 'rotate-cw',
                    category: 'organize',
                    acceptedFormats: ['.pdf'],
                    outputFormat: '.pdf',
                    status: 'idle',
                    progress: 0,
                },
            };

            const nodeOutputs = new Map<string, (Blob | WorkflowOutputFile)[]>();
            nodeOutputs.set('node1', [{
                blob: new Blob(['output1'], { type: 'application/pdf' }),
                filename: 'out1.pdf',
            }]);
            nodeOutputs.set('node3', [{
                blob: new Blob(['output3'], { type: 'application/pdf' }),
                filename: 'out3.pdf',
            }]);

            const inputs = collectInputFiles('node2', [...nodes, node3], multiParentEdges, nodeOutputs);
            expect(inputs).toHaveLength(2);
        });

        it('should handle Blob outputs without metadata', () => {
            const nodeOutputs = new Map<string, (Blob | WorkflowOutputFile)[]>();
            const plainBlob = new Blob(['plain output'], { type: 'application/pdf' });
            nodeOutputs.set('node1', [plainBlob]);

            const inputs = collectInputFiles('node2', nodes, edges, nodeOutputs);
            expect(inputs).toHaveLength(1);
            expect(inputs[0]).toBeInstanceOf(Blob);
        });
    });
});
