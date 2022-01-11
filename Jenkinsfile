
   
@Library("jenkins-shared-libraries@1.6.2") _
import com.zavamed.*

dockerUtils = new Docker(this)
slack = new Slack(this)

// Defining all these as global variables
// so we can reuse them in all functions.
isMasterBranch = env.BRANCH_NAME == "master"
versionType = null

stgStorybookUrl = "https://docs.zavamed.com/ui-packages/storybook/stg"
prdStorybookUrl = "https://docs.zavamed.com/ui-packages/storybook/prd"
branchStorybookUrl = "https://docs.zavamed.com/ui-packages/storybook/branches/${env.BRANCH_NAME}"

// Setting some defaults
jenkinsNode = "aws-slave"
nodeVersion = "12.22.1"
nvmVersion = "0.34.0"
projectName = "@ui"
slackChannel = "#jenkins-shared"
repositoryName = "ui-packages"
registryUrl = "https://verdaccio.svc.zavasrv.com"
brands = ['zava', 'superdrug', 'dred', 'asda']

node(jenkinsNode) {
  properties([
    disableConcurrentBuilds(),
    parameters([
      stringParam(
        name: "BuildPriority",
        defaultValue: isMasterBranch ? "2" : "4",
        description: "Pipeline for ${projectName}"
      )
    ])
  ])

  wrapper({
    stage("Setup") {
      checkout scm
      runNpmCommand("install")
    }

    // stage("Lint") {
    //   if (runNpmCommand("run lint") != 0) {
    //     error "Lint failed!"
    //   }
    // }

    // stage("Unit tests") {
    //   if (runNpmCommand("run test") != 0) {
    //     error "Unit tests failed!"
    //   }
    // }

    stage("Build") {
      if (runNpmCommand("run prepare") != 0) {
        error "npm run prepare failed!"
      }
    }

    // Checking whether the packages have changed...
    // updatedPackages will be 0 if any package changed.
    

    if (isMasterBranch) {
      stage('Publish') {
          sh """
              npm publish
            """
        // withAWS(region: 'eu-west-1') {
        //   awsIdentity()
        //   s3Path = 'npm/zava-ui-toolkit/icons.tar'
        //   s3Upload(
        //     file: 'packages/zava-ui-toolkit/generated-site/icons.tar',
        //     bucket: 'repo.zavamed.com',
        //     path: s3Path
        //   )
        //   echo "Uploaded icons to https://s3-eu-west-1.amazonaws.com/repo.zavamed.com/${s3Path}"
        // }
        // withCredentials([usernamePassword(credentialsId: 'github-app-jenkins-committer',
        //                                     usernameVariable: 'GITHUB_APP',
        //                                     passwordVariable: 'GITHUB_ACCESS_TOKEN')]) {
        //   // This is sadly necessary :'(
        //   // Without this, lerna complains about no global git
        //   // config and the repository being in a detached HEAD.
        //   sh """
        //     git config --global user.name "Jenkins"
        //     git config --global user.email "jenkins@dred.com"
        //     git remote set-url origin https://x-access-token:${GITHUB_ACCESS_TOKEN}@github.com/healthbridgeltd/${repositoryName}.git
        //     git checkout ${env.BRANCH_NAME}
        //     git pull origin ${env.BRANCH_NAME}
        //     npx lerna version ${versionType} --yes --force-publish
        //     npx lerna publish from-package --yes
        //   """
        // }
      }
    }
  })
}

stage("Done") {
  echo "aws-sam-webpack-plugin pipeline finished"
}

/**
 * Runs given npm command and returns exit code.
 */
def runNpmCommand(cmd) {
  return sh([
    script: "npm ${cmd}",
    returnStatus: true,
  ])
}

/**
 * Wraps a try-catch, ansiColor and nvm around the given
 * closure. It helps to keep the pipeline code tidy.
 */
def wrapper(Closure pipeline) {
  try {
    ansiColor(colorMapName: "xterm") {
      def nvmInstallURL = "https://raw.githubusercontent.com/creationix/nvm/v${nvmVersion}/install.sh"
      def nvmNodeJsOrgMirror = "https://nodejs.org/dist"

      nvm(nvmInstallURL: nvmInstallURL, nvmNodeJsOrgMirror: nvmNodeJsOrgMirror, version: nodeVersion) {
        pipeline()
      }
    }
  } catch (error) {
    currentBuild.result = "FAILED"
    cleanWs()

    echo "${error}"

    slack.jobFailed(
      channel: slackChannel,
      user: env.CHANGE_AUTHOR,
      error: error,
      email: false
    )

    throw error
  }
}