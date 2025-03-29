Welcome to MovieStars

MovieStars is a web application designed to offer an interactive movie-browsing experience. It integrates APIs to fetch movie data and trailers, showcasing trending movies, search functionalities, and responsive design. This project explores working with APIs, implementing a dynamic frontend, and deploying the application for public use.

Introduction

MovieStars is your go-to platform to:

• Discover Trending Movies: Browse top picks and trending movies from the comfort of your home.

• Search with Ease: Use the search bar to find movies by title, genre, or other keywords.

• Watch Trailers: Instantly access YouTube trailers for movies of your choice.

This project also serves as a learning experience in:

API integration for real-time data retrieval.

Responsive web design principles.

Deployment and server management practices.

Features

Movie Search:

• Type in a keyword and retrieve matching movies with posters and titles.

Trending and Top Picks:

• Predefined categories like Trending Now and Top Picks provide ready-made movie suggestions.

Watch Trailers:

• Click the "Play" button on any movie card to view its trailer in an embedded YouTube player.

Responsive Design:

• The application adapts seamlessly to both mobile and desktop devices.

Installation and Setup

Local Setup git clone https://github.com/Ntwali111/MovieStars

cd MovieStars

• Obtain API keys:

• OMDb API: Sign up at OMDb API and get your free API key.

• YouTube Data API: Get a key from the Google Cloud Console.

• Configure API keys:

Deployment

This project is deployed on load-balanced servers for scalability and reliability. Below is the step-by-step process:

Prepare Files

Zip the project directory:
zip -r MovieStars.zip MovieStars

upload to the servers

scp MovieStars.zip ubuntu@web-01:/var/www/html/

scp MovieStars.zip ubuntu@web-02:/var/www/html/

ssh ubuntu@web-01

sudo apt-get install unzip # If unzip is not installed

cd /var/www/html/

unzip MovieStars.zip

server {
listen 80;
server_name web-01;

root /var/www/html/;  
index index.html;  

location / {  
    try_files $uri $uri/ =404;  
}  
}

sudo systemctl restart nginx
frontend MovieStars_front
bind *:80
default_backend MovieStars_backend

backend MovieStars_backend
balance roundrobin
server web-01 54.89.152.170:80 check
server web-0234.230.31.95:80 check

The load balancer is efficiently configured using HAProxy, distributing incoming traffic evenly between web-01 and web-02. The frontend, nshuti_front, listens on ports 80 and 443, with SSL certificates stored at /etc/letsencrypt/live/www.nshuti.tech/nshuti.pem. 5. Also, to view the application use the lb-01 IP address or www.nshuti.tech 6. 7.

APIs Used OMDb API • Base URL: http://www.omdbapi.com/ • Fetches movie data including titles, posters, and descriptions. YouTube Data API • Base URL: https://www.googleapis.com/youtube/v3 • Retrieves movie trailers by searching YouTube with the movie title.

Youtube demo 

Link: #########

Challenges and Solutions

API Rate Limits: Implemented caching to minimize redundant API calls and handle rate limits effectively.
Responsive Design: Leveraged CSS media queries to ensure the app works on devices of all sizes.
API Errors: Added error handling to alert users if API responses fail or exceed rate limits.
Deployment Configuration: Ensured servers and load balancers were properly configured to avoid downtime.
Lessons Learned

• Integrating multiple APIs into a single project.

• Deploying a web application on a load-balanced setup.

• Writing clean, modular JavaScript for interactivity.

• Handling errors gracefully for a better user experience.

Future Improvements

• User Accounts: Allow users to save favorite movies and view watch history.

• Advanced Filters: Add filters for genres, ratings, and release years.

• Offline Mode: Implement caching for offline access to previously viewed movies.

Credits • OMDb API: For providing detailed movie information. • YouTube Data API: For enabling trailer playback functionality. • CSS Tricks: For responsive design inspiration. • African Leadership University: For providing server resources and mentorship.

Conclusion MovieStars is a dynamic web app combining the power of APIs and responsive design to deliver an engaging movie-browsing experience. Whether you're a developer learning API integration or a movie enthusiast, MovieStars has something for everyone.

