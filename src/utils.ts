import { context } from '@actions/github';
// eslint-disable-next-line import/no-unresolved
import type { PullRequest } from '@octokit/webhooks-types';

export type CommitStatusState = 'error' | 'failure' | 'pending' | 'success';

function isPullRequest(): boolean {
    return context.eventName === 'pull_request';
}

function isPush(): boolean {
    return context.eventName === 'push';
}

export function isForeignPullRequest(): boolean {
    const { payload } = context;
    if (payload.pull_request) {
        const pr = payload.pull_request as PullRequest;
        const baseRepo = pr.base.repo.full_name;
        const headRepo = pr.head.repo?.full_name;

        return baseRepo !== headRepo;
    }

    return false;
}

function getSHA(): string | null {
    const { payload } = context;
    switch (true) {
        case isPullRequest():
            return (payload.pull_request as PullRequest).head.sha;

        case isPush():
            return context.sha;

        default:
            return null;
    }
}

export function validateCommitStatusState(state: string): CommitStatusState {
    const allowedStates: Record<CommitStatusState, boolean> = {
        error: true,
        failure: true,
        pending: true,
        success: true,
    };

    if (state === 'cancelled') {
        return 'error';
    }

    if (!(state in allowedStates)) {
        throw new Error('state must be one of "error", "failure", "pending", "success"');
    }

    return state as CommitStatusState;
}

export function getCommitHash(sha: string): string {
    const commit = sha || getSHA();
    if (!commit) {
        throw new Error('Unable to determine the commit hash. Please provide the `sha` parameter');
    }

    return commit;
}

export function parseRepoName(repository: string): [owner: string, repo: string] {
    let owner: string;
    let repo: string;
    if (repository) {
        [owner, repo] = repository.split('/', 2);
    } else {
        ({ owner, repo } = context.repo);
    }

    return [owner, repo];
}
