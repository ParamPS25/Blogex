# BlogEx
BlogEx is a blog application where user can create account to add blogs with coverImage , add comments, 
read full blog and summarize that blog with ai , also main focus was on learning backend(node express mongo atlas ejs)
so used minimal frontend also it implements jwt auth via cookie  , password hashing and gemini ai integration for summary. 

## Technologies Used
Backend: Node.js, Express, MongoDB Atlas, EJS <br>
Frontend: Minimal frontend with EJS templates <br>
Authentication: JWT (via cookies), bcrypt for password hashing<br>
AI Integration: Gemini AI for blog summarization<br>

## Live link:
>[!NOTE]
>The application is deployed on Render’s free tier, which provides 0.1 CPU and 512MB RAM. <br>
Due to these limitations, you may need to reload the page twice if you encounter ‘not exist’ errors or if image loading takes time.<br>
live link : https://blogex.onrender.com/

## Installation
Clone the repository
``` bash
git clone https://github.com/ParamPS25/Blogex.git
```
Install dependencies
```
npm install

````
Set up environment variables: Create a .env file in the root directory and add the following:
```
ACCESS_TOKEN_SECRET_KEY = your_jwt_secret
API_KEY = your_gemini_api_key
PORT = 8080
MONGO_URL= your_mongodb_atlas_uri
```
Start the application
```
npm start

```


