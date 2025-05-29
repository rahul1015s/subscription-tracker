import { Client as workflowClient } from '@upstash/workflow'; // Corrected from Clint to Client

import { QSTASH_URL, QSTASH_TOKEN } from './env.js';

export const WorkflowClient = new workflowClient({
    baseUrl: QSTASH_URL,
    token: QSTASH_TOKEN,
});
