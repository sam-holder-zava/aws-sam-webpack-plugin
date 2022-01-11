pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
              script {
                echo 'Building..'

                def nvmVersion = "0.34.0"
                def nodeVersion = "12.19.0"
                def nvmInstallURL = "https://raw.githubusercontent.com/creationix/nvm/v${nvmVersion}/install.sh"
                def nvmNodeJsOrgMirror = "https://nodejs.org/dist"
                nvm(nvmInstallURL: nvmInstallURL, nvmNodeJsOrgMirror: nvmNodeJsOrgMirror, version: nodeVersion) {
                  sh """
                    npm install
                    npm run prepare
                  """
                }
              }
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
                    sh """
                        npm publish
                      """
            }
        }
    }
}
