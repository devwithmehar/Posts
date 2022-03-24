# Hatchways Work Simulation

## General Instructions

For this project, you are provided a starting code for a back end JSON API and are to build on this starting code by adding new features. The starting code is for the application described in the section below, and you can find your assigned work on the Issues tab of this repository. Please open a **single pull request** with all of the changes needed to implement the features described in the issue, then return to the Hatchways dashboard to mark your assessment as completed.

We will use [this rubric](https://drive.google.com/file/d/1faFe4dn9C-60QIXWdzKvkm6pjHXFJ3pV/view?usp=sharing) to evaluate your submission. Please note that if your submission does not attempt to complete all of the requirements, or does not pass our plagiarism screening, we will be unable to provide feedback on it. Please contact hello@hatchways.io if you have any questions or concerns.

---

## Introduction to this Application

You will be modifying an existing server that provides an API for a blogging website. The database for the API has a collection of blog `Posts`, which include information about each blog post such as the text and author of the post, how many times the post has been “liked”, etc. Additionally, the database contains `Users`. Each blog post has an author, and the author for a new blog post must be a user already registered in the database.

Currently, the starting code has the following API routes already implemented:

- POST `/api/register` - Register a new author
- POST `/api/login` - Login for an existing author
- POST `/api/post` - Create a new post

---

## System Requirements

The current recommended [Node.js version](https://nodejs.org/en/) is 16

---

## Server

Create a `.env` file in the root directory, and copy the contents from [.env.sample](.env.sample)

### Setup


```
npm install
```

### Lint

```
npm run lint
```

### Development

```
npm run dev
```

---

## Database

### Setup

**Note: No database setup should be required to get started with running the project.**

This project uses SQLite, which stores your tables inside a file. It uses [Sequelize (v6)](https://sequelize.org/) as an ORM layer.

### Seed Data

We've included sample data that the application has been configured to use. If you want to re-seed the database, you can run `npm run seed`.


## Testing

### Example Curl Commands

You can log in as one of the seeded users with the following curl command:
```bash
curl --location --request POST 'localhost:5000/api/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "thomas",
    "password": "123456"
}'
```

Then you can use the token that comes back from the /login request to make an authenticated request to create a new blog post

```bash
curl --location --request POST 'localhost:5000/api/post' \
--header 'x-access-token: your-token-here' \
--header 'Content-Type: application/json' \
--data-raw '{
    "text": "This is some text for the blog post...",
    "tags": ["travel", "hotel"]
}'
```