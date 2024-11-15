### Welcome to Movie_API 

This REST API serves as the communication bridge between myFlix frontend applications (React and Angular) and the MongoDB Database. It facilitates the retrieval of movie data from the database and delivers it to the frontend in response to relevant requests.

Users can perform various actions, including registration, login, accessing movie details, adding movies to their favorites, editing user information, and deleting their accounts.

### API Endpoints and CORS

The API is hosted at [https://movie-api-eqfh-mnccd0sxy-torbalansky.vercel.app/](https://movie-api-eqfh-mnccd0sxy-torbalansky.vercel.app/).

For detailed information on API endpoints and CORS configurations, please visit the [Documentation Page](https://documentation-api-jihk.vercel.app/).

### API Endpoints Overview

<table cellpadding="8" cellspacing="0" border="1" style="border-collapse: collapse; width: 100%;">
    <thead>
        <tr style="background-color: black; color: white;">
            <th>Request</th>
            <th>URL</th>
            <th>HTTP Method</th>
            <th>Response</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Returns a list of all movies</td>
            <td>/movies</td>
            <td>GET</td>
            <td>A JSON object containing data about all movies</td>
        </tr>
        <tr>
            <td>Returns data about a single movie by title</td>
            <td>/movies/title/:Title</td>
            <td>GET</td>
            <td>A JSON object containing data about the movie's description, genre, director, image URL, and whether it's featured or not</td>
        </tr>
        <tr>
            <td>Returns data about a genre by name</td>
            <td>/movies/genre/:genreName</td>
            <td>GET</td>
            <td>A JSON object containing data about the genre's description</td>
        </tr>
        <tr>
            <td>Returns data about a director by name</td>
            <td>/movies/directors/:directorName</td>
            <td>GET</td>
            <td>A JSON object containing data about the director's bio</td>
        </tr>
        <tr>
            <td>Returns a list of all users</td>
            <td>/users</td>
            <td>GET</td>
            <td>A JSON object containing data about all users</td>
        </tr>
        <tr>
            <td>Returns data about a specific user</td>
            <td>/users/:username</td>
            <td>GET</td>
            <td>A JSON object containing data about the user's username, email, password, birthday, and the list of favorite movies if there are any</td>
        </tr>
        <tr>
            <td>Allows new users to register</td>
            <td>/users</td>
            <td>POST</td>
            <td>A JSON object indicating successful registration of the account</td>
        </tr>
        <tr>
            <td>Allows users to add a movie to their list of favorites</td>
            <td>/users/:Username/movies/:MovieID</td>
            <td>POST</td>
            <td>A JSON object indicating that the movie has been added to the user's list of favorites</td>
        </tr>
        <tr>
            <td>Allows users to update their user info</td>
            <td>/users/:Username</td>
            <td>PUT</td>
            <td>A JSON object indicating successful update of user info</td>
        </tr>
        <tr>
            <td>Allows users to remove a movie from their list of favorites</td>
            <td>/users/:Username/movies/:MovieID</td>
            <td>DELETE</td>
            <td>A JSON object indicating that the movie has been removed from the user's list of favorites</td>
        </tr>
        <tr>
            <td>Allows existing users to deregister</td>
            <td>/users/:Username</td>
            <td>DELETE</td>
            <td>A text message indicating successful deletion of the user account</td>
        </tr>
    </tbody>
</table>


### Tools Used

**Backend**

- Node.js

**Framework**

- Express

**Non-relational Database**

- MongoDB (Atlas)

**Hosting**

- Vercel

**Dependencies**

Please check the `package.json` file for a list of dependencies used in this project.
