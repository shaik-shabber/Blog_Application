## Development Workflow

For development, you can run both the frontend and backend servers concurrently using `npm run dev` in the root directory of your project if you've configured a script to run both simultaneously, or manually start them in separate terminal windows.

- **Frontend**: The React app will be running on [http://localhost:3000](http://localhost:3000).
- **Backend**: The backend will run on the specified port (usually `http://localhost:5000`).

Use `npm run build` to create production builds for both the frontend and backend.

## Available Routes

### Frontend Routes
- `/` - Home page with a list of blog posts
- `/login` - Login page
- `/register` - Registration page
- `/create` - Create a new post (requires authentication)
- `/edit/:id` - Edit an existing post (requires authentication)
- `/profile` - View and update user profile (requires authentication)
- `/myblog` - View all posts by the authenticated user

### Backend Routes
- **/api/auth/register** - `POST` - Register a new user
- **/api/auth/login** - `POST` - Login a user
- **/api/posts** - `GET` - Retrieve all posts
- **/api/posts** - `POST` - Create a new post (requires authentication)
- **/api/posts/:id** - `GET` - Retrieve a single post by ID
- **/api/posts/:id** - `PUT` - Update a post by ID (requires authentication)
- **/api/posts/:id** - `DELETE` - Delete a post by ID (requires authentication)
- **/api/posts/user/:authorName** - `GET` - Retrieve posts by a specific author
- **/api/posts/title/:title** - `GET` - Retrieve posts by title
- **/api/user/profile** - `GET` - Get the authenticated user's profile
- **/api/user/profile** - `PUT` - Update the authenticated user's profile

## Running Tests

If you want to run tests for both the backend and frontend:

- **Backend Tests**: Navigate to the backend directory and run:
    ```bash
    npm test
    ```
- **Frontend Tests**: Navigate to the frontend directory and run:
    ```bash
    npm test
    ```

## Deployment

To deploy your app to a production environment:

1. **Build the React frontend** using:
    ```bash
    npm run build
    ```

2. **Set up your backend and frontend on a hosting provider** such as [Heroku](https://www.heroku.com/), [Netlify](https://www.netlify.com/), or [Vercel](https://vercel.com/).

3. **Environment Variables**: Make sure to configure the necessary environment variables in your hosting provider's dashboard:
    - MongoDB connection string (`MONGO_URI`)
    - JWT secret key (`JWT_SECRET`)
    - Port (`PORT` for backend)

    For example, on **Heroku**, you can set the environment variables under the "Settings" tab in the "Config Vars" section.

    On **Netlify** or **Vercel**, you can also configure environment variables in their respective dashboards under "Build & Deploy" settings.

4. **Backend Deployment**:
    - Ensure the backend is configured to use environment variables properly for the database connection, JWT, and port.
    - For **Heroku**, use the following steps:
        - `git push heroku master` to deploy your backend.
        - If you're using **MongoDB Atlas** for database hosting, make sure the MongoDB URI is correct in the environment variables.

5. **Frontend Deployment**:
    - For **Netlify** or **Vercel**, you can directly link your GitHub repository, and the platform will automatically build and deploy your React app.
    - For **Heroku**, you can also host both frontend and backend together. Make sure to configure `proxy` in your `package.json` file for the frontend to call the backend API.

Once the deployment is successful, your app should be live and accessible via the URL provided by the hosting provider.

## Contributing

Feel free to fork the repository, create a new branch, and submit a pull request. Make sure to follow the code conventions and write tests for your contributions.

1. **Fork the Repository**: Click on the "Fork" button on GitHub to create a copy of the repository under your own account.
2. **Create a New Branch**: It's a good practice to create a new branch for every feature or fix you're working on:
    ```bash
    git checkout -b new-feature-branch
    ```
3. **Make Changes**: Make the necessary changes, add tests if applicable, and commit them.
4. **Push Changes**: Push your changes to your forked repository:
    ```bash
    git push origin new-feature-branch
    ```

5. **Submit a Pull Request**: Go to the original repository on GitHub and click "New Pull Request." Provide a description of what you've done.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
# Blog-Application
