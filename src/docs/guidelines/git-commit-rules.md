# Git and commit rules

Commits should **not** be pushed directly to the **main** branch except in emergencies and the following guidelines should be followed for contributions.

## 1) Every task, one branch

For each task, first "fetch" and get the latest changes from "main" branch, and then create a new branch from the last commit in main with this naming pattern:

`<type>/<task-id>-<short-description>`

**type**: Branch type (type of work done)

- **feat**:  
   Used when implementing a new feature or enhancement in the application.  
   _Example: `feat/1234-user-login`_
- **fix**:  
   Used for fixing bugs, errors, or incorrect behaviors in the system.  
   _Example: `fix/5678-button-disabled-state`_
- **refactor**:  
   Used when restructuring or improving existing code without changing its external behavior.  
   _Example: `refactor/9012-auth-service-cleanup`_
- **hotfix**:  
   Used for urgent or emergency fixes, usually applied directly to production.  
   _Example: `hotfix/7890-fix-production-crash`_
- **docs**:  
   Used for documentation updates or improvements, such as README edits or adding usage guides.  
   _Example: `docs/1357-update-readme-auth-section`_

- **chore**:  
   Used for routine tasks that don’t change functionality, such as dependency updates, configuration changes, or maintenance tasks.  
   _Example: `chore/3456-update-dependencies`_
- **test**:  
   Used for adding, updating, or improving automated tests.  
   _Example: `test/2468-add-unit-tests-for-user-api`_

**task-id**: Task ID in the project management system (e.g. JIRA, Trello, Linear, Notion, ...).

**short-description**: A summary of the branch's purpose in kebab-case format

More example:

```
feature/1234-user-login

fix/5678-button-disabled-state

refactor/9012-auth-service-cleanup

chore/3456-update-dependencies

hotfix/7890-fix-production-crash
```

&nbsp;

## 2) Conventional Commits

The project uses [commitlint](https://commitlint.js.org/) to improve DX.

Also, custom rules are not defined for greater compatibility, and you can see the list of default rules in the [Rules section in commitlint](https://commitlint.js.org/reference/rules.html).

```md
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

You can see [commitlint npm documentation](https://www.npmjs.com/package/@commitlint/config-conventional) for more examples and explanations.

- **feat** # New features
- **fix** # Bug fixes
- **refactor** # Code refactoring
- **docs** # Documentation changes
- **style** # Code style changes (formatting, missing semicolons, etc.)
- **perf** # Performance improvements
- **test** # Adding or updating tests
- **build** # Build system or external dependencies
- **ci** # CI/CD changes
- **chore** # Other changes that don't modify src or test files
- **revert** # Reverts a previous commit

**NOTICE**: The only specific thing I included for this project is the ticket ID at the beginning of the description text, which is not required, but it is better to include it to make it easier to find the ticket and comments related to it. for example, for a task with id 25, we would write (task id-other description):

`feat: 25 allow provided config object to extend other configs`

&nbsp;

## 3) Stay updated and Avoid conflicts

During a task that takes a relatively long development time (for example, more than 4 hours), whenever you reach a desired point, merge the changes in the main branch with your branch, unless your changes are fundamental and lead to complex conflicts, in which case, merge it with the main branch only before sending a pull request.

**Notice**: Keep the merges you do with the main branch simple and **do not Squash merge**.

&nbsp;

## 4) Last minute update

Before submitting the final pull request, be sure to merge and update your main branch with the latest changes.

&nbsp;

## 5) Squash merge pull requests

**Avoid normal merging** of branches with the **main branch** and be sure to squash merge them with the main branch for better readability and easier reverting.

&nbsp;

## 6) Deleting a branch after merging with main

The defined branch is automatically deleted after being merged with main by the policy defined in git.

You can use `git fetch --prune` command to clean up your workspace.

&nbsp;

&nbsp;

[< back](/README.md)
