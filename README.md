# 🏡 WonderLust - Travel Listing Web Application

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)

## 📋 Table of Contents

- [Project Introduction](#-project-introduction)
- [MVC Architecture](#-mvc-architecture-explained)
- [Features & Functionality](#-features--functionality)
- [Database Design](#-database-design--er-diagram)
- [Packages Used](#-packages-used)
- [Folder Structure](#-folder-structure)
- [What I Learned](#-what-i-learned-from-this-project)
- [How to Run](#-how-to-run-the-project)
- [Future Improvements](#-future-improvements)

---

## 🌟 Project Introduction

**WonderLust** is a full-stack travel listing web application built with **Node.js**, **Express.js**, and **MongoDB**. It allows users to explore, create, edit, and delete travel property listings similar to platforms like Airbnb. Users can also leave reviews and ratings for listings, upload images, and interact with an interactive map showing property locations.

### Purpose

The main purpose of this project is to:

- Provide a platform for users to share and discover unique travel accommodations
- Demonstrate a complete **MVC (Model-View-Controller)** architecture
- Implement user authentication and authorization
- Handle file uploads with cloud storage
- Build a RESTful API with proper error handling

### Key Highlights

- ✅ User authentication with **Passport.js**
- ✅ Image uploads via **Multer** and **Cloudinary**
- ✅ Review and rating system
- ✅ Authorization middleware to protect routes
- ✅ Interactive maps using **Leaflet** and **Geoapify API**
- ✅ Session management with **MongoDB store**
- ✅ Flash messages for user feedback
- ✅ Responsive UI with **Bootstrap 5**

---

## 🏗️ MVC Architecture Explained

This project strictly follows the **MVC (Model-View-Controller)** design pattern, which separates the application into three interconnected components.

### What is MVC?

| Layer          | Responsibility                                      | Files in Project                                                           |
| -------------- | --------------------------------------------------- | -------------------------------------------------------------------------- |
| **Model**      | Database schema and business logic                  | `models/user.js`, `models/listing.js`, `models/review.js`                  |
| **View**       | User interface (HTML templates)                     | `views/` folder with EJS templates                                         |
| **Controller** | Handles requests, processes data, returns responses | `controllers/listings.js`, `controllers/reviews.js`, `controllers/user.js` |

### Request Flow in WonderLust

```
User Action (Browser)
    ↓
Routes (routes/listing.js)
    ↓
Middleware (authentication, validation)
    ↓
Controller (controllers/listings.js)
    ↓
Model (models/listing.js - MongoDB)
    ↓
Controller processes data
    ↓
View (views/listings/show.ejs)
    ↓
Response sent to Browser
```

### Detailed Breakdown

#### 1. **Models** (`models/`)

Models define the **structure of data** stored in MongoDB using Mongoose schemas.

**Example: Listing Model**

```javascript
// models/listing.js
const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image: { url: String, filename: String },
  price: Number,
  location: String,
  country: String,
  review: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
```

**Key Models:**

- **User**: Stores user credentials (username, email, hashed password)
- **Listing**: Stores property details (title, price, location, images, owner)
- **Review**: Stores user reviews (rating, comment, author)

#### 2. **Views** (`views/`)

Views are **EJS templates** that render dynamic HTML.

**Structure:**

```
views/
├── layouts/
│   └── boilerplate.ejs       # Main layout with navbar/footer
├── listings/
│   ├── index.ejs             # All listings page
│   ├── show.ejs              # Single listing detail
│   ├── new.ejs               # Create listing form
│   └── edit.ejs              # Edit listing form
├── users/
│   ├── login.ejs             # Login page
│   └── signup.ejs            # Signup page
└── includes/
    ├── navbar.ejs            # Navigation bar
    ├── footer.ejs            # Footer
    └── flash.ejs             # Flash messages
```

#### 3. **Controllers** (`controllers/`)

Controllers contain the **business logic** and handle requests.

**Example: Listing Controller**

```javascript
// controllers/listings.js
module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const list = await Listing.findById(id)
    .populate({ path: "review", populate: { path: "author" } })
    .populate("owner");
  res.render("./listings/show.ejs", { list });
};
```

**Controllers:**

- `listings.js`: Handles CRUD operations for listings
- `reviews.js`: Handles creating and deleting reviews
- `user.js`: Handles signup, login, logout

#### 4. **Routes** (`routes/`)

Routes define the **URL endpoints** and connect them to controllers.

**Example: Listing Routes**

```javascript
// routes/listing.js
router
  .route("/:id")
  .get(wrapAsync(listingsController.showListing)) // GET /listings/:id
  .put(
    isLoggedIn,
    upload.single("image"),
    wrapAsync(listingsController.updateListing)
  ) // PUT /listings/:id
  .delete(isLoggedIn, wrapAsync(listingsController.deleteListing)); // DELETE /listings/:id
```

---

## ✨ Features & Functionality

### 1. 🔐 User Authentication

**How it works:**

- Uses **Passport.js** with the `passport-local-mongoose` plugin
- Passwords are hashed using **pbkdf2** algorithm (built into passport-local-mongoose)
- Sessions stored in MongoDB using `connect-mongo`

**Flow:**

1. User submits signup form → `POST /signup`
2. Controller creates new User with `User.register(user, password)`
3. Password is automatically hashed and user is saved
4. User is logged in using `req.login()`
5. Session created and stored in MongoDB

**Code Example:**

```javascript
// controllers/user.js
module.exports.signup = async (req, res) => {
  let { username, email, password } = req.body;
  let user = new User({ email, username });
  let newUser = await User.register(user, password); // Hashes password
  req.login(newUser, (err) => {
    req.flash("success", "Successfully Logged In!");
    res.redirect("/listings");
  });
};
```

### 2. 📝 CRUD Operations for Listings

| Operation  | Route           | Method | Description         |
| ---------- | --------------- | ------ | ------------------- |
| **Create** | `/listings`     | POST   | Create new listing  |
| **Read**   | `/listings`     | GET    | View all listings   |
| **Read**   | `/listings/:id` | GET    | View single listing |
| **Update** | `/listings/:id` | PUT    | Edit listing        |
| **Delete** | `/listings/:id` | DELETE | Delete listing      |

**Authorization:** Only the owner of a listing can edit or delete it.

**Code Example:**

```javascript
// middleware.js - Authorization check
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
```

### 3. 📸 Image Upload (Multer + Cloudinary)

**How it works:**

1. User selects an image in the form
2. **Multer** middleware intercepts the file upload
3. File is sent to **Cloudinary** cloud storage
4. Cloudinary returns a URL and filename
5. URL is saved in MongoDB

**Configuration:**

```javascript
// cloudConfig.js
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "wonderLUST",
    allowerdformats: ["png", "jpeg", "jpg"],
  },
});
```

**Usage in Route:**

```javascript
router.post(
  "/",
  isLoggedIn,
  upload.single("listing[image]"),
  wrapAsync(listingsController.createListing)
);
```

### 4. ⭐ Reviews System

Users can:

- Leave star ratings (1-5 stars)
- Write comments
- Delete their own reviews

**Schema Relationship:**

```javascript
// models/listing.js
review: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }]

// models/review.js
author: { type: Schema.Types.ObjectId, ref: "User" }
```

**Populating Reviews:**

```javascript
const list = await Listing.findById(id)
  .populate({
    path: "review",
    populate: { path: "author" }, // Nested populate
  })
  .populate("owner");
```

### 5. 🔒 Authorization Middleware

**Purpose:** Prevent unauthorized users from performing actions

**Implementation:**

```javascript
// middleware.js
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; // Save intended URL
    req.flash("error", "You must login first!");
    return res.redirect("/login");
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
```

### 6. 💬 Flash Messages

**Purpose:** Provide feedback to users (success/error messages)

**How it works:**

1. Controller sets flash message: `req.flash("success", "Listing created!")`
2. Middleware passes it to views: `res.locals.success = req.flash("success")`
3. View displays it: `<%= success %>`

**Example:**

```javascript
// app.js
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});
```

### 7. 🗺️ Interactive Maps

**Technology:** Leaflet.js + Geoapify Geocoding API

**How it works:**

1. Listing location (e.g., "Malibu, United States") is sent to Geoapify
2. API returns latitude and longitude
3. Leaflet displays an interactive map with a marker
4. Falls back to Mumbai if location not found

### 8. ⚠️ Error Handling

**Custom Error Class:**

```javascript
// utils/ExpressError.js
class ExpressError extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}
```

**Global Error Handler:**

```javascript
// app.js
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("listings/error.ejs", { err });
});
```

**Async Error Wrapper:**

```javascript
// utils/wrapAsync.js
function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next); // Passes errors to global handler
  };
}
```

### 9. 🔄 Session Management

**Configuration:**

```javascript
const sessionOptions = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_API,
    crypto: { secret: process.env.SECRET },
    touchAfter: 24 * 3600, // Update session once per 24 hours
  }),
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, // Prevents XSS attacks
  },
};
```

---

## 🗄️ Database Design & ER Diagram

### Collections

#### 1. **User Collection**

```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (required),
  password: String (hashed automatically)
}
```

#### 2. **Listing Collection**

```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  image: {
    url: String,
    filename: String
  },
  price: Number,
  location: String,
  country: String,
  owner: ObjectId (ref: "User"),
  review: [ObjectId] (ref: "Review")
}
```

#### 3. **Review Collection**

```javascript
{
  _id: ObjectId,
  comment: String,
  rating: Number (1-5),
  createdAt: Date (default: Date.now),
  author: ObjectId (ref: "User")
}
```

### Relationships

```
User ──┬─── owns ──→ Listing
       └─── writes ──→ Review
                         ↓
                    belongs to
                         ↓
                      Listing
```

| Relationship     | Type        | Description                           |
| ---------------- | ----------- | ------------------------------------- |
| User → Listing   | One-to-Many | One user can create multiple listings |
| User → Review    | One-to-Many | One user can write multiple reviews   |
| Listing → Review | One-to-Many | One listing can have multiple reviews |

### Why This Schema?

1. **Normalization:** Avoids data duplication
2. **Referential Integrity:** Uses ObjectId references
3. **Population:** Mongoose `populate()` replaces IDs with actual documents
4. **Scalability:** Easy to add new fields or relationships

### Example Queries

**Get listing with all reviews and review authors:**

```javascript
const listing = await Listing.findById(id)
  .populate({
    path: "review",
    populate: { path: "author" }, // Nested population
  })
  .populate("owner");
```

**Cascade Delete Reviews when Listing is deleted:**

```javascript
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.review } });
  }
});
```

---

## 📦 Packages Used

### Core Dependencies

| Package      | Version | Purpose                   | Usage in Project                                |
| ------------ | ------- | ------------------------- | ----------------------------------------------- |
| **express**  | ^5.2.1  | Web application framework | Main server framework, routing, middleware      |
| **mongoose** | ^8.9.5  | MongoDB object modeling   | Database connection, schema definition, queries |
| **ejs**      | ^3.1.10 | Templating engine         | Rendering dynamic HTML views                    |
| **ejs-mate** | ^4.0.0  | Layout support for EJS    | Creating reusable layouts (boilerplate.ejs)     |

### Authentication & Security

| Package | Version | Purpose | Usage |
|---------|---------|---------|-------|
| **passport** | ^0.7.0 | Authentication middleware | User authentication framework |
| **passport-local** | ^1.0.0 | Local strategy for Passport | Username/password authentication |
| **passport-local-mongoose** | ^8.0.0 | Passport-Mongoose integration | Automatic password hashing, user methods |
| **express-session** | ^1.18.2 | Session middleware | Managing user sessions |
| **connect-mongo** | ^5.0.0 | MongoDB session store | Storing sessions in MongoDB |
| **connect-flash** | ^0.1.1 | Flash message middleware | Temporary messages (success/error) |
| **cookie-parser** | ^1.4.7 | Cookie parsing | Parsing cookies from requests |

**How Authentication Works:**

```javascript
// 1. Configure passport
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// 2. Protect routes
router.get("/listings/new", isLoggedIn, listingsController.renderNewForm);

// 3. Check authentication
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // Provided by Passport
    return res.redirect("/login");
  }
  next();
};
```

### File Upload

| Package                   | Version | Purpose                   | Usage                          |
|---------------------------|---------|---------------------------|---------------------------------|
| multer                    | ^2.0.2  | Handling multipart/form-data | Processing file uploads        |
| cloudinary                | ^1.41.3 | Cloud storage service     | Storing images in cloud         |
| multer-storage-cloudinary | ^4.0.0  | Cloudinary storage engine | Integrating Multer with Cloudinary |


**Upload Flow:**

```javascript
// 1. Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: { folder: "wonderLUST" },
});

// 2. Create multer instance
const upload = multer({ storage });

// 3. Use in route
router.post("/", upload.single("listing[image]"), createListing);

// 4. Access uploaded file
let url = req.file.path; // Cloudinary URL
let filename = req.file.filename; // Cloudinary public_id
```

### Validation & Error Handling

| Package | Purpose | Usage |
|---------|---------|-------|
| **joi** | Data validation | Validating review input data |

**Example:**

```javascript
const reviewSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().required(),
});

function validateReview(req, res, next) {
  const { error } = reviewSchema.validate(req.body.review);
  if (error) return res.status(400).send(error.details[0].message);
  next();
}
```

### Utilities

| Package | Version | Purpose | Usage |
|---------|---------|---------|-------|
| **method-override** | ^3.0.0 | HTTP verb spoofing | Enabling PUT/DELETE in forms |
| **dotenv** | ^17.2.3 | Environment variables | Loading .env file |
| **axios** | ^1.13.2 | HTTP client | Making API requests (optional future use) |

**Method Override Example:**

```html
<!-- Form that sends DELETE request -->
<form method="POST" action="/listings/<%= list._id %>?_method=DELETE">
  <button>Delete</button>
</form>
```

```javascript
// app.js
app.use(methodOverride("_method")); // Converts POST to DELETE
```

### Why These Packages?

| Requirement                 | Package Used  | Reason                                 |
| --------------------------- | ------------- | -------------------------------------- |
| Need MongoDB ORM            | Mongoose      | Industry standard, schema validation   |
| Need user authentication    | Passport.js   | Flexible, supports multiple strategies |
| Need cloud image storage    | Cloudinary    | Free tier, CDN, image optimization     |
| Need sessions in production | connect-mongo | Prevents memory leaks, persists data   |
| Need template engine        | EJS           | JavaScript-based, easy to learn        |
| Need input validation       | Joi           | Schema-based validation, great errors  |

---

## 📁 Folder Structure

```
wonderlust/
│
├── controllers/              # Business logic layer
│   ├── listings.js          # CRUD operations for listings
│   ├── reviews.js           # Create/delete reviews
│   └── user.js              # Signup, login, logout
│
├── models/                  # Database schemas
│   ├── listing.js           # Listing schema with owner & reviews
│   ├── review.js            # Review schema with author
│   └── user.js              # User schema with passport plugin
│
├── routes/                  # URL routing
│   ├── listing.js           # Routes for /listings
│   ├── review.js            # Routes for /listings/:id/reviews
│   └── user.js              # Routes for /signup, /login, /logout
│
├── views/                   # EJS templates
│   ├── layouts/
│   │   └── boilerplate.ejs  # Main layout (navbar, footer, scripts)
│   ├── listings/
│   │   ├── index.ejs        # All listings grid
│   │   ├── show.ejs         # Single listing with map & reviews
│   │   ├── new.ejs          # Create listing form
│   │   ├── edit.ejs         # Edit listing form
│   │   └── error.ejs        # Error page
│   ├── users/
│   │   ├── signup.ejs       # Signup form
│   │   └── login.ejs        # Login form
│   └── includes/
│       ├── navbar.ejs       # Navigation bar
│       ├── footer.ejs       # Footer with links
│       └── flash.ejs        # Success/error messages
│
├── public/                  # Static assets
│   ├── css/
│   │   ├── style.css        # Main stylesheet
│   │   └── rating.css       # Star rating styles
│   └── js/
│       └── script.js        # Form validation script
│
├── utils/                   # Helper functions
│   ├── ExpressError.js      # Custom error class
│   ├── wrapAsync.js         # Async error wrapper
│   └── reviewValidation.js  # Joi validation middleware
│
├── init/                    # Database initialization
│   ├── data.js              # Sample listings data
│   └── index.js             # Script to seed database
│
├── middleware.js            # Custom middleware (auth, authorization)
├── cloudConfig.js           # Cloudinary & Multer configuration
├── app.js                   # Main application file
├── .env                     # Environment variables (not in repo)
├── .gitignore               # Ignored files
├── package.json             # Dependencies
└── README.md                # This file
```

### Key Files Explained

| File                | Purpose                                                       |
| ------------------- | ------------------------------------------------------------- |
| **app.js**          | Entry point, middleware setup, route mounting, error handling |
| **middleware.js**   | Authentication & authorization checks                         |
| **cloudConfig.js**  | Configures Cloudinary for image uploads                       |
| **wrapAsync.js**    | Wraps async functions to catch errors                         |
| **ExpressError.js** | Custom error class with statusCode                            |

---

## 🎓 What I Learned From This Project

### 1. **MVC Architecture**

- Separation of concerns: Models, Views, Controllers
- Clean code organization
- Scalability: Easy to add new features
- Maintainability: Each layer is independent

### 2. **RESTful API Design**

- Proper HTTP methods (GET, POST, PUT, DELETE)
- Resource-based URLs (`/listings`, `/listings/:id`)
- Status codes (200, 404, 500, etc.)
- CRUD operations

### 3. **MongoDB & Mongoose**

- Schema design and relationships
- One-to-Many relationships using ObjectId references
- Population (replacing IDs with actual documents)
- Cascade deletes using middleware
- Indexing for performance

### 4. **Authentication & Authorization**

- Difference between authentication (who you are) and authorization (what you can do)
- Session-based authentication with Passport.js
- Password hashing with pbkdf2
- Protecting routes with middleware
- Session storage in MongoDB for production

### 5. **File Uploads**

- Handling `multipart/form-data` with Multer
- Storing files in cloud (Cloudinary) vs local server
- Generating unique filenames
- Optimizing images for web

### 6. **Middleware Concept**

- Request-response cycle
- Order of middleware matters
- Custom middleware for authentication
- Error-handling middleware (4 parameters)
- Third-party middleware (express-session, multer, etc.)

### 7. **Error Handling**

- Custom error classes
- Async error handling with try-catch
- Global error handler
- User-friendly error pages
- Validation errors

### 8. **Template Engines (EJS)**

- Embedding JavaScript in HTML
- Layouts and partials
- Passing data from controllers to views
- Conditional rendering
- Loops in templates

### 9. **Security Best Practices**

- Password hashing (never store plain text)
- HttpOnly cookies (prevent XSS)
- Session expiration
- Authorization checks
- Input validation

### 10. **Development Workflow**

- Environment variables with dotenv
- Git version control
- Debugging with console.log and breakpoints
- Testing routes with Postman/browser
- Reading documentation

### 11. **Frontend Integration**

- Bootstrap for responsive design
- Font Awesome icons
- JavaScript for client-side validation
- Leaflet.js for maps
- API integration (Geoapify)

### 12. **Database Seeding**

- Creating sample data
- Automating database population
- Resetting database for testing

---

## 🚀 How to Run the Project

### Prerequisites

- Node.js (v18 or higher)
- MongoDB installed locally or MongoDB Atlas account
- Cloudinary account (free tier)
- Geoapify API key (free)

### Installation Steps

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/wonderlust.git
cd wonderlust
```

2. **Install dependencies**

```bash
npm install
```

3. **Create `.env` file in root directory**

```env
# MongoDB Connection
MONGO_API=mongodb://localhost:27017/wonderlust
# Or for MongoDB Atlas:
# MONGO_API=mongodb+srv://username:password@cluster.mongodb.net/wonderlust

# Session Secret (use a random string)
SECRET=your_secret_key_here

# Cloudinary Configuration
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

# Geoapify API Key
GEOAPIFY_API_KEY=your_geoapify_api_key

# Environment
NODE_ENV=development
```

4. **Seed the database (optional)**

```bash
cd init
node index.js
cd ..
```

5. **Run the application**

```bash
node app.js
```

6. **Open in browser**

```
http://localhost:8080
```

### Getting API Keys

#### Cloudinary

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Dashboard → Account Details
3. Copy: Cloud Name, API Key, API Secret

#### Geoapify

1. Sign up at [geoapify.com](https://www.geoapify.com)
2. Dashboard → API Keys
3. Copy API key

### Production Deployment

For deployment to platforms like Render, Heroku, or Railway:

1. Set environment variables in platform dashboard
2. Change `NODE_ENV=production`
3. Uncomment `store` in session options (line 62, app.js)
4. Use MongoDB Atlas instead of local MongoDB

---

## 🔮 Future Improvements

### 1. **Search & Filter Functionality**

- Search listings by title, location, country
- Filter by price range
- Sort by price, rating, newest
- Category-based filtering (mountains, beaches, cities, etc.)

### 2. **Pagination**

- Implement pagination for listings (10-20 per page)
- Infinite scroll option
- Improve performance with large datasets

### 3. **Advanced Authorization**

- Admin role with dashboard
- Moderator role to approve/reject listings
- User permissions management

### 4. **Wishlist/Favorites**

- Users can save favorite listings
- View saved listings in profile
- Email notifications for price drops

### 5. **Booking System**

- Calendar availability
- Date range selection
- Payment gateway integration (Stripe/Razorpay)
- Booking confirmation emails

### 6. **REST API Version**

- Create `/api/v1` routes
- JSON responses instead of HTML
- JWT authentication instead of sessions
- API documentation with Swagger

### 7. **Real-time Features**

- Live chat between owner and guest
- Notifications using Socket.io
- Real-time review updates

### 8. **Enhanced Reviews**

- Upload images in reviews
- Helpful/Not Helpful votes
- Report inappropriate reviews
- Reply to reviews (owner response)

### 9. **User Profile**

- Edit profile information
- Upload profile picture
- View own listings and reviews
- Account settings

### 10. **Analytics Dashboard**

- View count for listings
- Popular listings
- Revenue tracking
- User activity graphs

### 11. **SEO & Performance**

- Meta tags for social media sharing
- Image lazy loading
- Server-side rendering (SSR)
- Caching with Redis

### 12. **Mobile App**

- React Native or Flutter app
- Push notifications
- Offline mode

### 13. **Email Notifications**

- Welcome email on signup
- Password reset
- New review notifications
- Newsletter

### 14. **Testing**

- Unit tests with Jest
- Integration tests
- E2E tests with Cypress
- Code coverage reports

### 15. **Security Enhancements**

- Rate limiting (prevent DDoS)
- CSRF protection
- Helmet.js for HTTP headers
- Two-factor authentication (2FA)

---

## 📄 License

This project is licensed under the ISC License.

---

## 👤 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/harshh3400)


---

## 🙏 Acknowledgments

- **Apna College** for the full-stack development course
- **Unsplash** for listing images
- **Cloudinary** for image hosting
- **MongoDB Atlas** for database hosting
- **Geoapify** for geocoding API

---

## 🐛 Known Issues

- Map defaults to Mumbai if location is not found by Geoapify
- Session store configuration commented out in development (line 62, app.js)
- Image upload size limit not enforced on client-side

---

## 📞 Support

If you have any questions or issues, please open an issue on GitHub or contact me directly.

---

**⭐ If you found this project helpful, please give it a star!**
