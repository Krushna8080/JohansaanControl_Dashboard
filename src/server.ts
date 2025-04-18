// This is a placeholder for server-side rendering
// We're only using client-side rendering for this project
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Dummy function to prevent errors
export const reqHandler = (req: any, res: any) => {
  res.status(200).send('Server-side rendering is not implemented in this project');
};
