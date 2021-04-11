import { ExecSyncOptions, execSync } from 'child_process';
import { join } from 'path';

describe('Test Run', () => {
    it('should run successfully', () => {
        const options: ExecSyncOptions = {
            env: {
                ...process.env,
                INPUT_INPUT: 'some-input',
            },
            cwd: __dirname,
            encoding: 'utf-8',
        };

        const action = join(__dirname, '..', 'src', 'main.ts');

        const response = execSync(`npx ts-node "${action}"`, options).toString();
        expect(response).toContain('::set-output name=echoedInput::some-input');
    });
});
