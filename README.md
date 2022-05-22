# Set Commit Status

GitHub action to update the status for the given commit.

## Inputs

| Name          | Default             | Description |
| ------------- | ------------------- | ----------- |
| `token`       | `github.token`      | Authentication token used to set the commit status. Defaults to `github.token`. The token must have `statuses: write` permission |
| `status`      | `pending`           | Commit status to set (one of "error", "failure", "pending", "success").         |
| `repo`        | `github.repository` | The name of the repository to operate on (`owner/repo`).                        |
| `allowForks`  | `false`             | Whether to allow to set commit status if the request comes from a forked repository. Defaults to `false` because the `GITHUB_TOKEN` for a forked repository usually does not have the necessary permissions to update the commit status. *This only affects pull requests.* |
| `sha`         |                     | The SHA hash of the commit to update. It can be determined automatically for pushes and pull requests but needs to be provided for other events. Defaults to `github.pull_request.head.sha` for pull request, and `github.sha` for pushes |
| `targetUrl`   |                     | The target URL to associate with this status. This URL will be linked from the GitHub UI to allow users to see the source of the status. Defaults to the workflow summary URL. |
| `description` |                     | A short description of the status.                                              |
| `context`     | `github.workflow`   | A string label to differentiate this status from the status of other systems.   |

## Example usage

```yaml
      - name: Set commit status as pending
        uses: myrotvorets/set-commit-status-action@master
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          status: pending
          context: Publish NPM package

      - name: Do the actual work
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

      - name: Set final commit status
        uses: myrotvorets/set-commit-status-action@master
        if: always()
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          status: ${{ job.status }}
          context: Publish NPM package
```
