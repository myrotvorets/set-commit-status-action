import * as core from '@actions/core';

function run(): void {
    try {
        const input = core.getInput('input', { required: false });

        core.setOutput('echoedInput', input);
    } catch (error) {
        core.setFailed((error as Error).message);
    }
}

run();
