
export interface ToolInput {
    data: any;
    schema?: any;
}

export interface ToolOutput {
    result?: any;
    error?: string;
}

export interface Tool {
    name: string;
    description: string;
    run(input: ToolInput): Promise<ToolOutput>;
}