module.exports = robot => {
  robot.on('pull_request.opened', async context => {
      robot.log("New PR Open")
      // Get all issues for repo with user as creator
      // const response = await context.github.issues.getForRepo(context.repo({
      //     state: 'all',
      //     creator: context.payload.pull_request.user.login
      // }));

      // const countPR = response.data.filter(data => data.pull_request);
      // Only for the first PR of this user?
      // if (countPR.length === 1) {
      try {
          const config = await context.config('config.yml');
          if (config.newPRComment) {
              context.github.issues.createComment(context.issue({body: config.newPRComment}));
          }
      } catch (err) {
          if (err.code !== 404) {
              throw err;
          }
      }
      // }
  })

  robot.on('pull_request.closed', async context => {
    robot.log("PR Closed")
    if (context.payload.pull_request.merged) {
      // const creator = context.payload.pull_request.user.login
      // const {owner, repo} = context.repo()
      // const res = await context.github.search.issues({q: `is:pr is:merged author:${creator} repo:${owner}/${repo}`})

      // const mergedPRs = res.data.items.filter(pr => pr.number !== context.payload.pull_request.number)
      // If only the first PR merged.
      // if (mergedPRs.length === 0) {
        try {
          const config = await context.config('config.yml')
          if (config.PRMergeComment) {
            context.github.issues.createComment(context.issue({body: config.PRMergeComment}))
          }
        } catch (err) {
          if (err.code !== 404) {
            throw err
          }
        }
      // }
    }
  })
}
