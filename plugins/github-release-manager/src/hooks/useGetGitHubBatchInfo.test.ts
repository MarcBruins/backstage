/*
 * Copyright 2021 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { renderHook, act } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';

import { mockApiClient, mockSemverProject } from '../test-helpers/test-helpers';
import { useGetGitHubBatchInfo } from './useGetGitHubBatchInfo';

describe('useGetGitHubBatchInfo', () => {
  it('should handle repositories with releases', async () => {
    const { result } = renderHook(() =>
      useGetGitHubBatchInfo({
        pluginApiClient: mockApiClient,
        project: mockSemverProject,
        refetchTrigger: 1337,
      }),
    );

    await act(async () => {
      await waitFor(() => result.current.gitHubBatchInfo !== undefined);
    });

    expect(result.current.gitHubBatchInfo).toMatchInlineSnapshot(`
      Object {
        "loading": false,
        "value": Object {
          "latestRelease": Object {
            "htmlUrl": "mock_release_html_url",
            "id": 1,
            "prerelease": false,
            "tagName": "rc-2020.01.01_1",
            "targetCommitish": "rc/2020.01.01_1",
          },
          "releaseBranch": Object {
            "commit": Object {
              "commit": Object {
                "tree": Object {
                  "sha": "mock_branch_commit_commit_tree_sha",
                },
              },
              "sha": "mock_branch_commit_sha",
            },
            "links": Object {
              "html": "mock_branch_links_html",
            },
            "name": "rc/1.2.3",
          },
          "repository": Object {
            "defaultBranch": "mock_defaultBranch",
            "name": "mock_repo",
            "pushPermissions": true,
          },
        },
      }
    `);
  });

  it('should handle repositories without any releases', async () => {
    (mockApiClient.getLatestRelease as jest.Mock).mockResolvedValueOnce(null);

    const { result } = renderHook(() =>
      useGetGitHubBatchInfo({
        pluginApiClient: mockApiClient,
        project: mockSemverProject,
        refetchTrigger: 1337,
      }),
    );

    await act(async () => {
      await waitFor(() => result.current.gitHubBatchInfo !== undefined);
    });

    expect(result.current.gitHubBatchInfo).toMatchInlineSnapshot(`
      Object {
        "loading": false,
        "value": Object {
          "latestRelease": null,
          "releaseBranch": null,
          "repository": Object {
            "defaultBranch": "mock_defaultBranch",
            "name": "mock_repo",
            "pushPermissions": true,
          },
        },
      }
    `);
  });
});
