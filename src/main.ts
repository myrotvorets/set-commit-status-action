import { getInput, info, setFailed, warning } from '@actions/core';
import { getOctokit } from '@actions/github';
import {
    CommitStatusState,
    getCommitHash,
    isForeignPullRequest,
    parseRepoName,
    validateCommitStatusState,
} from './utils';

interface Inputs {
    token: string;
    state: CommitStatusState;
    owner: string;
    repo: string;
    allowForks: boolean;
    sha: string;
    targetUrl?: string;
    description?: string;
    context?: string;
}

function getInputs(): Inputs {
    const token = getInput('token', { required: true });
    const state = validateCommitStatusState(getInput('status', { required: true }));
    const [owner, repo] = parseRepoName(getInput('repo'));
    const allowForks = getInput('allowForks');
    const sha = getCommitHash(getInput('sha'));
    const targetUrl = getInput('targetUrl');
    const description = getInput('description');
    const context = getInput('context');

    return {
        token,
        state,
        repo,
        owner,
        allowForks: allowForks ? allowForks === 'true' : false,
        sha,
        targetUrl: targetUrl || undefined,
        description: description || undefined,
        context: context,
    };
}

async function run(): Promise<void> {
    try {
        const inputs = getInputs();
        if (isForeignPullRequest() && !inputs.allowForks) {
            warning('Ignoring the PR form a forked repository');
            return;
        }

        info(
            `Setting commit status for ${inputs.owner}/${inputs.repo}#${inputs.sha} to ${inputs.state} for context ${inputs.context}`,
        );

        const octokit = getOctokit(inputs.token);
        await octokit.rest.repos.createCommitStatus({
            owner: inputs.owner,
            repo: inputs.repo,
            sha: inputs.sha,
            state: inputs.state,
            target_url: inputs.targetUrl,
            description: inputs.description,
            context: inputs.context,
        });
    } catch (error) {
        setFailed((error as Error).message);
    }
}

void run();
