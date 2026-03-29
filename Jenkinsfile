pipeline {
    agent any
    environment {
        APP_NAME = "app-frontend"
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Anju-Narnolia/frontend-ai-tools', credentialsId: 'github-creds'
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    sh 'docker build -t ${APP_NAME}:latest .'
                }
            }
        }
        stage('Run Container') {
            steps {
                script {
                    sh 'docker stop ${APP_NAME} || true'
                    sh 'docker rm ${APP_NAME} || true'
                    // Run frontend on port 5173
                   sh 'docker run -d -p 5173:5173 --network my-network --name ${APP_NAME} ${APP_NAME}:latest'
                }
            }
        }
    }
    post {
        success {
            echo "✅ App frontend deployed successfully!"
        }
        failure {
            echo "❌ Build failed. Check logs."
        }
    }
}
