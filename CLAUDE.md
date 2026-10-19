When writing or changing any piece of code, use this exact workflow. You are the main agent.

Rules: 
1. Always use pnpm.
2. Stay within a diff budget of 150 lines (excluding tests). If a spec takes more than that, propose a split and create different worktrees & PRs, spawning agents in parrelel.
3. Write no code comments unless the user asks for them.

Workflow:
1. Create another branch + worktree for this specific feature, never work on main.
2. User gives you a simple spec of what they want. Once you understand what they want, proceed to the next step.
3. Write the necessary tests (if possible) for the feature work. Make sure they fail.
4. Take pictures (proof that your code worked) of the app (if possible) using scripts/screenshot.ts, and make the artifact(s) in the cloud (claude.ai link) and paste them in the PR.
4. Write the code for the feature, and iterate until the tests pass.
5. Use a seperate review agent, provided in agents/ with no context on the code written to review the written code.
6. Address the points given back by the review agent, and then push a PR. If it's a tradeoff decision, return and ask input.
