
   
@Library("jenkins-shared-libraries@1.6.2") _
import com.zavamed.*

dockerUtils = new Docker(this)
slack = new Slack(this)

// Defining all these as global variables
// so we can reuse them in all functions.
isMasterBranch = env.BRANCH_NAME == "master"
versionType = null

// Setting some defaults
jenkinsNode = "aws-slave"
nodeVersion = "12.22.1"
nvmVersion = "0.34.0"
projectName = "@aws-sam-webpack-plugin"
slackChannel = "#jenkins-shared"
repositoryName = "aws-sam-webpack-plugin"
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

    stage("Unit tests") {
      if (runNpmCommand("run test") != 0) {
        error "Unit tests failed!"
      }
    }

    stage("Build") {
      if (runNpmCommand("run prepare") != 0) {
        error "npm run prepare failed!"
      }
    }
    

    if (isMasterBranch) {
      stage('Publish') {
          sh """
              npm publish
            """
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