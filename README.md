# AutoZoomManager

AutoZoomManager is a web application designed to automate various Zoom meeting tasks. It offers functionalities such as scheduling meetings, generating unique meeting links, sending out email invitations, and handling meeting recordings.

![AutoZoomManager - Internal Zoom Meeting Automation Tool | Feature Showcase](https://i9.ytimg.com/vi_webp/H1BX7cXeVKU/mqdefault.webp?v=651556fd&sqp=CNSt1agG&rs=AOn4CLBq9wnAGPA1JI52m1zZ7-FrQH2TMg)

🎥 [Watch the AutoZoomManager Demo on YouTube](https://www.youtube.com/watch?v=H1BX7cXeVKU)

## Application Evolution

### Initial Deployment on AWS EC2

The application was initially deployed on an EC2 instance on AWS. This provided a robust environment for the application to run and scale.

### Containerization with Docker and Automation with GitHub Actions

To streamline the development and deployment process, the application was containerized using Docker. A workflow was set up using GitHub Actions to automate tasks like building, containerization, caching, and deployment to the EC2 instance.

### Transition to Heroku for HTTPS Requirement

The most effective way to monitor meetings was identified to be through webhooks. However, the Zoom API required an HTTPS endpoint. To fulfill this requirement, the decision was made to transition the deployment to Heroku. This move also allowed for splitting the deployment into two separate processes: one for the frontend and another for the backend.

### Transition from Redis to MongoDB

Heroku's platform constraints made it challenging to run a Redis server. To better adapt to this environment and ensure efficient token management, Redis was replaced with MongoDB.

### Integration of Zoom Webhooks

With the acquisition of an HTTPS URL from Heroku, it became feasible to integrate webhooks with the Zoom application. This integration allows for real-time monitoring of meeting events.

### Upcoming Features

The next step in the application's evolution is to enhance the live meeting table to work seamlessly with the Zoom users stored in our database, in conjunction with the webhooks.

## Features

- **Schedule Zoom Meetings**: Define the date, time, and duration for your Zoom meetings.
- **Unique Meeting Links**: Generate distinct meeting links for every scheduled meeting.
- **Email Invitations**: Dispatch email invites to participants with all the necessary meeting details and instructions.
- **Manage Recordings**: Oversee your meeting recordings, including options to download or delete them.
- **Meeting Analytics**: Display insightful analytics and statistics related to your meetings.
- **Zoom API Integration**: Seamless interaction with the Zoom platform through its API.
- **Webhooks**: Integration with Zoom application webhooks to track when meetings start and end.

## Contributing

Contributions to AutoZoomManager are always welcome! If you encounter any issues or have suggestions for improvements, feel free to submit a pull request or open an issue on this GitHub repository.

## License

This project is licensed under the MIT License.
