# AutoZoomManager

AutoZoomManager is a web application for automating Zoom meeting tasks. It provides features such as scheduling meetings, generating meeting links, sending invitations, and managing recordings.

## Features

- Schedule Zoom meetings with specified date, time, and duration.
- Generate unique meeting links for each scheduled meeting.
- Send email invitations to participants with meeting details and joining instructions.
- Manage meeting recordings, including downloading and deleting recordings.
- Display meeting analytics and statistics.
- Integration with Zoom API for seamless interaction with the Zoom platform.

## Installation

### Local Development

To run AutoZoomManager locally, follow these steps:

#### Frontend

1. Navigate to the frontend directory: `cd frontend/AutoZoomV2`.
2. Install frontend dependencies: `npm ci` (for quicker installation).
3. Start the frontend development server: `npm run dev`.
4. The frontend application will be available at `http://localhost:8000`.

#### Server

1. Navigate to the server directory: `cd server-to-server-oauth-starter-api-main`.
2. Create a `.env` file and add your Zoom credentials:
   ```plaintext
   ZOOM_ACCOUNT_ID=<your-zoom-account-id>
   ZOOM_CLIENT_ID=<your-zoom-client-id>
   ZOOM_CLIENT_SECRET=<your-zoom-client-secret>
   Replace <your-zoom-account-id>, <your-zoom-client-id>, and <your-zoom-client-secret> with your actual Zoom credentials.
   ```
3. Build and start the server using Docker Compose:

- For production mode: `docker-compose up prod`.
- For development mode: `docker-compose up dev`.

4. The server will be available at `http://localhost:8080`.

### AWS Deployment with Docker and GitHub Actions

To deploy AutoZoomManager on AWS using Docker and GitHub Actions, follow these steps:

1. Set up your AWS EC2 instance and configure SSH access.
2. Clone the repository on your local machine: `git clone https://github.com/your-username/your-repository.git`.
3. Navigate to the project root directory: `cd your-repository`.
4. Create a `.env` file in the `server-to-server-oauth-starter-api-main` directory and add your Zoom credentials (same as in local setup).
5. Update the GitHub Actions workflow file (`.github/workflows/main.yml`) with your AWS EC2 instance details and credentials.
6. Commit and push the changes to your GitHub repository.
7. GitHub Actions will automatically trigger the workflow, build the Docker images, and deploy the application to your AWS EC2 instance.
8. Access the deployed application by visiting your AWS EC2 instance's public IP or domain.

## Usage

1. Sign in to the AutoZoomManager application with your credentials.
2. Navigate to the meetings dashboard to view a list of scheduled meetings.
3. Click on the "New Meeting" button to schedule a new meeting.
4. Fill in the meeting details, such as title, date, time, duration, and participant emails.
5. Save the meeting, and the application will generate a unique meeting link and send invitations to the participants.
6. On the meetings dashboard, you can view, edit, or delete scheduled meetings.
7. Access the recording management section to download or delete meeting recordings.
8. View meeting analytics and statistics to gain insights into meeting attendance and engagement.

## Contributing

Contributions to AutoZoomManager are welcome! If you find any issues or have suggestions for improvements, please submit a pull request or open an issue on the GitHub repository.

## License

This project is licensed under the MIT License.
